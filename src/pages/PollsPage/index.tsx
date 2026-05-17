import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Typography } from "components/atoms";
import { Loader } from "components/atoms/Loader";
import { DashboardContent } from "layouts";
import { getPolls } from "pages/request";
import { PollFilter } from "api";
import { PollCard } from "./PollCard";
import { HistoryTab } from "./HistoryTab";
import {
  EmptyState,
  PageCard,
  PaginationBar,
  PaginationBtn,
  PollGrid,
  TabBar,
  TabBtn,
  Wrapper,
} from "./style";

type Tab = PollFilter | "history";

const TABS: { value: Tab; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "upcoming", label: "Upcoming" },
  { value: "closed", label: "Closed" },
  { value: "history", label: "My History" },
];

const PollsPage = () => {
  const [tab, setTab] = useState<Tab>("active");
  const [page, setPage] = useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [tab]);

  const isListTab = tab !== "history";

  const { data, isLoading, isFetching } = useQuery(
    [getPolls.key, tab, page],
    () => getPolls({ filter: tab as PollFilter, page, per_page: 10 }),
    { enabled: isListTab, keepPreviousData: true, refetchOnWindowFocus: true }
  );

  const polls = data?.items ?? [];

  return (
    <DashboardContent>
      <Wrapper>
        <PageCard>
          <Typography variant="heading4" style={{ marginBottom: 16 }}>
            Polls
          </Typography>

          <TabBar role="tablist">
            {TABS.map((t) => (
              <TabBtn
                key={t.value}
                type="button"
                role="tab"
                aria-selected={tab === t.value}
                active={tab === t.value}
                onClick={() => setTab(t.value)}
              >
                {t.label}
              </TabBtn>
            ))}
          </TabBar>

          {tab === "history" ? (
            <HistoryTab />
          ) : (
            <div style={{ position: "relative", minHeight: 200 }}>
              <Loader absolute open={isLoading || isFetching} />

              {!isLoading && polls.length === 0 && (
                <EmptyState>
                  <Typography variant="subtitle" textColor="gray">
                    {tab === "active" && "No active polls right now."}
                    {tab === "upcoming" && "No upcoming polls scheduled."}
                    {tab === "closed" && "No closed polls yet."}
                  </Typography>
                </EmptyState>
              )}

              <PollGrid>
                {polls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </PollGrid>

              {data && data.last_page > 1 && (
                <PaginationBar>
                  <PaginationBtn
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </PaginationBtn>
                  <span>
                    Page {data.current_page} of {data.last_page}
                  </span>
                  <PaginationBtn
                    type="button"
                    disabled={page >= data.last_page}
                    onClick={() =>
                      setPage((p) => Math.min(data.last_page, p + 1))
                    }
                  >
                    Next
                  </PaginationBtn>
                </PaginationBar>
              )}
            </div>
          )}
        </PageCard>
      </Wrapper>
    </DashboardContent>
  );
};

export default PollsPage;
