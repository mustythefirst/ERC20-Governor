const { ethers } = require("hardhat");
require("dotenv").config();
const { parseEther } = ethers.utils;
const { keccak256, toUtf8Bytes } = require("ethers/lib/utils");

async function main() {
    const [owner] = await ethers.getSigners();

    // get the balance of the owner
    const balanceBefore = await owner.getBalance();
    console.log("Balance Before: ", balanceBefore.toString());

    // get token contract from address
    const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
    const tokenContract = await ethers.getContractAt("MyToken", tokenContractAddress);

    // get governor contract from address
    const governorContractAddress = process.env.GOVERNOR_CONTRACT_ADDRESS;
    const governorContract = await ethers.getContractAt("MyGovernor", governorContractAddress);

    const tx = await governorContract.execute(
        [tokenContractAddress],
        [0],
        [tokenContract.interface.encodeFunctionData("mint", [owner.address, parseEther("25000")])],
        keccak256(toUtf8Bytes("Give the owner more tokens!"))
      );

    const executeTxReceipt = await tx.wait();
    console.log("executeTxReceipt: ", executeTxReceipt);

    // get the balance of the owner
    console.log("Balance before: ", owner.address, await owner.getBalance());
    const balanceAfter = await owner.getBalance();
    console.log("Balance After: ", balanceAfter.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});