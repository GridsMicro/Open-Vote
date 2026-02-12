import { ethers } from "hardhat";

async function main() {
    console.log("Deploying OpenVote contract...");

    const OpenVote = await ethers.getContractFactory("OpenVote");
    const openVote = await OpenVote.deploy();

    await openVote.waitForDeployment();

    const address = await openVote.getAddress();
    console.log(`OpenVote deployed to: ${address}`);

    // ในสถานการณ์จริง เราจะบันทึก address นี้ลงในไฟล์ .env ของ frontend และ aggregator
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
