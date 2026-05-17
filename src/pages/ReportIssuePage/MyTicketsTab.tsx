import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { FiClock, FiMessageCircle } from "react-icons/fi";
import { Typography } from "components/atoms";
import { Loader } from "components/atoms/Loader";
import { ROUTES } from "app-constants";
import { getSupportTickets } from "pages/request";
import { SupportTicketStatus } from "api";
import {
  Chip,
  CommentsBadge,
  DuePill,
  EmptyState,
  FilterBar,
  FilterPill,
  FilterPills,
  PaginationBar,
  PaginationBtn,
  PriorityBadge,
  RowMeta,
  RowRight,
  SearchInput,
  StatusBadge,
  Thumb,
  TicketRow,
} from "./style";

const fmt = (iso?: string | null) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "dd MMM yyyy, hh:mm a");
  } catch {
    return iso;
  }
};

type Filter = "all" | SupportTicketStatus;
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "replied", label: "Replied" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export const MyTicketsTab = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  React.useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(t);
  }, [search]);

  const params = useMemo(
    () => ({
      status: filter === "all" ? undefined : filter,
      search: debouncedSearch || undefined,
      page,
      per_page: 20,
    }),
    [filter, debouncedSearch, page]
  );

  const { data, isLoading, isFetching } = useQuery(
    [getSupportTickets.key, params],
    () => getSupportTickets(params),
    { keepPreviousData: true, refetchOnWindowFocus: true }
  );

  const tickets = data?.data ?? [];
  const meta = data?.meta;

  React.useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch]);

  return (
    <div style={{ position: "relative", minHeight: 200 }}>
      <Loader absolute open={isLoading || isFetching} />

      <FilterBar>
        <FilterPills role="tablist">
          {FILTERS.map((f) => (
            <FilterPill
              key={f.value}
              type="button"
              role="tab"
              aria-selected={filter === f.value}
              active={filter === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </FilterPill>
          ))}
        </FilterPills>
        <SearchInput
          placeholder="Search tickets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </FilterBar>

      {!isLoading && tickets.length === 0 && (
        <EmptyState>
          <Typography variant="subtitle" textColor="gray">
            No tickets to show yet.
          </Typography>
        </EmptyState>
      )}

      {tickets.map((t) => (
        <TicketRow
          key={t.id}
          role="button"
          tabIndex={0}
          onClick={() =>
            navigate(
              ROUTES.reportIssueDetail.fullPath.replace(":id", String(t.id))
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(
                ROUTES.reportIssueDetail.fullPath.replace(":id", String(t.id))
              );
            }
          }}
        >
          <Thumb src={t.thumbnail_url}>
            {!t.thumbnail_url && <span>No photo</span>}
          </Thumb>
          <div>
            <Typography variant="subtitle" weight={600}>
              {t.subject}
            </Typography>
            <Typography size={12} textColor="gray">
              {t.ticket_number} · {t.issue_type?.name}
            </Typography>
            <RowMeta>
              <StatusBadge status={t.status} />
              <PriorityBadge priority={t.priority}>{t.priority}</PriorityBadge>
              {t.due_date && (
                <DuePill overdue={t.is_overdue}>
                  <FiClock size={11} />
                  {t.is_overdue ? "Overdue " : "Due "} {fmt(t.due_date)}
                </DuePill>
              )}
              {t.comments_count > 0 && (
                <CommentsBadge>
                  <FiMessageCircle size={11} /> {t.comments_count}
                </CommentsBadge>
              )}
              {t.property && <Chip>House {t.property.house_no}</Chip>}
            </RowMeta>
          </div>
          <RowRight>
            <span>Last activity</span>
            <strong>{fmt(t.last_activity_at)}</strong>
          </RowRight>
        </TicketRow>
      ))}

      {meta && meta.last_page > 1 && (
        <PaginationBar>
          <PaginationBtn
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </PaginationBtn>
          <span>
            Page {meta.current_page} of {meta.last_page}
          </span>
          <PaginationBtn
            type="button"
            disabled={page >= meta.last_page}
            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
          >
            Next
          </PaginationBtn>
        </PaginationBar>
      )}
    </div>
  );
};
