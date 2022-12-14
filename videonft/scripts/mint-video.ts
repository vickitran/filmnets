import { ethers } from "hardhat";
require("dotenv").config();

async function mintVideoNFT(tokenURI: string) {
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

  // set up mint tx
  const mintTx = await myVideoNFTContract
    .connect(walletPrivateKey)
    .safeMint(walletPrivateKey.address, tokenURI, { gasLimit: 3000000 });
  const mintTxReciept = await mintTx.wait();
  console.log(mintTxReciept);
}

const sampleVideo =
  "ipfs://bafybeigphbyidypq5r36ur7hkskpipduijjcfimq3ijrcibabt72fkwzzm";
mintVideoNFT(sampleVideo).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
