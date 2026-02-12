import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Redis } from 'ioredis';
import { ethers } from 'ethers';
import { MerkleManager } from './merkle.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const port = process.env.PORT || 3001;

// Blockchain setup
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
const contractAddress = process.env.CONTRACT_ADDRESS || '';

// สถานะการประมวลผล
const BATCH_SIZE = 1000; // จำนวนโหวตต่อ Batch
const BATCH_INTERVAL_MS = 5 * 60 * 1000; // 5 นาที (หรือปรับได้ตามต้องการ)
let currentBatch: string[] = [];
const processedBatches: Record<string, string[]> = {}; // Store processed batches for validators
let batchTimer: NodeJS.Timeout | null = null;

// Live results tracking (in-memory for demo, should use Redis in production)
interface StationResults {
    id: string;
    name: string;
    province: string;
    district: string;
    totalVoters: number;
    votedCount: number;
    results: { candidate: string; votes: number; percentage: number }[];
    lastUpdate: string;
    merkleRoot: string;
}

const liveResults = new Map<string, StationResults>();

// Load election configuration
interface ElectionConfig {
    electionId: string;
    electionName: string;
    parties: Array<{
        id: string;
        name: string;
        shortName: string;
        color: string;
    }>;
    candidates: Array<{
        id: string;
        name: string;
        partyId: string;
        constituency: string;
        number: number;
    }>;
    constituencies: Array<{
        id: string;
        name: string;
        province: string;
        district: string;
        totalVoters: number;
    }>;
}

let electionConfig: ElectionConfig;
try {
    const configPath = path.resolve(process.cwd(), 'data', 'election-config.json');
    electionConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log(`Loaded election config: ${electionConfig.electionName}`);
    console.log(`Parties: ${electionConfig.parties.length}, Candidates: ${electionConfig.candidates.length}`);
} catch (error) {
    console.error('Failed to load election config:', error);
    process.exit(1);
}

// Mempool tracking
interface MempoolVote {
    id: string;
    stationId: string;
    timestamp: number;
    status: 'pending' | 'batched' | 'confirmed';
}

const mempool: MempoolVote[] = [];
const MAX_MEMPOOL_SIZE = 5000;

// Basic health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'aggregator',
        contract: contractAddress,
        connected: !!contractAddress
    });
});

// Partner Management
const PARTNERS_FILE = path.resolve(process.cwd(), 'data', 'partners.json');

app.get('/partners', (req, res) => {
    try {
        const data = fs.readFileSync(PARTNERS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read partners data' });
    }
});

app.post('/partners/register', (req, res) => {
    const { name, type, logo } = req.body;
    if (!name || !type) return res.status(400).json({ error: 'Missing Required Fields' });

    try {
        const data = JSON.parse(fs.readFileSync(PARTNERS_FILE, 'utf8'));
        const newPartner = {
            id: Date.now().toString(),
            name,
            type,
            nodes: 1, // Start with 1 node
            uptime: '100%',
            color: 'from-blue-400 to-indigo-600',
            logo: logo || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
        };
        data.push(newPartner);
        fs.writeFileSync(PARTNERS_FILE, JSON.stringify(data, null, 2));
        res.json({ message: 'Success', partner: newPartner });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register partner' });
    }
});

// Community Posts Management
const POSTS_FILE = path.resolve(process.cwd(), 'data', 'posts.json');

app.get('/posts', (req, res) => {
    try {
        const data = fs.readFileSync(POSTS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read posts data' });
    }
});

app.post('/posts', (req, res) => {
    const { user, role, content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    try {
        const data = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
        const newPost = {
            id: Date.now(),
            user: user || 'Anonymous',
            role: role || 'Citizen',
            content,
            likes: 0,
            comments: 0,
            time: 'เมื่อสักครู่',
            replies: []
        };
        data.unshift(newPost); // Newest first
        fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2));
        res.json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Endpoint for validators to fetch batch data
app.get('/batch/data/:batchId', (req, res) => {
    const { batchId } = req.params;
    const votes = processedBatches[batchId];
    if (!votes) {
        return res.status(404).json({ error: 'Batch not found' });
    }
    res.json({ batchId, votes });
});

// Endpoint to receive votes
app.post('/vote', async (req, res) => {
    const { vote, voterId, signature, stationId, stationName, province, district, candidate } = req.body;

    if (!vote || !voterId || !signature) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const voteData = JSON.stringify({ vote, voterId, signature, stationId, candidate, t: Date.now() });
    const voteId = `VOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add to mempool
    mempool.push({
        id: voteId,
        stationId: stationId || 'UNKNOWN',
        timestamp: Date.now(),
        status: 'pending'
    });

    // Keep mempool size manageable
    if (mempool.length > MAX_MEMPOOL_SIZE) {
        mempool.splice(0, mempool.length - MAX_MEMPOOL_SIZE);
    }

    // Update live results immediately
    if (stationId && candidate) {
        let station = liveResults.get(stationId);
        if (!station) {
            station = {
                id: stationId,
                name: stationName || `หน่วยเลือกตั้ง ${stationId}`,
                province: province || 'Unknown',
                district: district || 'Unknown',
                totalVoters: 0,
                votedCount: 0,
                results: [],
                lastUpdate: new Date().toISOString(),
                merkleRoot: ''
            };
            liveResults.set(stationId, station);
        }

        // Update vote count
        station.votedCount++;

        // Update candidate results
        const existingResult = station.results.find(r => r.candidate === candidate);
        if (existingResult) {
            existingResult.votes++;
        } else {
            station.results.push({ candidate, votes: 1, percentage: 0 });
        }

        // Recalculate percentages
        station.results.forEach(r => {
            r.percentage = station.votedCount > 0 ? (r.votes / station.votedCount) * 100 : 0;
        });

        station.lastUpdate = new Date().toISOString();
    }

    // 1. เก็บลง Queue (Redis) เพื่อความปลอดภัย
    await redis.lpush('votes_queue', voteData);

    // 2. เก็บลง Memory Batch เบื้องต้น (จะเปลี่ยนเป็น Worker ในเฟสถัดไป)
    currentBatch.push(voteData);

    // ตรวจสอบว่าครบ Batch หรือไม่
    if (currentBatch.length >= BATCH_SIZE) {
        console.log(`Batch size reached (${BATCH_SIZE}). Processing immediately...`);
        if (batchTimer) {
            clearTimeout(batchTimer);
            batchTimer = null;
        }
        processBatch();
    } else if (!batchTimer) {
        // ตั้งเวลารอ ถ้ายังไม่ครบ Batch Size
        console.log(`Starting batch timer (${BATCH_INTERVAL_MS / 1000}s). Current batch: ${currentBatch.length}`);
        batchTimer = setTimeout(() => {
            console.log(`Batch timer expired. Processing ${currentBatch.length} votes...`);
            processBatch();
            batchTimer = null;
        }, BATCH_INTERVAL_MS);
    }

    res.json({
        message: 'Vote received',
        batchStatus: {
            currentBatchSize: currentBatch.length,
            batchSizeLimit: BATCH_SIZE,
            willProcessIn: batchTimer ? `${BATCH_INTERVAL_MS / 1000}s or when ${BATCH_SIZE} votes reached` : 'Processing now'
        }
    });
});

/**
 * ฟังก์ชันประมวลผล Batch และส่งลง Blockchain
 */
async function processBatch() {
    if (currentBatch.length === 0) return;

    const votesToProcess = [...currentBatch];
    currentBatch = []; // Clear current batch

    console.log(`Processing batch of ${votesToProcess.length} votes...`);

    try {
        const root = MerkleManager.generateRoot(votesToProcess);
        console.log(`Generated Merkle Root: ${root}`);

        if (contractAddress) {
            const contract = new ethers.Contract(contractAddress, [
                "function updateVotingBatch(bytes32 _newRoot, bytes32[] calldata _voterHashes) external",
                "function currentVotingRoot() public view returns (bytes32)"
            ], wallet);

            // Extract voter hashes from the batch
            const voterHashes = votesToProcess.map(voteStr => {
                const data = JSON.parse(voteStr);
                // Hash the voterId (ThaiD) with a salt for privacy if needed, 
                // or just use a derived hash to prevent double voting.
                return ethers.keccak256(ethers.toUtf8Bytes(data.voterId));
            });

            const tx = await contract.updateVotingBatch(root, voterHashes);
            await tx.wait();

            // Store for validators
            const contractWithStatus = new ethers.Contract(contractAddress, [
                "function currentBatchId() public view returns (uint256)"
            ], provider);
            const batchId = await contractWithStatus.currentBatchId();
            processedBatches[batchId.toString()] = votesToProcess;

            console.log(`Blockchain Updated! Batch: ${batchId}, Hash: ${tx.hash}`);
        } else {
            console.log("No contract address configured. Skipping blockchain update.");
        }
    } catch (error) {
        console.error("Batch processing failed:", error);
        // ในโปรดักชั่นควรมีระบบ Retry
    }
}

// แมนนวลทริกเกอร์สำหรับทดสอบ
app.post('/batch/force', async (req, res) => {
    await processBatch();
    res.json({ message: 'Batch processing triggered manually' });
});

// Live results API endpoint (PUBLIC - Turnout only, no vote counts)
app.get('/results/public', (req, res) => {
    const stations = Array.from(liveResults.values()).map(s => ({
        id: s.id,
        name: s.name,
        province: s.province,
        district: s.district,
        totalVoters: s.totalVoters,
        votedCount: s.votedCount,
        turnoutPercentage: s.totalVoters > 0 ? (s.votedCount / s.totalVoters) * 100 : 0,
        lastUpdate: s.lastUpdate,
        // NO RESULTS - for safety at polling stations
    }));

    const totalVoters = stations.reduce((sum, s) => sum + s.totalVoters, 0);
    const votedCount = stations.reduce((sum, s) => sum + s.votedCount, 0);

    res.json({
        stations,
        summary: {
            totalVoters,
            votedCount,
            turnoutPercentage: totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0,
            totalStations: stations.length
        },
        lastUpdate: new Date().toISOString(),
        notice: 'ผลคะแนนจะเปิดเผยหลังปิดหีบเท่านั้น เพื่อความปลอดภัยของผู้ใช้สิทธิ์'
    });
});

// Live results API endpoint (ADMIN - Full results with vote counts)
app.get('/results/admin', (req, res) => {
    // TODO: Add authentication middleware
    const authToken = req.headers.authorization;
    if (!authToken || authToken !== `Bearer ${process.env.ADMIN_TOKEN || 'demo-admin-token'}`) {
        return res.status(401).json({ error: 'Unauthorized - Admin access only' });
    }

    const stations = Array.from(liveResults.values());

    const totalVoters = stations.reduce((sum, s) => sum + s.totalVoters, 0);
    const votedCount = stations.reduce((sum, s) => sum + s.votedCount, 0);

    res.json({
        stations,
        summary: {
            totalVoters,
            votedCount,
            turnoutPercentage: totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0,
            totalStations: stations.length
        },
        lastUpdate: new Date().toISOString()
    });
});

// Legacy endpoint - redirect to public
app.get('/results/live', (req, res) => {
    res.redirect('/results/public');
});

// Mempool status endpoint
app.get('/mempool/status', (req, res) => {
    const now = Date.now();
    const recentVotes = mempool.filter(v => now - v.timestamp < 60000); // Last 1 minute

    const stationActivity = recentVotes.reduce((acc, vote) => {
        acc[vote.stationId] = (acc[vote.stationId] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    res.json({
        totalPending: mempool.filter(v => v.status === 'pending').length,
        totalBatched: mempool.filter(v => v.status === 'batched').length,
        totalConfirmed: mempool.filter(v => v.status === 'confirmed').length,
        recentActivity: recentVotes.length,
        stationActivity,
        batchProgress: {
            current: currentBatch.length,
            target: BATCH_SIZE,
            percentage: (currentBatch.length / BATCH_SIZE) * 100
        },
        estimatedTimeToNextBatch: batchTimer ? Math.ceil(BATCH_INTERVAL_MS / 1000) : 0
    });
});

// Mempool live stream (for animation)
app.get('/mempool/stream', (req, res) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const recentVotes = mempool.slice(-limit).reverse();

    res.json({
        votes: recentVotes,
        timestamp: Date.now()
    });
});

// Endpoint to simulate votes for testing
app.post('/test/simulate-vote', async (req, res) => {
    // Use real candidates from config
    const candidates = electionConfig.candidates;
    const constituencies = electionConfig.constituencies;

    if (candidates.length === 0 || constituencies.length === 0) {
        return res.status(500).json({ error: 'No candidates or constituencies configured' });
    }

    const constituency = constituencies[Math.floor(Math.random() * constituencies.length)];
    const constituencyCandidates = candidates.filter(c => c.constituency === constituency.name);

    if (constituencyCandidates.length === 0) {
        return res.status(500).json({ error: 'No candidates for selected constituency' });
    }

    const candidate = constituencyCandidates[Math.floor(Math.random() * constituencyCandidates.length)];
    const party = electionConfig.parties.find(p => p.id === candidate.partyId);
    const voterId = `VOTER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const stationId = `${constituency.id}-STATION-001`;

    await fetch('http://localhost:3001/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            vote: `${candidate.number}. ${candidate.name} (${party?.shortName || 'Unknown'})`,
            voterId,
            signature: 'test-signature',
            stationId,
            stationName: `หน่วยเลือกตั้ง ${constituency.name}`,
            province: constituency.province,
            district: constituency.district,
            candidate: `${candidate.number}. ${candidate.name} (${party?.shortName || 'Unknown'})`
        })
    });

    res.json({
        message: 'Vote simulated',
        constituency: constituency.name,
        candidate: candidate.name,
        party: party?.name,
        station: stationId
    });
});

// Get election configuration
app.get('/election/config', (req, res) => {
    res.json(electionConfig);
});

app.listen(port, () => {
    console.log(`Aggregator listening at http://localhost:${port}`);
});
