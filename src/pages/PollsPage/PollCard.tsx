import React from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Typography } from "components/atoms";
import { ROUTES } from "app-constants";
import { PollI } from "api";
import { Countdown } from "./Countdown";
import { CardFooter, CardHeader, Pill, PollCardWrap } from "./style";

const fmtDate = (iso?: string | null) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "dd MMM yyyy");
  } catch {
    return "";
  }
};

export const PollCard = ({ poll }: { poll: PollI }) => {
  const navigate = useNavigate();
  const goToDetail = () =>
    navigate(ROUTES.pollDetail.fullPath.replace(":id", String(poll.id)));

  const scopeLabel =
    poll.voting_scope === "property" ? "Per Property" : "Per Resident";
  const selectionLabel =
    poll.selection_type === "multi"
      ? `Pick up to ${poll.max_selections}`
      : "Single choice";

  return (
    <PollCardWrap
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetail();
        }
      }}
    >
      <CardHeader>
        <div>
          <Typography variant="subtitle" weight={600}>
            {poll.title}
          </Typography>
          {poll.description && (
            <Typography
              size={12}
              textColor="gray"
              style={{
                marginTop: 6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {poll.description}
            </Typography>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            alignItems: "flex-end",
          }}
        >
          <Pill tone="info">{scopeLabel}</Pill>
          <Pill tone="muted">{selectionLabel}</Pill>
        </div>
      </CardHeader>

      <CardFooter>
        {poll.is_open && !poll.has_ended && <Countdown endsAt={poll.ends_at} />}
        {poll.has_ended && <span>Closed {fmtDate(poll.ends_at)}</span>}
        {!poll.is_open && !poll.has_ended && (
          <span>Opens {fmtDate(poll.starts_at)}</span>
        )}
        {poll.has_ended && (
          <Pill tone="success">{(poll.votes_count ?? 0).toString()} votes</Pill>
        )}
      </CardFooter>
    </PollCardWrap>
  );
};
