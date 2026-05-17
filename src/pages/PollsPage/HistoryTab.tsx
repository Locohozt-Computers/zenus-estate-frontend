import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Typography } from "components/atoms";
import { Loader } from "components/atoms/Loader";
import { ROUTES } from "app-constants";
import { getPollHistory } from "pages/request";
import {
  EmptyState,
  HistoryRow,
  PaginationBar,
  PaginationBtn,
  Pill,
} from "./style";

const fmt = (iso?: string | null) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "dd MMM yyyy, hh:mm a");
  } catch {
    return iso;
  }
};

export const HistoryTab = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery(
    [getPollHistory.key, page],
    () => getPollHistory({ page, per_page: 15 }),
    { keepPreviousData: true, refetchOnWindowFocus: true }
  );

  const items = data?.items ?? [];

  return (
    <div style={{ position: "relative", minHeight: 200 }}>
      <Loader absolute open={isLoading || isFetching} />

      {!isLoading && items.length === 0 && (
        <EmptyState>
          <Typography variant="subtitle" textColor="gray">
            You haven&apos;t voted on any polls yet.
          </Typography>
        </EmptyState>
      )}

      {items.map((row) => (
        <HistoryRow
          key={row.id}
          role="button"
          tabIndex={0}
          onClick={() =>
            navigate(
              ROUTES.pollDetail.fullPath.replace(":id", String(row.poll.id))
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(
                ROUTES.pollDetail.fullPath.replace(":id", String(row.poll.id))
              );
            }
          }}
        >
          <div>
            <Typography variant="subtitle" weight={600}>
              {row.poll.title}
            </Typography>
            <Typography size={13} textColor="gray" style={{ marginTop: 4 }}>
              You voted: {row.option.label}
            </Typography>
            <Typography size={12} textColor="gray" style={{ marginTop: 4 }}>
              {fmt(row.voted_at)}
              {row.property ? ` · House ${row.property.house_no}` : ""}
            </Typography>
          </div>
          <Pill tone={row.poll.has_ended ? "success" : "info"}>
            {row.poll.has_ended ? "View results" : "View poll"}
          </Pill>
        </HistoryRow>
      ))}

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
            onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
          >
            Next
          </PaginationBtn>
        </PaginationBar>
      )}
    </div>
  );
};
