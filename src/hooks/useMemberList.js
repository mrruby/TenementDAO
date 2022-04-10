import { useMemo } from "react";

export default function useMemberList(memberAddresses, memberTokenAmounts) {
  const memberList = useMemo(
    () =>
      memberAddresses.map((eachAddress) => {
        const member = memberTokenAmounts?.find(
          ({ holder }) => holder === eachAddress
        );

        return {
          address: eachAddress,
          tokenAmount: member?.balance.displayValue || "0",
        };
      }),
    [memberAddresses, memberTokenAmounts]
  );
  return memberList;
}
