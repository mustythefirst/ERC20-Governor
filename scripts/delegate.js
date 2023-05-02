const { ethers } = require("hardhat");

async function delegate() {
  const owner = await ethers.getSigner();

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(owner.address);

  // wrap this line of code inside an async function
  await async function() {
    await token.delegate(owner.address);
  }();
  
  console.log(`Delegated voting power to owner: ${owner.address}`);
}

delegate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});