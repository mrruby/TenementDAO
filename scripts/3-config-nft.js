import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

if (
  !process.env.BUNDLE_DROP_ADDRESS ||
  process.env.BUNDLE_DROP_ADDRESS === ""
) {
  console.log("🛑 App Address not found.");
}

const bundleDrop = sdk.getBundleDropModule(process.env.BUNDLE_DROP_ADDRESS);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Brick",
        description: "Own brick to earm yield from our Tenement",
        image: readFileSync("scripts/assets/brick.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
