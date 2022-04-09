import { AddressZero } from "@ethersproject/constants";
import { setEnv } from "./helpers.js";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenAddress = await sdk.deployer.deployToken({
      // What's your token's name? Ex. "Ethereum"
      name: "TenementDAO Governance Token",
      // What's your token's symbol? Ex. "ETH"
      symbol: "TEN",
      // This will be in case we want to sell our token,
      // because we don't, we set it to AddressZero again.
      primary_sale_recipient: AddressZero,
    });
    setEnv("TOKEN_ADDRESS", tokenAddress);
    setEnv("REACT_APP_TOKEN_ADDRESS", tokenAddress);
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenAddress
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();
