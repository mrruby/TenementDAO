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

const editionDrop = sdk.getEditionDrop(process.env.BUNDLE_DROP_ADDRESS);

(async () => {
  try {
    const claimConditions = [
      {
        startTime: new Date(),
        maxQuantity: 2000,
        price: 0.0025,
      },
    ];

    await editionDrop.claimConditions.set("0", claimConditions);
    await editionDrop.royalty.setDefaultRoyaltyInfo({
      seller_fee_basis_points: 1000,
      fee_recipient: process.env.WALLET_ADDRESS,
    });
    console.log("✅ Sucessfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();
