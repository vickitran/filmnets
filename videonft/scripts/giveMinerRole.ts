import { ethers } from "hardhat";
require("dotenv").config();

async function grantMintingRole() {
  // set up contract
  const contractAddress = "0x28AB8de902D88D0C07CD492C6fa60D7752a140F3";
  const myVideoNFTFactory = await ethers.getContractFactory("MyVideoNFT");
  const myVideoNFTContract = myVideoNFTFactory.attach(contractAddress);

  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    `${process.env.ALCHEMY_API_KEY}`
  );
  const walletPrivateKey = new ethers.Wallet(
    `${process.env.PRIVATE_KEY}`,
    provider
  );

  // set up grant tx
  const address_to_give_mint = [
    "0x095E915dedF0270c4d6715bdf6D097D223bfbC2A",
    "0x9E7866c17f3749777b25C86e3c4fC473E9F3802c",
  ];
  for (var address of address_to_give_mint) {
    const mintTx = await myVideoNFTContract
      .connect(walletPrivateKey)
      .setupMinter(address, { gasLimit: 3000000 });
    const mintTxReciept = await mintTx.wait();
    console.log(mintTxReciept);
    console.log(address);
  }
}

grantMintingRole().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
