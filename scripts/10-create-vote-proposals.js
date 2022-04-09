import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

if (!process.env.TOKEN_ADDRESS || process.env.TOKEN_ADDRESS === "") {
  console.log("🛑 TOKEN ADDRESS not found.");
}

// This is our ERC-20 contract.
const token = sdk.getToken(process.env.TOKEN_ADDRESS);

if (
  !process.env.VOTE_CONTRACT_ADDRESS ||
  process.env.VOTE_CONTRACT_ADDRESS === ""
) {
  console.log("🛑 VOTE CONTRACT ADDRESS not found.");
}

// This is our governance contract.
const vote = sdk.getVote(process.env.VOTE_CONTRACT_ADDRESS);

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

(async () => {
  try {
    // Create proposal to mint 42000 new token to the treasury.
    const amount = 42_000;
    const description = `Should the DAO mint an additional ${amount} tokens into the treasury for refurbishment reward?`;
    const executions = [
      {
        // Our token contract that actually executes the mint.
        toAddress: token.getAddress(),
        // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
        // to send in this proposal. In this case, we're sending 0 ETH.
        // We're just minting new tokens to the treasury. So, set to 0.
        nativeTokenValue: 0,
        // We're doing a mint! And, we're minting to the vote, which is
        // acting as our treasury.
        // in this case, we need to use ethers.js to convert the amount
        // to the correct format. This is because the amount it requires is in wei.
        transactionData: token.encoder.encode("mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
      },
    ];

    await vote.propose(description, executions);

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    const amount = 5000;
    const description = `Should the DAO transfer ${amount} tokens from the treasury to management for a great work?`;
    const executions = [
      {
        nativeTokenValue: 0,
        transactionData: token.encoder.encode("transfer", [
          process.env.WALLET_ADDRESS,
          ethers.utils.parseUnits(amount.toString(), 18),
        ]),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log("✅ Successfully created proposal to reward management!");
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();
