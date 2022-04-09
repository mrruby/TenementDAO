import { useEffect, useState } from "react";

export default function useHoldingNFTAddresses(
  hasClaimedNFT,
  editionDropHistory
) {
  const [memberAddresses, setMemberAddresses] = useState([]);
  // This useEffect grabs all the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    const getAllAddresses = async () => {
      try {
        const reposnseMemberAddresses =
          await editionDropHistory.history.getAllClaimerAddresses(0);
        setMemberAddresses(reposnseMemberAddresses);
        console.log("🚀 Members addresses", memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDropHistory.history]);

  return memberAddresses;
}
