import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Button, Typography } from "components/atoms";
import { Loader } from "components/atoms/Loader";
import { FiMapPin, FiRadio } from "react-icons/fi";
import { getMyEmergencies } from "pages/request";
import { EmergencyI } from "api";
import {
  Actions,
  CardHeaderRow,
  Chip,
  EmergencyCard,
  EmptyState,
  PaginationBar,
  StatusBadge,
} from "./style";
import { EmergencyIcon } from "./iconMap";
import { ResolveConfirmModal } from "./modals/ResolveConfirmModal";
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal";
import { EditEmergencyModal } from "./modals/EditEmergencyModal";

type Props = {
  onSwitchToReport: () => void;
};

const fmtDateTime = (iso: string) => {
  try {
    return format(parseISO(iso), "dd MMM yyyy, hh:mm a");
  } catch {
    return iso;
  }
};

export const MyEmergenciesTab = ({ onSwitchToReport }: Props) => {
  const [page, setPage] = useState(1);
  const [resolveId, setResolveId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<EmergencyI | null>(null);

  const { data, isLoading, isFetching } = useQuery(
    [getMyEmergencies.key, page],
    () => getMyEmergencies({ page }),
    { keepPreviousData: true }
  );

  const items = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;
  const currentPage = data?.current_page ?? page;

  return (
    <div style={{ position: "relative", minHeight: 200 }}>
      <Loader absolute open={isLoading || isFetching} />

      {!isLoading && items.length === 0 && (
        <EmptyState>
          <Typography variant="subtitle" textColor="gray">
            You haven&apos;t reported any emergencies yet.
          </Typography>
          <Button text="Report an emergency" onClick={onSwitchToReport} />
        </EmptyState>
      )}

      {items.map((e) => {
        const isActive = e.status === "active";
        return (
          <EmergencyCard key={e.id} accent={e.emergency_type?.color}>
            <CardHeaderRow>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <EmergencyIcon
                  icon={e.emergency_type?.icon}
                  color={e.emergency_type?.color}
                  size={22}
                />
                <Typography variant="subtitle" weight={600}>
                  {e.emergency_type?.name ?? "Emergency"}
                </Typography>
                <StatusBadge status={e.status}>{e.status}</StatusBadge>
                {e.broadcast_to_community && (
                  <Chip>
                    <FiRadio size={11} /> Broadcast
                  </Chip>
                )}
                {e.location && (
                  <Chip>
                    <FiMapPin size={11} /> {String(e.location.latitude)},{" "}
                    {String(e.location.longitude)}
                  </Chip>
                )}
              </div>
              <Typography size={12} textColor="gray">
                {fmtDateTime(e.created_at)}
              </Typography>
            </CardHeaderRow>

            <Typography size={14} style={{ color: "var(--dark-gray)" }}>
              {e.description}
            </Typography>

            {e.additional_info && (
              <Typography size={12} textColor="gray">
                <strong>Additional info:</strong> {e.additional_info}
              </Typography>
            )}

            {e.resolved_at && (
              <Typography size={12} textColor="gray">
                Resolved {fmtDateTime(e.resolved_at)}
              </Typography>
            )}

            <Actions>
              {isActive && (
                <>
                  <Button
                    type="button"
                    text="Mark resolved"
                    onClick={() => setResolveId(e.id)}
                  />
                  <Button
                    type="button"
                    secondary
                    text="Edit"
                    onClick={() => setEditTarget(e)}
                  />
                </>
              )}
              <Button
                type="button"
                secondary
                text="Delete"
                onClick={() => setDeleteId(e.id)}
              />
            </Actions>
          </EmergencyCard>
        );
      })}

      {items.length > 0 && lastPage > 1 && (
        <PaginationBar>
          <Button
            type="button"
            secondary
            text="Previous"
            disabled={currentPage <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          />
          <span>
            Page {currentPage} of {lastPage}
          </span>
          <Button
            type="button"
            secondary
            text="Next"
            disabled={currentPage >= lastPage || isFetching}
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
          />
        </PaginationBar>
      )}

      <ResolveConfirmModal
        emergencyId={resolveId}
        onClose={() => setResolveId(null)}
      />
      <DeleteConfirmModal
        emergencyId={deleteId}
        onClose={() => setDeleteId(null)}
      />
      <EditEmergencyModal
        emergency={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </div>
  );
};
