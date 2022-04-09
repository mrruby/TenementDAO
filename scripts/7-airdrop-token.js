import sdk from "./1-initialize-sdk.js";

if (!process.env.TOKEN_ADDRESS || process.env.TOKEN_ADDRESS === "") {
  console.log("🛑 TOKEN ADDRESS not found.");
}

if (
  !process.env.BUNDLE_DROP_ADDRESS ||
  process.env.BUNDLE_DROP_ADDRESS === ""
) {
  console.log("🛑 App Address not found.");
}

const editionDrop = sdk.getEditionDrop(process.env.BUNDLE_DROP_ADDRESS);

const token = sdk.getToken(process.env.TOKEN_ADDRESS);

(async () => {
  try {
    // Grab all the addresses of people who own our membership NFT,
    // which has a tokenId of 0.
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

    if (walletAddresses.length === 0) {
      console.log(
        "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!"
      );
      process.exit(0);
    }

    // Loop through the array of addresses.
    const airdropTargets = walletAddresses.map((address) => {
      // Pick a random # between 1000 and 10000.
      const amount = 1000;

      // Set up the target.
      const airdropTarget = {
        toAddress: address,
        amount,
      };

      return airdropTarget;
    });

    // Call transferBatch on all our airdrop targets.
    console.log("🌈 Starting airdrop...");
    await token.transferBatch(airdropTargets);
    console.log(
      "✅ Successfully airdropped tokens to all the holders of the NFT!"
    );
  } catch (err) {
    console.error("Failed to airdrop tokens", err);
  }
})();
