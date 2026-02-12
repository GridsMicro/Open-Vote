import { ethers } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

/**
 * Open-Vote Independent Validator Node
 * พัฒนาโดย Antigravity Team สำหรับโครงการ Open-Vote
 * ทำหน้าที่ตรวจสอบความถูกต้องของ Merkle Root บน Blockchain กับข้อมูลโหวตจริงแบบอิสระ
 */

const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
const AGGREGATOR_URL = process.env.AGGREGATOR_URL || 'http://localhost:3001';
const CHECK_INTERVAL = 30000; // 30 seconds

// ABI พื้นฐานที่จำเป็นสำหรับ Validator
const OPEN_VOTE_ABI = [
    "function currentVotingRoot() public view returns (bytes32)",
    "function currentBatchId() public view returns (uint256)",
    "event RootUpdated(uint256 indexed batchId, bytes32 newRoot, uint256 timestamp)"
];

async function startValidator() {
    console.log("--------------------------------------------------");
    console.log("🛡️  OPEN-VOTE INDEPENDENT VALIDATOR NODE STARTING");
    console.log(`🌐 Connected to RPC: ${RPC_URL}`);
    console.log(`📜 Contract Address: ${CONTRACT_ADDRESS}`);
    console.log("--------------------------------------------------");

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, OPEN_VOTE_ABI, provider);

    // ฟังเหตุการณ์การอัปเดต Root แบบ Real-time
    contract.on("RootUpdated", async (batchId, onChainRoot, timestamp) => {
        console.log(`\n🔔 New Root Detected! Batch: ${batchId}`);
        await verifyBatch(batchId, onChainRoot);
    });

    // รันการตรวจสอบแบบสม่ำเสมอ (Periodic Check)
    setInterval(async () => {
        try {
            const batchId = await contract.currentBatchId();
            const onChainRoot = await contract.currentVotingRoot();
            console.log(`[${new Date().toLocaleTimeString()}] Monitoring... Current Batch: ${batchId}`);

            // ตรวจสอบข้อมูลย้อนหลัง (ถ้ามี)
            // ในระบบจริง ข้อมูลโหวตควรจะดึงมาจาก IPFS หรือ Public Log
            await verifyBatch(batchId, onChainRoot);
        } catch (error) {
            console.error("Monitoring error:", error);
        }
    }, CHECK_INTERVAL);
}

async function verifyBatch(batchId: any, onChainRoot: string) {
    try {
        console.log(`🔍 Verifying Batch #${batchId}...`);

        // 1. ดึงข้อมูลโหวตจริงจากแหล่งข้อมูลสาธารณะ (ในที่นี้จำลองการดึงจาก Aggregator)
        // ในเฟส Decentralized สมบูรณ์ ข้อมูลจะถูกดึงจาก IPFS/L2 Data Availability Layer
        const response = await axios.get(`${AGGREGATOR_URL}/batch/data/${batchId}`);
        const votes = response.data.votes;

        if (!votes || votes.length === 0) {
            console.log("⚠️ No actual vote data found for this batch yet.");
            return;
        }

        // 2. คำนวณ Merkle Root ใหม่แบบอิสระ
        const leafNodes = votes.map((v: string) => keccak256(v));
        const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        const calculatedRoot = tree.getHexRoot();

        // 3. เปรียบเทียบผลลัพธ์
        if (calculatedRoot === onChainRoot) {
            console.log("✅ VERIFICATION SUCCESS: Math matches the Blockchain!");
            console.log(`   - Calculated: ${calculatedRoot}`);
            console.log(`   - On-Chain:   ${onChainRoot}`);
        } else {
            console.log("🚨 ALERT: VERIFICATION FAILED! DISCREPANCY DETECTED!");
            console.log(`   - Calculated: ${calculatedRoot}`);
            console.log(`   - On-Chain:   ${onChainRoot}`);
            console.log("🛑 POSSIBLE FRAUD OR SYSTEM ERRORS DETECTED!");
        }
    } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
            console.log("⚠️ Waiting for Data Availability Layer (Aggregator/IPFS)...");
        } else {
            console.error("Verification error:", error.message);
        }
    }
}

startValidator().catch(console.error);
