const { configDotenv } = require("dotenv");
const { ethers } = require("ethers");
configDotenv();
const provider = new ethers.getDefaultProvider(process.env.PROVIDER_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_externalContractAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "arg0",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "arg1",
        type: "uint256",
      },
    ],
    name: "executeClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "externalContractAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// The address of the deployed contract
const contractAddress = "0xc8a1e9FE709726ff3a3AF8325a8EAE5dB5b34439";
const balance = "100000000";
const contractToken = "0x6F405A7fdc7b4B1Ffad1C821a6bA89f13b48c4F3";

// weth
// const valueInWei = ethers.utils.parseEther("0.1");
// const contractAddress = "0xe173Bd5a0e2aC0ae89fc357c17693ee1c4ee545d";
// const balance = valueInWei;
// const contractToken = "0x0ac1cc398342aab9f8ffe43dd578b2df59ceea5e";
// Create the contract instance


const contract = new ethers.Contract(contractAddress, abi, wallet);
async function executeContract() {
  try {
    // The amount to transfer (1 ETH)
    const gasPrice = await provider.getGasPrice(); // Get current network gas price
    const increasedGasPrice = gasPrice.mul(1); // Increase gas price (you can adjust the multiplier)
    const gasLimit = ethers.BigNumber.from("27000000");
    const valueInWei = ethers.utils.parseEther("0.1");
    const tx = await contract.executeClaim(
      contractToken,
      balance,

      {
        gasLimit: gasLimit,
        gasPrice: increasedGasPrice,
      }
    );

    console.log("Transaction sent! Hash:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction mined! Block:", receipt.blockNumber);
  } catch (error) {
    console.error("Error executing contract:", error);
  }
}

async function main() {
  try {
    // Your first main logic here
    await executeContract();
    // Simulate async work
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error("Error in main1:", error);
    process.exit(1);
  }
}

(async function runAlternating() {
  for (let i = 0; i < 100; i++) {
    await main();
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
})();
