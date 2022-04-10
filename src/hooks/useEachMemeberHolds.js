import { useEffect, useState } from "react";

export default function useEachMemeberHolds(hasClaimedNFT, token) {
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
      } catch (error) {
        console.error("failed to get member balances", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);
  return memberTokenAmounts;
}
