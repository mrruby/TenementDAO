import { useEffect } from "react";

export default function useAlreadyVoted(
  hasClaimedNFT,
  proposals,
  vote,
  address,
  setHasVoted,
  hasVoted
) {
  // We also need to check if the user already voted.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // If we haven't finished retrieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasAlreadyVoted = await vote.hasVoted(
          proposals[0].proposalId,
          address
        );
        setHasVoted(hasAlreadyVoted);
        if (hasVoted) {
          console.log("🥵 User has already voted");
        } else {
          console.log("🙂 User has not voted yet");
        }
      } catch (error) {
        console.error("Failed to check if wallet has voted", error);
      }
    };
    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, vote]);
}
