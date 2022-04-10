import { useEffect, useState } from "react";

export default function useVoteProposals(hasClaimedNFT, vote) {
  const [proposals, setProposals] = useState([]);
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllProposals = async () => {
      try {
        const proposalsFromContract = await vote.getAll();
        setProposals(proposalsFromContract);
      } catch (error) {
        console.log("failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  return proposals;
}
