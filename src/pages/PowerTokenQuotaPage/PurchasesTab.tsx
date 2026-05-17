import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Loader } from "components/atoms/Loader";
import { CopyableToken } from "components/atoms/CopyableToken";
import { getElectricityPurchases } from "pages/request";
import { useAppSelector } from "store";
import { clientSelectors } from "store/reducers/client/clientSlice";
import { currencyFormat } from "utils/helpers";

import {
  EmptyState,
  FilterBar,
  FilterLabel,
  Message,
  PageButton,
  PaginationBar,
  PurchaseAmount,
  PurchaseCard,
  PurchaseMeta,
  PurchaseTop,
  Select,
  StatusBadge,
} from "./style";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "paid_pending_token", label: "Paid (pending token)" },
  { value: "failed", label: "Failed" },
];

const PER_PAGE_OPTIONS = [5, 10, 20, 50];

const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const formatStatusLabel = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const PurchasesTab = () => {
  const selectedProperty = useAppSelector(clientSelectors.selectedProperty);
  const propertyId = selectedProperty?.id ?? null;

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [status, setStatus] = useState("");

  const { data, isLoading, isFetching, error } = useQuery(
    [getElectricityPurchases.key, propertyId, page, perPage, status],
    () =>
      getElectricityPurchases(propertyId as number, {
        page,
        per_page: perPage,
        status: status || undefined,
      }),
    { enabled: !!propertyId, keepPreviousData: true }
  );

  if (!propertyId) {
    return <Message>Select a property to view its purchase history.</Message>;
  }

  const items = data?.items ?? [];
  const currentPage = data?.current_page ?? page;
  const lastPage = data?.last_page ?? 1;
  const total = data?.total ?? 0;
  const from = data?.from ?? 0;
  const to = data?.to ?? 0;

  return (
    <div style={{ position: "relative", minHeight: 200 }}>
      <FilterBar>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FilterLabel htmlFor="purchase-status">Status</FilterLabel>
          <Select
            id="purchase-status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FilterLabel htmlFor="purchase-per-page">Per page</FilterLabel>
          <Select
            id="purchase-per-page"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {PER_PAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </div>
      </FilterBar>

      {(isLoading || isFetching) && <Loader open absolute />}

      {!!error && !isLoading && (
        <Message>Failed to load purchase history. Please try again.</Message>
      )}

      {!isLoading && items.length === 0 && !error && (
        <EmptyState>No electricity purchases found.</EmptyState>
      )}

      {items.map((p) => (
        <PurchaseCard key={p.id}>
          <PurchaseTop>
            <div>
              <PurchaseAmount>{currencyFormat(p.amount)}</PurchaseAmount>
              <PurchaseMeta>Ref: {p.reference}</PurchaseMeta>
              <PurchaseMeta>
                Meter: {p.meter.pan} &middot; {p.payment_provider} (
                {p.payment_channel})
              </PurchaseMeta>
              <PurchaseMeta>Paid: {fmtDate(p.paid_at)}</PurchaseMeta>
              {p.vended_at && (
                <PurchaseMeta>Vended: {fmtDate(p.vended_at)}</PurchaseMeta>
              )}
              {p.amount_charged != null && (
                <PurchaseMeta>
                  Charged: {currencyFormat(p.amount_charged)}
                  {p.fee != null && p.fee > 0
                    ? ` (incl. fee ${currencyFormat(p.fee)})`
                    : ""}
                </PurchaseMeta>
              )}
            </div>
            <StatusBadge status={p.status}>
              {formatStatusLabel(p.status)}
            </StatusBadge>
          </PurchaseTop>

          {p.token && <CopyableToken token={p.token} size="sm" />}
        </PurchaseCard>
      ))}

      {items.length > 0 && (
        <PaginationBar>
          <PageButton
            type="button"
            disabled={currentPage <= 1 || isFetching}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </PageButton>
          <span>
            Page {currentPage} of {lastPage} &middot; Showing {from}–{to} of{" "}
            {total}
          </span>
          <PageButton
            type="button"
            disabled={currentPage >= lastPage || isFetching}
            onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
          >
            Next
          </PageButton>
        </PaginationBar>
      )}
    </div>
  );
};
