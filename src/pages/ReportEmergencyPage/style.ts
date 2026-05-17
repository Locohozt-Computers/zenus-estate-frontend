import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { Card } from "components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 40px);
  padding: 16px 0;
`;

export const GoBack = styled.button`
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  cursor: pointer;
`;

export const Selections = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 20px;
  gap: 16px;

  @media screen and (min-width: ${pxToEm(700)}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: ${pxToEm(1000)}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ButtonStyle = styled.button<{ active?: boolean; accent?: string }>`
  background-color: white;
  cursor: pointer;
  width: 100%;
  padding: 16px;
  border-radius: 10px;
  border: ${({ active, accent }) =>
    active
      ? `2px solid ${accent || "var(--blue)"}`
      : "1px solid var(--med-gray)"};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 8px;
  min-height: 110px;
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DivContent = styled(Card)`
  padding: 24px;
  max-width: 980px;
  width: 100%;

  @media screen and (min-width: ${pxToEm(900, false)}) {
    padding: 40px 56px;
  }
`;

export const TabBar = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--med-gray);
  margin-bottom: 28px;
`;

export const TabBtn = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: ${({ active }) => (active ? "var(--blue)" : "var(--med-gray)")};
  cursor: pointer;
  border-bottom: 3px solid
    ${({ active }) => (active ? "var(--blue)" : "transparent")};
  margin-bottom: -1px;
  transition: color 0.15s;
`;

export const CategoryHeading = styled.div`
  margin-top: 28px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CategoryPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
  padding: 4px;
  background: #f5f7fb;
  border-radius: 999px;
  width: fit-content;
`;

export const CategoryPill = styled.button<{ active?: boolean }>`
  border: none;
  cursor: pointer;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: ${({ active }) => (active ? 600 : 500)};
  color: ${({ active }) => (active ? "white" : "var(--med-gray)")};
  background: ${({ active }) => (active ? "var(--blue)" : "transparent")};
  transition: all 0.15s;

  &:hover:not(:disabled) {
    color: ${({ active }) => (active ? "white" : "var(--blue)")};
  }
`;

export const HotlineBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #eaf2ff;
  color: var(--blue);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 999px;
`;

export const FormBlock = styled.div`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const LocationStatus = styled.div<{ ok?: boolean }>`
  font-size: 13px;
  color: ${({ ok }) => (ok ? "var(--green)" : "var(--med-gray)")};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--dark-gray);
  cursor: pointer;
`;

export const EmergencyCard = styled(Card)<{ accent?: string }>`
  padding: 16px 20px;
  margin-bottom: 12px;
  border-left: 4px solid ${({ accent }) => accent || "var(--blue)"};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CardHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const StatusBadge = styled.span<{ status: "active" | "resolved" }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${({ status }) => (status === "active" ? "#fde7e9" : "#e7f6ec")};
  color: ${({ status }) =>
    status === "active" ? "var(--pink)" : "var(--green)"};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 3px 10px;
  border-radius: 999px;
`;

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #eef2f7;
  color: var(--med-gray);
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
`;

export const PaginationBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
  font-size: 13px;
  color: var(--med-gray);
`;

export const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const ModalCard = styled(Card)`
  padding: 28px 24px;
  width: 100%;
  box-sizing: border-box;
`;

export const ModalActions = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;

  > button {
    flex: 0 1 auto;
    min-width: 0;
  }
`;
