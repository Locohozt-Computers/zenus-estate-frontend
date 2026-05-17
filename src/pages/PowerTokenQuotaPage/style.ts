import styled from "styled-components";
import { pxToEm } from "utils";

export const PageWrapper = styled.div`
  padding: 24px 0;
`;

export const BackButton = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--blue);
  font-family: "Montserrat", sans-serif;
  margin-bottom: 20px;

  &:hover {
    opacity: 0.75;
  }
`;

export const Title = styled.h1`
  font-size: clamp(1.2rem, 4vw, 1.6rem);
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 4px;
  font-family: "Montserrat", sans-serif;
`;

export const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #555;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 20px;
`;

export const TabBar = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
  overflow-x: auto;
`;

export const TabBtn = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  padding: 12px 18px;
  font-size: 0.9rem;
  font-weight: ${({ active }) => (active ? 600 : 500)};
  color: ${({ active }) => (active ? "var(--blue)" : "#6b7280")};
  cursor: pointer;
  border-bottom: 3px solid
    ${({ active }) => (active ? "var(--blue)" : "transparent")};
  margin-bottom: -1px;
  font-family: "Montserrat", sans-serif;
  white-space: nowrap;
  transition: color 0.15s;
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 12px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  &:last-child {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  font-size: 0.85rem;
  color: #555;
  font-family: "Montserrat", sans-serif;
`;

export const Value = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  font-family: "Montserrat", sans-serif;
  word-break: break-all;
  text-align: right;
  margin-left: 12px;
`;

export const Notice = styled.div`
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0 24px;
  font-size: 0.85rem;
  color: #78350f;
  font-family: "Montserrat", sans-serif;
  line-height: 1.5;

  strong {
    font-weight: 700;
  }
`;

export const OkButton = styled.button`
  all: unset;
  display: block;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  background: var(--blue);
  color: white;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
  padding: 14px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }

  @media screen and (min-width: ${pxToEm(700, false)}) {
    width: auto;
    min-width: 220px;
    margin: 0 auto;
    padding: 12px 32px;
  }
`;

export const Message = styled.p`
  text-align: center;
  color: #666;
  font-family: "Montserrat", sans-serif;
  margin-top: 40px;

  @media screen and (min-width: ${pxToEm(700, false)}) {
    font-size: 1rem;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 16px;
`;

export const FilterLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #4b5563;
  font-family: "Montserrat", sans-serif;
`;

export const Select = styled.select`
  padding: 8px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 0.85rem;
  font-family: "Montserrat", sans-serif;
  color: #1f2937;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: var(--blue);
  }
`;

export const PurchaseCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PurchaseTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
`;

export const PurchaseAmount = styled.p`
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--blue);
  font-family: "Montserrat", sans-serif;
`;

export const PurchaseMeta = styled.p`
  font-size: 0.78rem;
  color: #6b7280;
  font-family: "Montserrat", sans-serif;
`;

export const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  text-transform: capitalize;
  background-color: ${({ status }) => {
    if (status === "completed") return "#D1FAE5";
    if (status === "paid_pending_token") return "#FEF3C7";
    if (status === "failed") return "#FEE2E2";
    return "#F3F4F6";
  }};
  color: ${({ status }) => {
    if (status === "completed") return "#059669";
    if (status === "paid_pending_token") return "#D97706";
    if (status === "failed") return "#DC2626";
    return "#6B7280";
  }};
`;

export const PaginationBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #6b7280;
  font-family: "Montserrat", sans-serif;
`;

export const PageButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 8px;
  background: var(--blue);
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  font-family: "Montserrat", sans-serif;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-family: "Montserrat", sans-serif;
`;
