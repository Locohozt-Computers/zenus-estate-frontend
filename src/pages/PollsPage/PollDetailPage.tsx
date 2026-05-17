import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { FiArrowLeft } from "react-icons/fi";
import { Typography } from "components/atoms";
import { Loader } from "components/atoms/Loader";
import { DashboardContent } from "layouts";
import { ROUTES } from "app-constants";
import { getPoll } from "pages/request";
import { PollOptionI } from "api";
import { Countdown } from "./Countdown";
import { VoteForm } from "./VoteForm";
import { PollResults } from "./PollResults";
import {
  BackBtn,
  InfoBanner,
  LockedCard,
  PageCard,
  Pill,
  PollDescription,
  SelectedChip,
  Wrapper,
} from "./style";

const fmt = (iso?: string | null) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "dd MMM yyyy, hh:mm a");
  } catch {
    return "";
  }
};

const PollDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery(
    [getPoll.key, id],
    () => getPoll(id as string),
    {
      enabled: !!id,
      refetchInterval: (current) =>
        current?.poll?.is_open && !current.poll.has_ended ? 30_000 : false,
      refetchOnWindowFocus: true,
    }
  );

  if (isLoading) {
    return (
      <DashboardContent>
        <Wrapper>
          <PageCard>
            <Loader absolute={false} open />
          </PageCard>
        </Wrapper>
      </DashboardContent>
    );
  }

  if (isError || !data) {
    return (
      <DashboardContent>
        <Wrapper>
          <PageCard>
            <BackBtn
              type="button"
              onClick={() => navigate(ROUTES.polls.fullPath)}
            >
              <FiArrowLeft size={14} /> Back to polls
            </BackBtn>
            <Typography variant="subtitle" textColor="gray">
              We couldn&apos;t load this poll.
            </Typography>
          </PageCard>
        </Wrapper>
      </DashboardContent>
    );
  }

  const { poll, my_vote: myVote, results } = data;
  const isProperty = poll.voting_scope === "property";
  const scopeLabel = isProperty ? "Per Property" : "Per Resident";
  const selectionLabel =
    poll.selection_type === "multi"
      ? `Pick up to ${poll.max_selections}`
      : "Single choice";

  let body: React.ReactNode = null;

  if (poll.has_ended) {
    body = results ? (
      <PollResults poll={poll} results={results} />
    ) : (
      <InfoBanner tone="info">Results will appear here shortly.</InfoBanner>
    );
  } else if (myVote.has_voted) {
    body = (
      <LockedCard>
        <Typography variant="subtitle" weight={600}>
          You voted for:
        </Typography>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {myVote.options.map((o: PollOptionI) => (
            <SelectedChip key={o.id}>{o.label}</SelectedChip>
          ))}
        </div>
        {isProperty && (
          <InfoBanner tone="info" style={{ marginBottom: 0, marginTop: 4 }}>
            A member of your property has cast this property&apos;s vote.
          </InfoBanner>
        )}
        <Typography size={12} textColor="gray">
          Results will appear when voting closes on {fmt(poll.ends_at)}.
        </Typography>
      </LockedCard>
    );
  } else if (poll.is_open) {
    body = <VoteForm poll={poll} />;
  } else {
    body = (
      <InfoBanner tone="warn">
        This poll opens on {fmt(poll.starts_at)}.
      </InfoBanner>
    );
  }

  return (
    <DashboardContent>
      <Wrapper>
        <PageCard>
          <BackBtn
            type="button"
            onClick={() => navigate(ROUTES.polls.fullPath)}
          >
            <FiArrowLeft size={14} /> Back to polls
          </BackBtn>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="heading4">{poll.title}</Typography>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Pill tone="info">{scopeLabel}</Pill>
              <Pill tone="muted">{selectionLabel}</Pill>
              {poll.is_open && !poll.has_ended && (
                <Pill tone="success">Open</Pill>
              )}
              {poll.has_ended && <Pill tone="muted">Closed</Pill>}
            </div>
          </div>

          {poll.description && (
            <PollDescription>{poll.description}</PollDescription>
          )}

          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 22,
              fontSize: 12,
              color: "var(--med-gray)",
            }}
          >
            <span>Opens: {fmt(poll.starts_at)}</span>
            <span>Closes: {fmt(poll.ends_at)}</span>
            {poll.is_open && !poll.has_ended && (
              <Countdown endsAt={poll.ends_at} />
            )}
          </div>

          {body}
        </PageCard>
      </Wrapper>
    </DashboardContent>
  );
};

export default PollDetailPage;
