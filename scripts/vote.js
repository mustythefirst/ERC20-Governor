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

    // get transaction receipt from this transaction hash
    const transactionHash = "0xfd9e57f63939161273d95dd24b9591cf8126a4495a5da21313762f48b5755c2e";
    const receipt = await ethers.provider.getTransactionReceipt(transactionHash);

    // get the ProposalCreated event from the receipt
    const logs = receipt.logs;
    const eventSignature = ethers.utils.id("ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)");
    console.log("eventSignature: ", eventSignature);
    
    // Get the topic for the ProposalCreated event
    const proposalCreatedTopic = governorContract.interface.getEventTopic('ProposalCreated');
    console.log('ProposalCreated topic:', proposalCreatedTopic);

    // Find the log entry containing the ProposalCreated event topic
    const proposalCreatedLog = receipt.logs.find((log) => log.topics.includes(proposalCreatedTopic));
    console.log('ProposalCreated log:', proposalCreatedLog);

    // Parse the log entry to get the ProposalCreated event object
    const proposalCreatedEvent = governorContract.interface.parseLog(proposalCreatedLog);
    console.log('ProposalCreated event:', proposalCreatedEvent);

    // Extract and log the proposalId
    const { proposalId } = proposalCreatedEvent.args;
    console.log('Proposal ID:', proposalId.toString());

    const tx = await governorContract.castVote(proposalId, 1); 
    console.log("tx: ", tx);

    const voteTxReceipt = await tx.wait();
    console.log("voteTxReceipt: ", voteTxReceipt);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 