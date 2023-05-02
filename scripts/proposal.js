const { ethers } = require("hardhat");
require("dotenv").config();
const { parseEther } = ethers.utils;

async function main() {
    const [owner] = await ethers.getSigners();

    // get token contract from address
    const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
    const tokenContract = await ethers.getContractAt("MyToken", tokenContractAddress);

    // get governor contract from address
    const governorContractAddress = process.env.GOVERNOR_CONTRACT_ADDRESS;
    const governorContract = await ethers.getContractAt("MyGovernor", governorContractAddress);

    const tx = await governorContract.propose(
        [tokenContractAddress],
        [0],
        [tokenContract.interface.encodeFunctionData("mint", [owner.address, parseEther("25000")])],
        "Give the owner more tokens!"
    );
    console.log("tx: ", tx);

    const receipt = await tx.wait();
    console.log("receipt: ", receipt);

    const event = receipt.events.find(x => x.event === 'ProposalCreated');
    console.log("event: ", event);

    const { proposalId } = event.args;
    console.log("proposalId: ", proposalId.toString());

    // wait for the 1 block voting delay
    const something = await hre.network.provider.send("evm_mine");
    console.log("something: ", something);

    const state = await governorContract.state(proposalId);
    console.log("state: ", state);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});