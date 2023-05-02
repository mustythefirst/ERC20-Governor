const { ethers } = require("hardhat");

// pass the owner address as a parameter to the main function
async function main(ownerAddress) {
  // retrieve the owner account object from ethers
  const owner = await ethers.getSigner(ownerAddress);

  const transactionCount = await owner.getTransactionCount();

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 1
  });

  const MyGovernor = await ethers.getContractFactory("MyGovernor");
  const governor = await MyGovernor.deploy(futureAddress);

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(governor.address);

  console.log(
    `Governor deployed to ${governor.address}`,
    `Token deployed to ${token.address}`
  );
}

// retrieve the owner address from a config file or environment variable
const ownerAddress = process.env.OWNER_ADDRESS;

main(ownerAddress).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
