import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format, parseISO } from "date-fns";
import { DashboardContent } from "layouts";
import { Button, Card, Modal, Typography } from "components/atoms";
import { AppIcon } from "utils";
import { notification, netErrorHandler } from "services";
import {
  approveExitVisit,
  cancelVisit,
  denyExitVisit,
  getVisitHistory,
  postRegisterVisit,
} from "pages/request";
import {
  VisitHistoryFilters,
  VisitHistoryItemI,
  VisitRegistrationBody,
  VisitResponseData,
} from "api";
import { FiChevronDown, FiChevronUp, FiFilter } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import {
  MdContentCopy,
  MdCheck,
  MdPeopleAlt,
  MdOutlineContacts,
} from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import {
  BsCalendar2Check,
  BsClockHistory,
  BsThreeDotsVertical,
} from "react-icons/bs";
import {
  HiOutlineShare,
  HiOutlineUserAdd,
  HiOutlineBan,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, "0");

const getDefaultTimes = () => {
  const now = new Date();
  const startDate = format(now, "yyyy-MM-dd");
  const roundedHour =
    now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours();
  const startHour = Math.min(roundedHour, 23);
  const endHour = Math.min(startHour + 3, 23);
  return {
    startDate,
    endDate: startDate,
    startTime: `${pad(startHour)}:00`,
    endTime: `${pad(endHour)}:00`,
  };
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";
  try {
    return format(parseISO(value), "dd MMM yyyy");
  } catch {
    return value;
  }
};

const formatTime = (value: string | null | undefined) => {
  if (!value) return "—";
  const match = /^(\d{1,2}):(\d{2})/.exec(value);
  if (!match) {
    try {
      return format(parseISO(value), "hh:mm a");
    } catch {
      return value;
    }
  }
  const h = Number(match[1]);
  const m = Number(match[2]);
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${pad(hh)}:${pad(m)} ${period}`;
};

const getInitials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

const getVisitType = (visit: VisitHistoryItemI) => {
  if (visit.schedule.one_time) return "One-time";
  if (visit.schedule.repeating) return "Recurring";
  return "—";
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const validationSchema = yup.object({
  name: yup.string().required("Name is required").max(255),
  phone: yup.string().required("Phone is required").max(20),
  allowCompany: yup.boolean(),
  company: yup
    .string()
    .max(255)
    .nullable()
    .when("allowCompany", {
      is: true,
      then: (s) => s.required("Company name is required"),
    }),
  oneTimeVisit: yup.string().required().oneOf(["yes", "no"]),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
  startTime: yup.string().nullable(),
  endTime: yup.string().nullable(),
  recurring: yup.boolean(),
  days: yup.array().of(yup.string()).nullable(),
  dates: yup.array().of(yup.string()).nullable(),
});

// ─── Styled Components ───────────────────────────────────────────────────────

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  .title-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const HistoryToggleBtn = styled.button<{ active?: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  background: ${({ active }) => (active ? "var(--blue)" : "white")};
  color: ${({ active }) => (active ? "white" : "var(--blue)")};
  border: 1.5px solid var(--blue);

  &:hover {
    background: var(--blue);
    color: white;
  }
`;

const FormCard = styled(Card)`
  padding: 28px 28px 36px;
  max-width: 680px;
  box-sizing: border-box;
`;

const SectionLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--med-gray);
  margin: 0 0 12px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ContactBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
  padding: 4px 10px;
  border-radius: 999px;
  border: 1.5px solid var(--blue);
  transition: all 0.2s;

  &:hover {
    background: #eff6ff;
  }
`;

const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

const ScheduleGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 540px) {
    gap: 10px;

    input[type="date"],
    input[type="time"] {
      padding: 8px 10px;
      font-size: 13px;
      min-width: 0;
    }

    label {
      font-size: 12px;
    }
  }
`;

const FormSection = styled.div`
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
  }

  input[type="text"],
  input[type="tel"],
  input[type="date"],
  input[type="time"] {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
    background: white;

    &:focus {
      border-color: var(--blue);
    }

    &.error {
      border-color: var(--pink);
    }
  }

  .field-error {
    font-size: 12px;
    color: var(--pink);
  }
`;

const SubmitRow = styled.div`
  margin-top: 8px;
  width: 100%;
  box-sizing: border-box;

  button {
    width: 100%;
    box-sizing: border-box;
  }
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Toggle = styled.button<{ on: boolean }>`
  all: unset;
  cursor: pointer;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: ${({ on }) => (on ? "var(--blue)" : "#d1d5db")};
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: ${({ on }) => (on ? "23px" : "3px")};
    width: 18px;
    height: 18px;
    border-radius: 9px;
    background: white;
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const RadioRow = styled.div`
  display: flex;
  gap: 12px;
`;

const RadioOption = styled.button<{ selected: boolean }>`
  all: unset;
  cursor: pointer;
  flex: 1;
  padding: 10px 0;
  text-align: center;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  border: 1.5px solid
    ${({ selected }) => (selected ? "var(--blue)" : "#e5e7eb")};
  background: ${({ selected }) => (selected ? "#eff6ff" : "white")};
  color: ${({ selected }) => (selected ? "var(--blue)" : "#6b7280")};
`;

const DaysGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const DayChip = styled.button<{ selected: boolean }>`
  all: unset;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  border: 1.5px solid
    ${({ selected }) => (selected ? "var(--blue)" : "#e5e7eb")};
  background: ${({ selected }) => (selected ? "var(--blue)" : "white")};
  color: ${({ selected }) => (selected ? "white" : "#6b7280")};
  transition: all 0.15s;
`;

const DatesTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const DateTag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #eff6ff;
  border-radius: 999px;
  font-size: 13px;
  color: var(--blue);

  button {
    all: unset;
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
    color: var(--blue);
  }
`;

// ─── History Styles ───────────────────────────────────────────────────────────

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 780px;
`;

const AccordionItem = styled.div<{ open: boolean }>`
  background: white;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  overflow: visible;
  border: 1.5px solid ${({ open }) => (open ? "var(--blue)" : "transparent")};
  transition: border-color 0.2s;
`;

const AccordionHeader = styled.div`
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  gap: 14px;
`;

const HeaderClickArea = styled.button`
  all: unset;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

const VisitorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--blue);
`;

const HeaderMeta = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sub {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const TokenBadge = styled.span`
  font-family: monospace;
  font-size: 13px;
  font-weight: 700;
  background: #f3f4f6;
  padding: 3px 9px;
  border-radius: 6px;
  color: #374151;
  flex-shrink: 0;

  @media (max-width: 500px) {
    display: none;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  flex-shrink: 0;
  white-space: nowrap;
  ${({ status }) => {
    switch (status?.toLowerCase()) {
      case "awaiting":
        return "background:#fef3c7; color:#92400e;";
      case "entry approved":
      case "active":
        return "background:#d1fae5; color:#065f46;";
      case "exit approved":
        return "background:#dbeafe; color:#1e40af;";
      case "completed":
        return "background:#f3f4f6; color:#374151;";
      case "cancelled":
      case "exit denied":
        return "background:#fee2e2; color:#991b1b;";
      default:
        return "background:#eff6ff; color:var(--blue);";
    }
  }}
`;

// ─── Dots Menu Styles ──────────────────────────────────────────────────────────

const DotsMenuWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const DotsBtn = styled.button<{ open: boolean }>`
  all: unset;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ open }) => (open ? "#eff6ff" : "transparent")};
  color: ${({ open }) => (open ? "var(--blue)" : "#9ca3af")};
  transition: all 0.15s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #f0f0f0;
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
`;

const DropdownItem = styled.button<{ danger?: boolean }>`
  all: unset;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ danger }) => (danger ? "#dc2626" : "#374151")};
  transition: background 0.15s;

  &:hover {
    background: ${({ danger }) => (danger ? "#fff5f5" : "#f9fafb")};
  }

  svg {
    flex-shrink: 0;
    opacity: 0.7;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: #f3f4f6;
  margin: 4px 0;
`;

const AccordionBody = styled.div`
  padding: 0 20px 20px;
  border-top: 1px solid #f3f4f6;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
  margin-top: 16px;
`;

const DetailItem = styled.div`
  .detail-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #9ca3af;
    margin-bottom: 3px;
  }

  .detail-value {
    font-size: 13px;
    font-weight: 500;
    color: #111827;
    word-break: break-word;
  }
`;

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
`;

const PageBtn = styled.button<{ active?: boolean }>`
  all: unset;
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  background: ${({ active }) => (active ? "var(--blue)" : "white")};
  color: ${({ active }) => (active ? "white" : "#374151")};
  border: 1.5px solid ${({ active }) => (active ? "var(--blue)" : "#e5e7eb")};
  transition: all 0.15s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: var(--blue);
    color: var(--blue);
  }
`;

// ─── Modal Styles ─────────────────────────────────────────────────────────────

const SuccessModalCard = styled(Card)`
  padding: 36px 32px;
  text-align: center;
`;

const AccessCodeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  border: 2px dashed var(--blue);
  border-radius: 16px;
  padding: 18px 32px;
  margin: 16px 0;

  span {
    font-family: monospace;
    font-size: 36px;
    font-weight: 800;
    color: var(--blue);
    letter-spacing: 6px;
  }
`;

const ShareActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;

  @media (max-width: 420px) {
    flex-direction: column;
  }
`;

const WhatsAppBtn = styled.a`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  border-radius: 10px;
  background: #25d366;
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const CopyBtn = styled.button<{ copied: boolean }>`
  all: unset;
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  border-radius: 10px;
  background: ${({ copied }) => (copied ? "#d1fae5" : "#f3f4f6")};
  color: ${({ copied }) => (copied ? "#065f46" : "#374151")};
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${({ copied }) => (copied ? "#d1fae5" : "#e5e7eb")};
  }
`;

const ShareBtn = styled.button`
  all: unset;
  cursor: pointer;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  border-radius: 10px;
  background: var(--blue);
  color: white;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
`;

// ─── Filter Styles ────────────────────────────────────────────────────────────

const FiltersToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  max-width: 780px;
`;

const FiltersToggleBtn = styled.button<{ open: boolean }>`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ open }) => (open ? "var(--blue)" : "white")};
  color: ${({ open }) => (open ? "white" : "var(--blue)")};
  border: 1.5px solid var(--blue);
  transition: all 0.15s;

  &:hover {
    background: ${({ open }) => (open ? "var(--blue)" : "#eff6ff")};
  }
`;

const ActiveCountBadge = styled.span<{ on: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: ${({ on }) => (on ? "white" : "var(--blue)")};
  color: ${({ on }) => (on ? "var(--blue)" : "white")};
`;

const FiltersCollapse = styled.div<{ open: boolean }>`
  display: grid;
  grid-template-rows: ${({ open }) => (open ? "1fr" : "0fr")};
  transition: grid-template-rows 0.25s ease;
  max-width: 780px;

  > .inner {
    overflow: hidden;
    min-height: 0;
  }
`;

const FiltersBar = styled.div`
  display: grid;
  grid-template-columns: minmax(180px, 1.5fr) repeat(3, minmax(130px, 1fr));
  gap: 10px;
  margin-bottom: 14px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FilterRange = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  align-items: end;
  margin-bottom: 18px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
  }

  input,
  select {
    width: 100%;
    padding: 9px 12px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    font-size: 13px;
    background: white;
    outline: none;
    box-sizing: border-box;

    &:focus {
      border-color: var(--blue);
    }
  }
`;

const ResetBtn = styled.button`
  all: unset;
  cursor: pointer;
  padding: 9px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--blue);
  border: 1.5px solid var(--blue);
  background: white;
  transition: all 0.15s;
  height: 38px;
  box-sizing: border-box;

  &:hover {
    background: #eff6ff;
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 12px;
  color: #6b7280;
  max-width: 780px;
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const VisitDetailView = ({ visit }: { visit: VisitHistoryItemI }) => (
  <AccordionBody>
    <DetailGrid>
      <DetailItem>
        <div className="detail-label">Phone</div>
        <div className="detail-value">{visit.visitor.phone || "—"}</div>
      </DetailItem>
      {visit.visitor.email && (
        <DetailItem>
          <div className="detail-label">Email</div>
          <div className="detail-value">{visit.visitor.email}</div>
        </DetailItem>
      )}
      {visit.visitor.type && (
        <DetailItem>
          <div className="detail-label">Visitor Type</div>
          <div className="detail-value">{visit.visitor.type}</div>
        </DetailItem>
      )}
      {visit.visitor.total_people != null && (
        <DetailItem>
          <div className="detail-label">People Expected</div>
          <div className="detail-value">{visit.visitor.total_people}</div>
        </DetailItem>
      )}
      <DetailItem>
        <div className="detail-label">Visit Type</div>
        <div className="detail-value">{getVisitType(visit)}</div>
      </DetailItem>
      {visit.schedule.frequency && (
        <DetailItem>
          <div className="detail-label">Frequency</div>
          <div className="detail-value">{visit.schedule.frequency}</div>
        </DetailItem>
      )}
      <DetailItem>
        <div className="detail-label">Start Date</div>
        <div className="detail-value">
          {formatDate(visit.schedule.start_date)}
        </div>
      </DetailItem>
      <DetailItem>
        <div className="detail-label">End Date</div>
        <div className="detail-value">
          {formatDate(visit.schedule.end_date)}
        </div>
      </DetailItem>
      <DetailItem>
        <div className="detail-label">Start Time</div>
        <div className="detail-value">
          {formatTime(visit.schedule.start_time)}
        </div>
      </DetailItem>
      <DetailItem>
        <div className="detail-label">End Time</div>
        <div className="detail-value">
          {formatTime(visit.schedule.end_time)}
        </div>
      </DetailItem>
      {visit.schedule.days_of_week && visit.schedule.days_of_week.length > 0 && (
        <DetailItem>
          <div className="detail-label">Recurring Days</div>
          <div className="detail-value">
            {visit.schedule.days_of_week.join(", ")}
          </div>
        </DetailItem>
      )}
      {visit.schedule.specific_dates &&
        visit.schedule.specific_dates.length > 0 && (
          <DetailItem>
            <div className="detail-label">Specific Dates</div>
            <div className="detail-value">
              {visit.schedule.specific_dates.join(", ")}
            </div>
          </DetailItem>
        )}
      <DetailItem>
        <div className="detail-label">Access Code</div>
        <div
          className="detail-value"
          style={{ fontFamily: "monospace", fontWeight: 700 }}
        >
          {visit.token}
        </div>
      </DetailItem>
      <DetailItem>
        <div className="detail-label">Times Used</div>
        <div className="detail-value">{visit.access.times_used ?? 0}</div>
      </DetailItem>
      {visit.access.reuse_limit != null && (
        <DetailItem>
          <div className="detail-label">Reuse Limit</div>
          <div className="detail-value">
            {visit.access.uses_remaining} / {visit.access.reuse_limit} left
          </div>
        </DetailItem>
      )}
      {visit.access.duration_hours != null && (
        <DetailItem>
          <div className="detail-label">Duration</div>
          <div className="detail-value">{visit.access.duration_hours} hrs</div>
        </DetailItem>
      )}
      {visit.host.property_unit && (
        <DetailItem>
          <div className="detail-label">Unit</div>
          <div className="detail-value">#{visit.host.property_unit}</div>
        </DetailItem>
      )}
      {visit.host.estate && (
        <DetailItem>
          <div className="detail-label">Estate</div>
          <div className="detail-value">{visit.host.estate}</div>
        </DetailItem>
      )}
      {visit.host.name && (
        <DetailItem>
          <div className="detail-label">Host</div>
          <div className="detail-value">{visit.host.name}</div>
        </DetailItem>
      )}
      {visit.notes && (
        <DetailItem style={{ gridColumn: "1 / -1" }}>
          <div className="detail-label">Notes</div>
          <div className="detail-value">{visit.notes}</div>
        </DetailItem>
      )}
    </DetailGrid>
  </AccordionBody>
);

// ─── Dots Menu Component ──────────────────────────────────────────────────────

interface DotsMenuProps {
  visit: VisitHistoryItemI;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onReshare: () => void;
  onReinvite: () => void;
  onCancel: () => void;
  onApproveExit: () => void;
  onDenyExit: () => void;
  isLoading: boolean;
}

const VisitDotsMenu = ({
  visit,
  isOpen,
  onToggle,
  onClose,
  onReshare,
  onReinvite,
  onCancel,
  onApproveExit,
  onDenyExit,
  isLoading,
}: DotsMenuProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [isOpen, onClose]);

  const handle = (action: () => void) => () => {
    onClose();
    action();
  };

  const isCancelled = visit.status?.toLowerCase() === "cancelled";

  return (
    <DotsMenuWrapper ref={wrapperRef}>
      <DotsBtn
        type="button"
        open={isOpen}
        disabled={isLoading}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-label="Visit actions"
      >
        <AppIcon render={BsThreeDotsVertical} size={16} />
      </DotsBtn>
      {isOpen && (
        <DropdownMenu onClick={(e) => e.stopPropagation()}>
          <DropdownItem type="button" onClick={handle(onReshare)}>
            <AppIcon render={HiOutlineShare} size={15} />
            Reshare Code
          </DropdownItem>
          <DropdownItem type="button" onClick={handle(onReinvite)}>
            <AppIcon render={HiOutlineUserAdd} size={15} />
            Reinvite Guest
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem type="button" onClick={handle(onApproveExit)}>
            <AppIcon render={HiOutlineCheckCircle} size={15} />
            Approve Exit
          </DropdownItem>
          <DropdownItem type="button" onClick={handle(onDenyExit)}>
            <AppIcon render={HiOutlineXCircle} size={15} />
            Deny Exit
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            type="button"
            danger
            disabled={isCancelled}
            onClick={handle(onCancel)}
          >
            <AppIcon render={HiOutlineBan} size={15} />
            Cancel Visit
          </DropdownItem>
        </DropdownMenu>
      )}
    </DotsMenuWrapper>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const VisitorsPage = () => {
  const queryClient = useQueryClient();
  const defaults = getDefaultTimes();

  const [view, setView] = useState<"register" | "history">("register");
  const [successData, setSuccessData] = useState<VisitResponseData | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<VisitHistoryFilters>({
    search: "",
    status: "",
    scope: "",
    visit_type: "",
    date_from: "",
    date_to: "",
    sort: "recent",
    per_page: 20,
  });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [shareVisit, setShareVisit] = useState<VisitHistoryItemI | null>(null);
  const [copied, setCopied] = useState(false);
  const [resharecopied, setResharecopied] = useState(false);
  const [dateInput, setDateInput] = useState("");

  const updateFilter = <K extends keyof VisitHistoryFilters>(
    key: K,
    value: VisitHistoryFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      scope: "",
      visit_type: "",
      date_from: "",
      date_to: "",
      sort: "recent",
      per_page: 20,
    });
    setPage(1);
  };

  // Check Contact Picker API support
  const supportsContacts =
    typeof navigator !== "undefined" && "contacts" in navigator;

  // Check Web Share API support (native share sheet on mobile, partial on desktop)
  const supportsNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const registerMutation = useMutation(postRegisterVisit, {
    onSuccess: (res) => {
      setSuccessData(res.data);
    },
    onError: (err: AxiosError) => {
      notification.error(netErrorHandler(err));
    },
  });

  const cancelMutation = useMutation(cancelVisit, {
    onSuccess: (res) => {
      notification.success(res.message || "Visit cancelled");
      setOpenMenuId(null);
      queryClient.invalidateQueries([getVisitHistory.key]);
    },
    onError: (err: AxiosError) => {
      notification.error(netErrorHandler(err));
    },
  });

  const approveExitMutation = useMutation(approveExitVisit, {
    onSuccess: (res) => {
      notification.success(res.message || "Exit approved");
      setOpenMenuId(null);
      queryClient.invalidateQueries([getVisitHistory.key]);
    },
    onError: (err: AxiosError) => {
      notification.error(netErrorHandler(err));
    },
  });

  const denyExitMutation = useMutation(denyExitVisit, {
    onSuccess: (res) => {
      notification.success(res.message || "Exit denied");
      setOpenMenuId(null);
      queryClient.invalidateQueries([getVisitHistory.key]);
    },
    onError: (err: AxiosError) => {
      notification.error(netErrorHandler(err));
    },
  });

  const historyQuery = useQuery(
    [getVisitHistory.key, page, filters],
    () => getVisitHistory({ ...filters, page }),
    { enabled: view === "history", keepPreviousData: true }
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      allowCompany: false,
      company: "",
      oneTimeVisit: "yes" as "yes" | "no",
      startDate: defaults.startDate,
      endDate: defaults.endDate,
      startTime: defaults.startTime,
      endTime: defaults.endTime,
      recurring: false,
      days: [] as string[],
      dates: [] as string[],
    },
    validationSchema,
    onSubmit: (values) => {
      const payload: VisitRegistrationBody = {
        name: values.name,
        phone: values.phone,
        oneTimeVisit: values.oneTimeVisit,
        startDate: values.startDate,
        endDate: values.endDate,
        allowCompany: values.allowCompany || undefined,
        company: values.allowCompany ? values.company || null : undefined,
        startTime: values.startTime || null,
        endTime: values.endTime || null,
        recurring: values.oneTimeVisit === "no" ? values.recurring : undefined,
        days:
          values.oneTimeVisit === "no" && values.days.length > 0
            ? values.days
            : null,
        dates:
          values.oneTimeVisit === "no" && values.dates.length > 0
            ? values.dates
            : null,
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      registerMutation.mutate(payload);
    },
  });

  const toggleDay = (day: string) => {
    const current = formik.values.days;
    formik.setFieldValue(
      "days",
      current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day]
    );
  };

  const addDate = () => {
    if (dateInput && !formik.values.dates.includes(dateInput)) {
      formik.setFieldValue("dates", [...formik.values.dates, dateInput]);
      setDateInput("");
    }
  };

  const removeDate = (d: string) => {
    formik.setFieldValue(
      "dates",
      formik.values.dates.filter((x) => x !== d)
    );
  };

  const handleCloseSuccess = () => {
    setSuccessData(null);
    formik.resetForm();
  };

  const handleCopy = (message: string, setter: (v: boolean) => void) => {
    navigator.clipboard
      .writeText(message)
      .then(() => {
        setter(true);
        setTimeout(() => setter(false), 2500);
      })
      .catch(() => {
        notification.error("Failed to copy message");
      });
  };

  const handleNativeShare = (message: string, title?: string) => {
    if (!supportsNativeShare) return;
    navigator
      .share({ title: title || "Visitor Access Code", text: message })
      .catch((err: DOMException) => {
        // user cancelled — silent. Other errors -> notify.
        if (err && err.name !== "AbortError") {
          notification.error("Could not open share sheet");
        }
      });
  };

  const handleAddFromContact = () => {
    if (!supportsContacts) return;
    (
      navigator as unknown as {
        contacts: {
          select: (
            props: string[],
            opts: { multiple: boolean }
          ) => Promise<Array<{ name?: string[]; tel?: string[] }>>;
        };
      }
    ).contacts
      .select(["name", "tel"], { multiple: false })
      .then((results) => {
        if (results && results.length > 0) {
          const contact = results[0];
          if (contact.name?.[0]) {
            formik.setFieldValue("name", contact.name[0]);
          }
          if (contact.tel?.[0]) {
            formik.setFieldValue("phone", contact.tel[0]);
          }
        }
      })
      .catch(() => {
        // user cancelled or error — silent fail
      });
  };

  const handleReinvite = (visit: VisitHistoryItemI) => {
    const fresh = getDefaultTimes();
    formik.resetForm({
      values: {
        name: `${visit.visitor.first_name} ${visit.visitor.last_name}`.trim(),
        phone: visit.visitor.phone,
        allowCompany: false,
        company: "",
        oneTimeVisit: visit.schedule.one_time ? "yes" : "no",
        startDate: fresh.startDate,
        endDate: fresh.endDate,
        startTime: fresh.startTime,
        endTime: fresh.endTime,
        recurring: visit.schedule.repeating,
        days: visit.schedule.days_of_week ?? [],
        dates: [],
      },
    });
    setView("register");
  };

  const isActionLoading =
    cancelMutation.isLoading ||
    approveExitMutation.isLoading ||
    denyExitMutation.isLoading;

  const historyData = historyQuery.data;
  const visits = historyData?.data ?? [];
  const meta = historyData?.meta;
  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const fromIdx = meta?.from ?? 0;
  const toIdx = meta?.to ?? 0;
  const pageNumbers = Array.from({ length: lastPage }, (_, i) => i + 1);

  const activeFilterCount = (
    [
      filters.search,
      filters.status,
      filters.scope,
      filters.visit_type,
      filters.date_from,
      filters.date_to,
    ] as Array<string | undefined>
  ).filter((v) => v && v !== "").length;

  return (
    <DashboardContent>
      {/* ── Page Header ── */}
      <PageHeader>
        <div className="title-group">
          <AppIcon
            render={MdPeopleAlt}
            size={26}
            style={{ color: "var(--blue)" }}
          />
          <Typography variant="heading4" weight={700}>
            Visitors
          </Typography>
        </div>
        <HistoryToggleBtn
          active={view === "history"}
          onClick={() => setView(view === "history" ? "register" : "history")}
        >
          {view === "history" ? (
            <>
              <AppIcon render={IoMdArrowBack} size={16} />
              Register Visit
            </>
          ) : (
            <>
              <AppIcon render={BsClockHistory} size={14} />
              History
            </>
          )}
        </HistoryToggleBtn>
      </PageHeader>

      {/* ── Register View ── */}
      {view === "register" && (
        <FormCard>
          <form onSubmit={formik.handleSubmit} noValidate>
            {/* Visitor Info */}
            <FormSection>
              <SectionHeader>
                <SectionLabel style={{ margin: 0 }}>
                  Visitor Information
                </SectionLabel>
                {supportsContacts && (
                  <ContactBtn type="button" onClick={handleAddFromContact}>
                    <AppIcon render={MdOutlineContacts} size={14} />
                    Add from Contacts
                  </ContactBtn>
                )}
              </SectionHeader>
              <FieldGroup>
                <FieldWrapper>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. John Doe"
                    className={
                      formik.touched.name && formik.errors.name ? "error" : ""
                    }
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <span className="field-error">{formik.errors.name}</span>
                  )}
                </FieldWrapper>
                <FieldWrapper>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 08012345678"
                    className={
                      formik.touched.phone && formik.errors.phone ? "error" : ""
                    }
                    {...formik.getFieldProps("phone")}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <span className="field-error">{formik.errors.phone}</span>
                  )}
                </FieldWrapper>
              </FieldGroup>
              <div style={{ marginTop: 16 }}>
                <ToggleRow>
                  <Toggle
                    type="button"
                    on={formik.values.allowCompany}
                    onClick={() => {
                      formik.setFieldValue(
                        "allowCompany",
                        !formik.values.allowCompany
                      );
                    }}
                  />
                  <Typography size={14} style={{ color: "#374151" }}>
                    Visiting on behalf of a company
                  </Typography>
                </ToggleRow>
                {formik.values.allowCompany && (
                  <FieldWrapper style={{ marginTop: 14 }}>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="company">Company Name *</label>
                    <input
                      id="company"
                      type="text"
                      placeholder="e.g. ABC Logistics"
                      className={
                        formik.touched.company && formik.errors.company
                          ? "error"
                          : ""
                      }
                      {...formik.getFieldProps("company")}
                    />
                    {formik.touched.company && formik.errors.company && (
                      <span className="field-error">
                        {formik.errors.company}
                      </span>
                    )}
                  </FieldWrapper>
                )}
              </div>
            </FormSection>

            {/* Visit Type */}
            <FormSection>
              <SectionLabel>Visit Type</SectionLabel>
              <RadioRow>
                <RadioOption
                  type="button"
                  selected={formik.values.oneTimeVisit === "yes"}
                  onClick={() => {
                    formik.setFieldValue("oneTimeVisit", "yes");
                  }}
                >
                  One-time Visit
                </RadioOption>
                <RadioOption
                  type="button"
                  selected={formik.values.oneTimeVisit === "no"}
                  onClick={() => {
                    formik.setFieldValue("oneTimeVisit", "no");
                  }}
                >
                  Recurring Visit
                </RadioOption>
              </RadioRow>
            </FormSection>

            {/* Schedule */}
            <FormSection>
              <SectionLabel>Schedule</SectionLabel>
              <ScheduleGroup>
                <FieldWrapper>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="startDate">Start Date *</label>
                  <input
                    id="startDate"
                    type="date"
                    className={
                      formik.touched.startDate && formik.errors.startDate
                        ? "error"
                        : ""
                    }
                    {...formik.getFieldProps("startDate")}
                  />
                  {formik.touched.startDate && formik.errors.startDate && (
                    <span className="field-error">
                      {formik.errors.startDate}
                    </span>
                  )}
                </FieldWrapper>
                <FieldWrapper>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="startTime">Start Time</label>
                  <input
                    id="startTime"
                    type="time"
                    {...formik.getFieldProps("startTime")}
                  />
                </FieldWrapper>
                <FieldWrapper>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="endDate">End Date *</label>
                  <input
                    id="endDate"
                    type="date"
                    className={
                      formik.touched.endDate && formik.errors.endDate
                        ? "error"
                        : ""
                    }
                    {...formik.getFieldProps("endDate")}
                  />
                  {formik.touched.endDate && formik.errors.endDate && (
                    <span className="field-error">{formik.errors.endDate}</span>
                  )}
                </FieldWrapper>
                <FieldWrapper>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="endTime">End Time</label>
                  <input
                    id="endTime"
                    type="time"
                    {...formik.getFieldProps("endTime")}
                  />
                </FieldWrapper>
              </ScheduleGroup>
            </FormSection>

            {/* Recurring Options */}
            {formik.values.oneTimeVisit === "no" && (
              <FormSection>
                <SectionLabel>Recurring Options</SectionLabel>
                <ToggleRow style={{ marginBottom: 16 }}>
                  <Toggle
                    type="button"
                    on={formik.values.recurring}
                    onClick={() => {
                      formik.setFieldValue(
                        "recurring",
                        !formik.values.recurring
                      );
                    }}
                  />
                  <Typography size={14} style={{ color: "#374151" }}>
                    Enable recurring schedule
                  </Typography>
                </ToggleRow>
                {formik.values.recurring && (
                  <>
                    <Typography
                      size={13}
                      style={{ color: "#6b7280", marginBottom: 10 }}
                    >
                      Select days of the week
                    </Typography>
                    <DaysGrid>
                      {DAYS.map((day) => (
                        <DayChip
                          key={day}
                          type="button"
                          selected={formik.values.days.includes(day)}
                          onClick={() => toggleDay(day)}
                        >
                          {day}
                        </DayChip>
                      ))}
                    </DaysGrid>

                    <Typography
                      size={13}
                      style={{ color: "#6b7280", margin: "16px 0 10px" }}
                    >
                      Or add specific dates
                    </Typography>
                    <div style={{ display: "flex", gap: 10 }}>
                      <input
                        type="date"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "10px 14px",
                          border: "1.5px solid #e5e7eb",
                          borderRadius: 10,
                          fontSize: 14,
                          outline: "none",
                          background: "white",
                          boxSizing: "border-box",
                        }}
                      />
                      <Button
                        type="button"
                        text="Add"
                        onClick={addDate}
                        style={{ minWidth: 70 }}
                      />
                    </div>
                    {formik.values.dates.length > 0 && (
                      <DatesTagList>
                        {formik.values.dates.map((d) => (
                          <DateTag key={d}>
                            <AppIcon render={BsCalendar2Check} size={12} />
                            {d}
                            <button
                              type="button"
                              onClick={() => removeDate(d)}
                              aria-label="remove date"
                            >
                              ×
                            </button>
                          </DateTag>
                        ))}
                      </DatesTagList>
                    )}
                  </>
                )}
              </FormSection>
            )}

            <SubmitRow>
              <Button
                type="submit"
                text="Register Visitor"
                loading={registerMutation.isLoading}
              />
            </SubmitRow>
          </form>
        </FormCard>
      )}

      {/* ── History View ── */}
      {view === "history" && (
        <>
          <FiltersToggleRow>
            <FiltersToggleBtn
              type="button"
              open={filtersOpen}
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              aria-controls="visits-filters-panel"
            >
              <AppIcon render={FiFilter} size={14} />
              Filters
              {activeFilterCount > 0 && (
                <ActiveCountBadge on={filtersOpen}>
                  {activeFilterCount}
                </ActiveCountBadge>
              )}
              <AppIcon
                render={filtersOpen ? FiChevronUp : FiChevronDown}
                size={14}
              />
            </FiltersToggleBtn>
            {activeFilterCount > 0 && (
              <ResetBtn
                type="button"
                onClick={resetFilters}
                style={{ height: 34, padding: "0 12px" }}
              >
                Clear
              </ResetBtn>
            )}
          </FiltersToggleRow>
          <FiltersCollapse
            id="visits-filters-panel"
            open={filtersOpen}
            aria-hidden={!filtersOpen}
          >
            <div className="inner">
              <FiltersBar>
                <FilterField>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="filter-search">Search</label>
                  <input
                    id="filter-search"
                    type="text"
                    placeholder="Name, phone, or token"
                    value={filters.search ?? ""}
                    onChange={(e) => updateFilter("search", e.target.value)}
                  />
                </FilterField>
                <FilterField>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="filter-status">Status</label>
                  <select
                    id="filter-status"
                    value={filters.status ?? ""}
                    onChange={(e) =>
                      updateFilter(
                        "status",
                        e.target.value as VisitHistoryFilters["status"]
                      )
                    }
                  >
                    <option value="">All</option>
                    <option value="Awaiting">Awaiting</option>
                    <option value="Entry Approved">Entry Approved</option>
                    <option value="Exit Approved">Exit Approved</option>
                    <option value="Exit Denied">Exit Denied</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </FilterField>
                <FilterField>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="filter-scope">Scope</label>
                  <select
                    id="filter-scope"
                    value={filters.scope ?? ""}
                    onChange={(e) =>
                      updateFilter(
                        "scope",
                        e.target.value as VisitHistoryFilters["scope"]
                      )
                    }
                  >
                    <option value="">All</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="today">Today</option>
                    <option value="past">Past</option>
                  </select>
                </FilterField>
                <FilterField>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="filter-type">Visit Type</label>
                  <select
                    id="filter-type"
                    value={filters.visit_type ?? ""}
                    onChange={(e) =>
                      updateFilter(
                        "visit_type",
                        e.target.value as VisitHistoryFilters["visit_type"]
                      )
                    }
                  >
                    <option value="">All</option>
                    <option value="one_time">One-time</option>
                    <option value="recurring">Recurring</option>
                  </select>
                </FilterField>
              </FiltersBar>
              <FilterRange>
                <FilterField>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="filter-from">Date From</label>
                  <input
                    id="filter-from"
                    type="date"
                    value={filters.date_from ?? ""}
                    onChange={(e) => updateFilter("date_from", e.target.value)}
                  />
                </FilterField>
                <FilterField>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="filter-to">Date To</label>
                  <input
                    id="filter-to"
                    type="date"
                    value={filters.date_to ?? ""}
                    onChange={(e) => updateFilter("date_to", e.target.value)}
                  />
                </FilterField>
                <FilterField>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor="filter-sort">Sort</label>
                  <select
                    id="filter-sort"
                    value={filters.sort ?? "recent"}
                    onChange={(e) =>
                      updateFilter(
                        "sort",
                        e.target.value as VisitHistoryFilters["sort"]
                      )
                    }
                  >
                    <option value="recent">Most Recent</option>
                    <option value="upcoming">Upcoming First</option>
                  </select>
                </FilterField>
                <ResetBtn type="button" onClick={resetFilters}>
                  Reset
                </ResetBtn>
              </FilterRange>
            </div>
          </FiltersCollapse>

          {!historyQuery.isLoading && total > 0 && (
            <MetaRow>
              <span>
                Showing {fromIdx}–{toIdx} of {total}
              </span>
              <span>
                Page {meta?.current_page ?? page} / {lastPage}
              </span>
            </MetaRow>
          )}

          {historyQuery.isLoading && (
            <Typography style={{ color: "#6b7280" }}>
              Loading visit history…
            </Typography>
          )}
          {!historyQuery.isLoading && visits.length === 0 && (
            <EmptyState>
              <AppIcon
                render={MdPeopleAlt}
                size={48}
                style={{
                  opacity: 0.3,
                  display: "block",
                  margin: "0 auto 12px",
                }}
              />
              <Typography size={15}>
                No visits match the current filters.
              </Typography>
            </EmptyState>
          )}
          {!historyQuery.isLoading && visits.length > 0 && (
            <>
              <HistoryList>
                {visits.map((visit) => {
                  const isOpen = expandedId === visit.id;
                  const isMenuOpen = openMenuId === visit.id;
                  return (
                    <AccordionItem key={visit.id} open={isOpen}>
                      <AccordionHeader>
                        <HeaderClickArea
                          type="button"
                          onClick={() =>
                            setExpandedId(isOpen ? null : visit.id)
                          }
                        >
                          <VisitorAvatar>
                            {getInitials(
                              visit.visitor.first_name,
                              visit.visitor.last_name
                            )}
                          </VisitorAvatar>
                          <HeaderMeta>
                            <div className="name">
                              {visit.visitor.name ||
                                `${visit.visitor.first_name} ${visit.visitor.last_name}`.trim()}
                            </div>
                            <div className="sub">
                              {formatDate(visit.schedule.expected_date)} ·{" "}
                              {formatTime(visit.schedule.expected_time)}
                            </div>
                          </HeaderMeta>
                          <StatusBadge status={visit.status}>
                            {visit.status}
                          </StatusBadge>
                          <TokenBadge>{visit.token}</TokenBadge>
                          <AppIcon
                            render={isOpen ? FiChevronUp : FiChevronDown}
                            size={18}
                            style={{ color: "#9ca3af", flexShrink: 0 }}
                          />
                        </HeaderClickArea>
                        <VisitDotsMenu
                          visit={visit}
                          isOpen={isMenuOpen}
                          onToggle={() =>
                            setOpenMenuId(isMenuOpen ? null : visit.id)
                          }
                          onClose={() => setOpenMenuId(null)}
                          onReshare={() => setShareVisit(visit)}
                          onReinvite={() => handleReinvite(visit)}
                          onCancel={() => cancelMutation.mutate(visit.id)}
                          onApproveExit={() =>
                            approveExitMutation.mutate(visit.id)
                          }
                          onDenyExit={() => denyExitMutation.mutate(visit.id)}
                          isLoading={isActionLoading}
                        />
                      </AccordionHeader>
                      {isOpen && <VisitDetailView visit={visit} />}
                    </AccordionItem>
                  );
                })}
              </HistoryList>

              {lastPage > 1 && (
                <PaginationRow>
                  <PageBtn
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ‹
                  </PageBtn>
                  {pageNumbers.map((n) => (
                    <PageBtn
                      key={n}
                      active={n === page}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </PageBtn>
                  ))}
                  <PageBtn
                    disabled={page === lastPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    ›
                  </PageBtn>
                </PaginationRow>
              )}
            </>
          )}
        </>
      )}

      {/* ── Register Success Modal ── */}
      <Modal
        visible={!!successData}
        maxWidth={480}
        closeModal={handleCloseSuccess}
        showCloseBtn
      >
        {successData && (
          <SuccessModalCard>
            <div style={{ fontSize: 40, marginBottom: 4 }}>🎉</div>
            <Typography variant="heading4" weight={700}>
              Visitor Registered!
            </Typography>
            <Typography size={14} style={{ color: "#6b7280", marginTop: 6 }}>
              Share this access code with{" "}
              <strong>{successData.visitor.name}</strong>
            </Typography>

            <AccessCodeBadge>
              <span>{successData.token}</span>
            </AccessCodeBadge>

            <Typography size={12} style={{ color: "#9ca3af" }}>
              Valid from{" "}
              <strong>
                {successData.schedule.start_date}
                {successData.schedule.start_time
                  ? ` at ${successData.schedule.start_time}`
                  : ""}
              </strong>{" "}
              to{" "}
              <strong>
                {successData.schedule.end_date}
                {successData.schedule.end_time
                  ? ` at ${successData.schedule.end_time}`
                  : ""}
              </strong>
            </Typography>

            <ShareActions>
              {supportsNativeShare && (
                <ShareBtn
                  type="button"
                  onClick={() =>
                    handleNativeShare(
                      successData.share_message,
                      `Access code for ${successData.visitor.name}`
                    )
                  }
                >
                  <AppIcon render={HiOutlineShare} size={17} />
                  Share
                </ShareBtn>
              )}
              <WhatsAppBtn
                href={successData.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppIcon render={FaWhatsapp} size={18} />
                WhatsApp
              </WhatsAppBtn>
              <CopyBtn
                type="button"
                copied={copied}
                onClick={() => handleCopy(successData.share_message, setCopied)}
              >
                <AppIcon render={copied ? MdCheck : MdContentCopy} size={17} />
                {copied ? "Copied!" : "Copy"}
              </CopyBtn>
            </ShareActions>
          </SuccessModalCard>
        )}
      </Modal>

      {/* ── Reshare Modal ── */}
      <Modal
        visible={!!shareVisit}
        maxWidth={440}
        closeModal={() => setShareVisit(null)}
        showCloseBtn
      >
        {shareVisit && (
          <SuccessModalCard>
            <Typography variant="heading4" weight={700}>
              Reshare Access Code
            </Typography>
            <Typography size={14} style={{ color: "#6b7280", marginTop: 6 }}>
              {shareVisit.visitor.name ||
                `${shareVisit.visitor.first_name} ${shareVisit.visitor.last_name}`.trim()}
            </Typography>

            <AccessCodeBadge>
              <span>{shareVisit.token}</span>
            </AccessCodeBadge>

            <ShareActions>
              {supportsNativeShare && (
                <ShareBtn
                  type="button"
                  onClick={() =>
                    handleNativeShare(
                      shareVisit.share_message,
                      `Access code for ${
                        shareVisit.visitor.name ||
                        `${shareVisit.visitor.first_name} ${shareVisit.visitor.last_name}`.trim()
                      }`
                    )
                  }
                >
                  <AppIcon render={HiOutlineShare} size={17} />
                  Share
                </ShareBtn>
              )}
              <WhatsAppBtn
                href={shareVisit.whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppIcon render={FaWhatsapp} size={18} />
                WhatsApp
              </WhatsAppBtn>
              <CopyBtn
                type="button"
                copied={resharecopied}
                onClick={() =>
                  handleCopy(shareVisit.share_message, setResharecopied)
                }
              >
                <AppIcon
                  render={resharecopied ? MdCheck : MdContentCopy}
                  size={17}
                />
                {resharecopied ? "Copied!" : "Copy"}
              </CopyBtn>
            </ShareActions>
          </SuccessModalCard>
        )}
      </Modal>
    </DashboardContent>
  );
};

export default VisitorsPage;
