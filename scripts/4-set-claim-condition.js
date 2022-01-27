import sdk from "./1-initialize-sdk.js";

if (
  !process.env.BUNDLE_DROP_ADDRESS ||
  process.env.BUNDLE_DROP_ADDRESS === ""
) {
  console.log("🛑 App Address not found.");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

const bundleDrop = sdk.getBundleDropModule(process.env.BUNDLE_DROP_ADDRESS);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    // Specify conditions.
    claimConditionFactory
      .newClaimPhase({
        startTime: new Date(),
        maxQuantity: 2000,
        maxQuantityPerTransaction: 1,
      })
      .setPrice(250000000000000000n); // price in wei

    await bundleDrop.setClaimCondition(0, claimConditionFactory);
    await bundleDrop.setSaleRecipient(0, process.env.WALLET_ADDRESS);

    await bundleDrop.setRoyaltyBps(1000);

    console.log(
      "✅ Successfully set claim condition on bundle drop:",
      bundleDrop.address
    );
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();
