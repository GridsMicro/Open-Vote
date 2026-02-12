import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

/**
 * @title MerkleManager
 * @dev จัดการการสร้าง Merkle Tree และ Proof สำหรับโหวตจำนวนมาก
 */
export class MerkleManager {
    /**
     * สร้าง Merkle Root จากรายการโหวต
     * @param votes รายการโหวตในรูปแบบ string หรือ object
     */
    static generateRoot(votes: string[]): string {
        const leaves = votes.map(v => keccak256(v));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        return tree.getHexRoot();
    }

    /**
     * สร้าง Merkle Proof สำหรับโหวตที่ระบุ
     * @param votes รายการโหวตทั้งหมดในชุดข้อมูล
     * @param voteToProve โหวตที่ต้องการสร้าง Proof
     */
    static generateProof(votes: string[], voteToProve: string): string[] {
        const leaves = votes.map(v => keccak256(v));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        const leaf = keccak256(voteToProve);
        return tree.getHexProof(leaf);
    }

    /**
     * ตรวจสอบความถูกต้องเบื้องต้น (Off-chain)
     */
    static verify(proof: string[], root: string, vote: string): boolean {
        const leaf = keccak256(vote);
        const tree = new MerkleTree([], keccak256, { sortPairs: true });
        return tree.verify(proof, leaf, root);
    }
}
