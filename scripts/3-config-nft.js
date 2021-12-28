import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0xF0446A8B1418f10D386f021A428013666270b4f7"
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "GetBold",
        description: "This NFT will give you access to TenementDAO!",
        image: readFileSync("scripts/assets/nft.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
