import React, { useEffect, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { UnsupportedChainIdError } from "@web3-react/core";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0xC1Cf7A3534C0e9a4A8BDf35E3Dc5a4186068769f"
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address);

  // The signer is required to sign transactions on the blockchain.
  // Without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);
  const [mintingError, setMintingError] = useState("");
  console.log(isClaiming);

  // Another useEffect!
  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with
    // our deployed contract!
    sdk.setProviderOrSigner(signer);

    // if (
    //   !process.env.REACT_APP_BUNDLE_DROP_ADDRESS ||
    //   process.env.REACT_APP_BUNDLE_DROP_ADDRESS === ""
    // ) {
    //   console.log("🛑 App Address not found.");
    // }
  }, [signer]);

  useEffect(async () => {
    if (!address) {
      return;
    }
    try {
      const balance = await bundleDropModule.balanceOf(address, "0");
      if (balance.gt(0)) {
        setHasClaimedNFT(true);
        console.log("🌟 this user has a membership NFT!");
      } else {
        setHasClaimedNFT(false);
        console.log("😭 this user doesn't have a membership NFT.");
      }
    } catch (inError) {
      setHasClaimedNFT(false);
      console.error("failed to nft balance", inError);
    }
  }, [address]);

  if (error instanceof UnsupportedChainIdError) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks in
          your connected wallet.
        </p>
      </div>
    );
  }

  // Add this little piece!
  const mintNft = async () => {
    setIsClaiming(true);
    setMintingError("");
    try {
      await bundleDropModule.claim("0", 1);

      setIsClaiming(false);
      // Set claim state.
      setHasClaimedNFT(true);
      // Show user their fancy new NFT!
      console.log(
        `Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      );
    } catch (er) {
      console.error("failed to claim", er);
      setIsClaiming(false);
      if (er.code === -32000) {
        return setMintingError("Innsuficcient funds");
      }
      return setMintingError("Innsuficcient funds");
    }
  };

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>🏢TenementDAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to 🏢TenementDAO</h1>
        <p>This project runs on Rinkeby Testnet Eth Network</p>
        <button
          type="button"
          onClick={() => connectWallet("injected")}
          className="btn-hero"
        >
          Connect your wallet
        </button>
      </div>
    );
  }

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint 🏢TenementDAO Membership NFT</h1>
      <button type="button" disabled={isClaiming} onClick={mintNft}>
        {isClaiming ? "Minting..." : "Mint your nft"}
      </button>
      <p>{mintingError}</p>
    </div>
  );
};

export default App;
