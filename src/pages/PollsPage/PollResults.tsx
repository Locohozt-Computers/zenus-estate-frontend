import React from "react";
import { Typography } from "components/atoms";
import { PollI, PollResultsI } from "api";
import {
  ResultBar,
  ResultBarFill,
  ResultHeader,
  ResultRow,
  TurnoutLine,
} from "./style";

interface Props {
  poll: PollI;
  results: PollResultsI;
}

export const PollResults = ({ poll, results }: Props) => {
  const maxVotes = results.options.reduce(
    (acc, opt) => Math.max(acc, opt.votes),
    0
  );
  const voterNoun =
    poll.voting_scope === "property" ? "properties" : "residents";

  return (
    <div>
      <Typography variant="subtitle" weight={600} style={{ marginBottom: 12 }}>
        Results
      </Typography>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {results.options.map((opt) => {
          const isWinner = maxVotes > 0 && opt.votes === maxVotes;
          return (
            <ResultRow key={opt.id} winner={isWinner}>
              <ResultHeader>
                <span>
                  {opt.label}
                  {isWinner && (
                    <span
                      style={{
                        marginLeft: 8,
                        color: "var(--blue)",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      WINNER
                    </span>
                  )}
                </span>
                <span style={{ color: "var(--med-gray)", fontSize: 12 }}>
                  {opt.votes} vote{opt.votes === 1 ? "" : "s"} ·{" "}
                  {opt.percentage}%
                </span>
              </ResultHeader>
              <ResultBar>
                <ResultBarFill pct={opt.percentage} winner={isWinner} />
              </ResultBar>
            </ResultRow>
          );
        })}
      </div>

      <TurnoutLine>
        {results.total_voters} of {results.eligible_voters} {voterNoun} voted (
        {results.turnout_percentage}% turnout)
      </TurnoutLine>
    </div>
  );
};
