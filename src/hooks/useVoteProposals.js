import { useEffect, useState } from "react";

export default function useVoteProposals(hasClaimedNFT, vote) {
  const [proposals, setProposals] = useState([]);
  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // A simple call to vote.getAll() to grab the proposals.
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
