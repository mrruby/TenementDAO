import { useEffect, useState } from "react";

export default function useHoldingNFTAddresses(
  hasClaimedNFT,
  editionDropHistory
) {
  const [memberAddresses, setMemberAddresses] = useState([]);
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    const getAllAddresses = async () => {
      try {
        const reposnseMemberAddresses =
          await editionDropHistory.history.getAllClaimerAddresses(0);
        setMemberAddresses(reposnseMemberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDropHistory.history]);
  return memberAddresses;
}
