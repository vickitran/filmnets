import { ethers } from "hardhat";

async function main() {
  const myVideoNFTFactory = await ethers.getContractFactory("MyVideoNFT");
  const myVideoNFTContract = await myVideoNFTFactory.deploy();
  await myVideoNFTContract.deployed();
  console.log("Contract deployed to address:", myVideoNFTContract.address);

  // Contract deployed to address: 0xE710666F5C687e16CD8e71756C9E0833B05B1758
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
