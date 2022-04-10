import React, { useState } from "react";
import { useToken, useVote } from "@thirdweb-dev/react";
import PropTypes from "prop-types";
import { AddressZero } from "@ethersproject/constants";
import useEachMemeberHolds from "../hooks/useEachMemeberHolds";
import useHoldingNFTAddresses from "../hooks/useHoldingNFTAddresses";
import useMemberList from "../hooks/useMemberList";
import useVoteProposals from "../hooks/useVoteProposals";
import useAlreadyVoted from "../hooks/useAlreadyVoted";

const MemberPage = ({ hasClaimedNFT, editionDrop, address }) => {
  const [isVoting, setIsVoting] = useState(false);
  const token = useToken(process.env.REACT_APP_TOKEN_ADDRESS);
  const vote = useVote(process.env.REACT_APP_VOTE_CONTRACT_ADDRESS);
  const memberTokenAmounts = useEachMemeberHolds(hasClaimedNFT, token);
  const memberAddresses = useHoldingNFTAddresses(hasClaimedNFT, editionDrop);

  const memberList = useMemberList(memberAddresses, memberTokenAmounts);

  const shortenAddress = (str) =>
    `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;

  const proposals = useVoteProposals(hasClaimedNFT, vote);

  const [hasVoted, setHasVoted] = useState(false);
  useAlreadyVoted(
    hasClaimedNFT,
    proposals,
    vote,
    address,
    setHasVoted,
    hasVoted
  );

  const buttonText = () => {
    if (isVoting) return "Voting...";
    if (hasVoted) return "You Already Voted";
    return "Submit Votes";
  };

  return (
    <div className="member-page">
      <h1>🏢TenementDAO Member Page</h1>
      <p>Congratulations on being a member</p>
      <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => (
                <tr key={member.address}>
                  <td>{shortenAddress(member.address)}</td>
                  <td>{member.tokenAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2>Active Proposals</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              setIsVoting(true);

              const votes = proposals.map((proposal) => {
                const voteResult = {
                  proposalId: proposal.proposalId,
                  // abstain by default
                  vote: 2,
                };
                proposal.votes.forEach((eachVote) => {
                  const elem = document.getElementById(
                    `${proposal.proposalId}-${eachVote.type}`
                  );

                  if (elem.checked) {
                    voteResult.vote = eachVote.type;
                  }
                });
                return voteResult;
              });

              try {
                const delegation = await token.getDelegationOf(address);
                if (delegation === AddressZero) {
                  await token.delegateTo(address);
                }
                try {
                  await Promise.all(
                    votes.map(async ({ proposalId, vote: _vote }) => {
                      const proposal = await vote.get(proposalId);
                      if (proposal.state === 1) {
                        return vote.vote(proposalId, _vote);
                      }
                    })
                  );
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId }) => {
                        const proposal = await vote.get(proposalId);

                        if (proposal.state === 4) {
                          return vote.execute(proposalId);
                        }
                      })
                    );
                    setHasVoted(true);
                  } catch (err) {
                    console.error("failed to execute votes", err);
                  }
                } catch (err) {
                  console.error("failed to vote", err);
                }
              } catch (err) {
                console.error("failed to delegate tokens");
              } finally {
                setIsVoting(false);
              }
            }}
          >
            {proposals.map((proposal) => (
              <div key={proposal.proposalId} className="card">
                <h5>{proposal.description}</h5>
                <div>
                  {proposal.votes.map(({ type, label }) => (
                    <div key={type}>
                      <input
                        type="radio"
                        id={`${proposal.proposalId}-${type}`}
                        name={proposal.proposalId}
                        value={type}
                        defaultChecked={type === 2}
                      />
                      <label htmlFor={`${proposal.proposalId}-${type}`}>
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button disabled={isVoting || hasVoted} type="submit">
              {buttonText()}
            </button>
            {!hasVoted && (
              <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

MemberPage.propTypes = {
  hasClaimedNFT: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  editionDrop: PropTypes.object.isRequired,
  address: PropTypes.string.isRequired,
};

export default MemberPage;
