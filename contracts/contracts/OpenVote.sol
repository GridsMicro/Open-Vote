// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OpenVote
 * @dev ระบบบันทึก Merkle Root สำหรับการเลือกตั้งที่โปร่งใสและตรวจสอบได้
 * มุ่งเน้นความโปร่งใส (Transparency) และความสามารถในการขยายตัว (Scalability)
 */
contract OpenVote is Ownable {
    // Merkle Root ล่าสุดที่รวมผลคะแนนทั้งหมด
    bytes32 public currentVotingRoot;
    
    // เวลาที่มีการอัปเดตล่าสุด
    uint256 public lastUpdatedTimestamp;
    
    // เลขลำดับการเลือกตั้ง (Election Batch ID)
    uint256 public currentBatchId;

    // ตรวจสอบว่ารหัสประจำตัว (ThaiD Hash) นี้เคยลงคะแนนไปแล้วหรือไม่
    mapping(bytes32 => bool) public hasVoted;
    
    // จำนวนผู้ใช้สิทธิ์ทั้งหมด
    uint256 public totalVotes;

    event RootUpdated(uint256 indexed batchId, bytes32 newRoot, uint256 timestamp, uint256 votersInBatch);
    event VoterRegistered(bytes32 indexed voterHash);

    constructor() Ownable(msg.sender) {
        currentBatchId = 0;
        totalVotes = 0;
    }

    /**
     * @dev อัปเดต Merkle Root พร้อมกับยืนยันรายชื่อผู้ใช้สิทธิ์ (Batch Update)
     * @param _newRoot Merkle Root ของชุดคะแนนใหม่
     * @param _voterHashes รายการ Hash ของบัตรประชาชน (ThaiD) ใน Batch นี้
     */
    function updateVotingBatch(bytes32 _newRoot, bytes32[] calldata _voterHashes) external onlyOwner {
        for (uint256 i = 0; i < _voterHashes.length; i++) {
            require(!hasVoted[_voterHashes[i]], "Double Voting Detected: One or more voters already voted");
            hasVoted[_voterHashes[i]] = true;
            emit VoterRegistered(_voterHashes[i]);
        }

        currentVotingRoot = _newRoot;
        lastUpdatedTimestamp = block.timestamp;
        currentBatchId++;
        totalVotes += _voterHashes.length;
        
        emit RootUpdated(currentBatchId, _newRoot, block.timestamp, _voterHashes.length);
    }

    /**
     * @dev ตรวจสอบว่าคะแนน (leaf) อยู่ใน Merkle Root ปัจจุบันหรือไม่
     * @param proof Merkle Proof ที่ได้รับมาจากโครงการ
     * @param leaf Hash ของคะแนน ($L = Hash(VoteContent + Salt)$)
     */
    function verifyVoteAgainstRoot(bytes32[] calldata proof, bytes32 leaf) public view returns (bool) {
        return MerkleProof.verify(proof, currentVotingRoot, leaf);
    }

    /**
     * @dev ดึงข้อมูลภาพรวมของระบบโหวต
     */
    function getElectionStatus() public view returns (bytes32 root, uint256 lastUpdate, uint256 batchId) {
        return (currentVotingRoot, lastUpdatedTimestamp, currentBatchId);
    }
}
