import express from 'express';
import cors from 'cors';
import Redis from 'ioredis';

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Redis for real-time data
const redis = new Redis({
    host: 'localhost',
    port: 6379,
    retryStrategy: () => null
});

// In-memory cache for real-time results
interface StationResults {
    stationId: string;
    province: string;
    district: string;
    totalVoters: number;
    votedCount: number;
    results: Record<string, number>;
    lastUpdate: number;
}

const stationCache = new Map<string, StationResults>();

// Endpoint to receive real-time vote updates (from polling stations)
app.post('/vote/realtime', async (req, res) => {
    const { stationId, province, district, candidate, voterId } = req.body;

    if (!stationId || !candidate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Update in-memory cache immediately
        let station = stationCache.get(stationId);
        if (!station) {
            station = {
                stationId,
                province: province || 'Unknown',
                district: district || 'Unknown',
                totalVoters: 0,
                votedCount: 0,
                results: {},
                lastUpdate: Date.now()
            };
            stationCache.set(stationId, station);
        }

        // Increment vote count
        station.votedCount++;
        station.results[candidate] = (station.results[candidate] || 0) + 1;
        station.lastUpdate = Date.now();

        // Also push to Redis queue for batching (will be processed by aggregator)
        await redis.lpush('votes_queue', JSON.stringify({
            stationId,
            province,
            district,
            candidate,
            voterId,
            timestamp: Date.now()
        }));

        res.json({
            message: 'Vote recorded',
            realtime: true,
            batchPending: true
        });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ error: 'Failed to record vote' });
    }
});

// Endpoint to get real-time results (for frontend display)
app.get('/results/realtime', (req, res) => {
    const { province, district, stationId } = req.query;

    let results = Array.from(stationCache.values());

    // Filter by parameters
    if (province && province !== 'all') {
        results = results.filter(s => s.province === province);
    }
    if (district) {
        results = results.filter(s => s.district === district);
    }
    if (stationId) {
        results = results.filter(s => s.stationId === stationId);
    }

    // Calculate totals
    const totalVoters = results.reduce((sum, s) => sum + s.totalVoters, 0);
    const votedCount = results.reduce((sum, s) => sum + s.votedCount, 0);

    res.json({
        stations: results.map(s => ({
            ...s,
            results: Object.entries(s.results).map(([candidate, votes]) => ({
                candidate,
                votes,
                percentage: s.votedCount > 0 ? (votes / s.votedCount) * 100 : 0
            }))
        })),
        summary: {
            totalVoters,
            votedCount,
            turnoutPercentage: totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0
        },
        lastUpdate: Date.now()
    });
});

// Endpoint to get batch status (how many votes waiting to be sent to blockchain)
app.get('/batch/status', async (req, res) => {
    try {
        const queueLength = await redis.llen('votes_queue');
        res.json({
            pendingVotes: queueLength,
            batchSize: 1000,
            estimatedBatches: Math.ceil(queueLength / 1000),
            message: queueLength >= 1000
                ? 'Ready to process batch'
                : `Waiting for ${1000 - queueLength} more votes`
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get batch status' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'realtime-results',
        cachedStations: stationCache.size,
        timestamp: Date.now()
    });
});

app.listen(port, () => {
    console.log(`Real-time Results Service listening at http://localhost:${port}`);
    console.log('Frontend will see votes immediately');
    console.log('Blockchain batching handled by aggregator service');
});
