import { useAddress, useMetamask, useEditionDrop } from "@thirdweb-dev/react";
import React, { useState } from "react";
import MemberPage from "./components/MemberPage";
import useCheckBalance from "./hooks/useCheckBalance";

const App = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  const editionDrop = useEditionDrop(process.env.REACT_APP_BUNDLE_DROP_ADDRESS);
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [mintingError, setMintingError] = useState("");

  useCheckBalance(address, editionDrop, setHasClaimedNFT);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      setMintingError("");
      await editionDrop.claim("0", 1);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.log("Failed to mint NFT", error.message);
      if (error.message.includes("insufficient funds")) {
        return setMintingError("Innsuficcient funds");
      }
      return setMintingError("Somthing went wrong");
    } finally {
      setIsClaiming(false);
    }
  };

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to 🏢TenementDAO</h1>
        <p>This project runs on Rinkeby Testnet Eth Network</p>
        <button
          type="button"
          onClick={connectWithMetamask}
          className="btn-hero"
        >
          Connect your wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <MemberPage
        hasClaimedNFT={hasClaimedNFT}
        editionDrop={editionDrop}
        address={address}
      />
    );
  }

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
