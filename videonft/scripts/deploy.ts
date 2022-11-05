import { ethers } from "hardhat";

async function main() {
  const myVideoNFTFactory = await ethers.getContractFactory("MyVideoNFT");
  const myVideoNFTContract = await myVideoNFTFactory.deploy();
  await myVideoNFTContract.deployed();
  console.log("Contract deployed to address:", myVideoNFTContract.address);

  // Contract deployed to address: 0x28AB8de902D88D0C07CD492C6fa60D7752a140F3
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
