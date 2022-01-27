import { ethers } from "ethers";
import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";
import { setEnv } from "./helpers.js";

if (!process.env.APP_ADDRESS || process.env.APP_ADDRESS === "") {
  console.log("🛑 App Address not found.");
}

const app = sdk.getAppModule(process.env.APP_ADDRESS);

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      // The collection's name, ex. CryptoPunks
      name: "TenementDAO Membership",
      // A description for the collection.
      description: "Own bricks and earm yield from our Tenement",
      // The image for the collection that will show up on OpenSea.
      image: readFileSync("scripts/assets/logo.png"),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the module.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      // you can set this to your own wallet address if you want to charge for the drop.
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });

    console.log(
      "✅ Successfully deployed bundleDrop module, address:", //
      bundleDropModule.address
    );
    setEnv("BUNDLE_DROP_ADDRESS", bundleDropModule.address);
    console.log(
      "✅ bundleDrop metadata:",
      await bundleDropModule.getMetadata()
    );
  } catch (error) {
    console.log("failed to deploy bundleDrop module", error);
  }
})();
