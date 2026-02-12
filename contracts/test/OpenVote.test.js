const { expect } = require("chai");
const { ethers } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

describe("OpenVote Smart Contract", function () {
    let openVote;
    let owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        const OpenVoteFactory = await ethers.getContractFactory("OpenVote");
        openVote = await OpenVoteFactory.deploy();
    });

    it("Should set the correct owner", async function () {
        expect(await openVote.owner()).to.equal(owner.address);
    });

    it("Should update Merkle Root and verify votes correctly", async function () {
        // 1. จำลองข้อมูลการโหวต (Votes)
        const votes = [
            "Voter1: Candidate A",
            "Voter2: Candidate B",
            "Voter3: Candidate A",
            "Voter4: Candidate C"
        ];

        // 2. สร้าง Leaf Nodes โดยการ Hash ข้อมูลโหวต
        const leafNodes = votes.map(vote => keccak256(vote));

        // 3. สร้าง Merkle Tree
        const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        const root = tree.getHexRoot();

        // 4. อัปเดต Root ลงใน Smart Contract
        await openVote.updateVotingRoot(root);

        // ตรวจสอบว่า Root ถูกบันทึกถูกต้อง
        expect(await openVote.currentVotingRoot()).to.equal(root);
        expect(await openVote.currentBatchId()).to.equal(BigInt(1));

        // 5. ทดสอบการตรวจสอบโหวต (Verify)
        const voteToVerify = votes[0]; // Voter1: Candidate A
        const leaf = keccak256(voteToVerify);
        const proof = tree.getHexProof(leaf);

        // ตรวจสอบกับ Smart Contract
        const isValid = await openVote.verifyVoteAgainstRoot(proof, leaf);
        expect(isValid).to.be.true;

        // 6. ทดสอบกับโหวตที่ไม่มีอยู่ในระบบ (หรือถูกแก้ไข)
        const fakeVote = "Voter1: Candidate B";
        const fakeLeaf = keccak256(fakeVote);
        const fakeProof = tree.getHexProof(fakeLeaf);

        const isFakeValid = await openVote.verifyVoteAgainstRoot(fakeProof, fakeLeaf);
        expect(isFakeValid).to.be.false;
    });

    it("Should only allow owner to update root", async function () {
        const [_, otherAccount] = await ethers.getSigners();
        const newRoot = ethers.zeroPadValue("0x1234", 32);

        await expect(
            openVote.connect(otherAccount).updateVotingRoot(newRoot)
        ).to.be.revertedWithCustomError(openVote, "OwnableUnauthorizedAccount");
    });
});
