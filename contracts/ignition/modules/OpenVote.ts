import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const OpenVoteModule = buildModule("OpenVoteModule", (m) => {
    const openVote = m.contract("OpenVote");

    return { openVote };
});

export default OpenVoteModule;
