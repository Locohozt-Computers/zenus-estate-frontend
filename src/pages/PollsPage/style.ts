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

export const PageCard = styled(Card)`
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
  overflow-x: auto;
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
  white-space: nowrap;
`;

export const PollGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media screen and (min-width: ${pxToEm(700)}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const PollCardWrap = styled.div`
  background: white;
  border: 1px solid var(--light-gray);
  border-radius: 12px;
  padding: 18px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow 0.15s, transform 0.15s;

  &:hover {
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
    border-color: var(--blue);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--med-gray);
`;

export const Pill = styled.span<{
  tone?: "info" | "success" | "warn" | "muted";
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.4px;

  background: ${({ tone }) => {
    if (tone === "success") return "#e7f6ec";
    if (tone === "warn") return "#fff4e0";
    if (tone === "muted") return "#ececec";
    return "#eaf2ff";
  }};
  color: ${({ tone }) => {
    if (tone === "success") return "#0a7d27";
    if (tone === "warn") return "#b76d00";
    if (tone === "muted") return "#5a5a5a";
    return "var(--blue)";
  }};
`;

export const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
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

export const PaginationBtn = styled.button`
  background: none;
  border: 1px solid var(--med-gray);
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-size: 13px;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const BackBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--med-gray);
  font-size: 13px;
  padding: 0;
  margin-bottom: 14px;

  &:hover {
    color: var(--blue);
  }
`;

export const PollDescription = styled.p`
  font-size: 14px;
  color: var(--med-gray);
  line-height: 1.55;
  margin: 12px 0 18px;
  white-space: pre-wrap;
`;

export const FieldLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: var(--med-gray);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const OptionRow = styled.label<{
  selected?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  border: ${({ selected }) =>
    selected ? "2px solid var(--blue)" : "1px solid var(--med-gray)"};
  background: ${({ selected }) => (selected ? "#eaf2ff" : "white")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background 0.15s, border-color 0.15s;

  input {
    margin-top: 2px;
    accent-color: var(--blue);
  }

  .label {
    font-size: 14px;
    font-weight: 500;
    color: var(--black);
  }

  .desc {
    font-size: 12px;
    color: var(--med-gray);
    margin-top: 2px;
  }
`;

export const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-top: 22px;
  flex-wrap: wrap;
`;

export const Counter = styled.span`
  font-size: 12px;
  color: var(--med-gray);
`;

export const ErrorText = styled.small`
  display: block;
  color: var(--pink);
  font-size: 12px;
  margin-top: 6px;
`;

export const InfoBanner = styled.div<{ tone?: "info" | "warn" | "error" }>`
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 18px;
  background: ${({ tone }) => {
    if (tone === "warn") return "#fff4e0";
    if (tone === "error") return "#fde7e9";
    return "#eaf2ff";
  }};
  color: ${({ tone }) => {
    if (tone === "warn") return "#7a4a00";
    if (tone === "error") return "#a71b2c";
    return "var(--blue)";
  }};
`;

export const LockedCard = styled.div`
  border: 1px solid var(--light-gray);
  background: #f8faff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SelectedChip = styled.span`
  display: inline-flex;
  align-items: center;
  background: var(--blue);
  color: white;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
`;

export const ResultRow = styled.div<{ winner?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${({ winner }) => (winner ? "#eaf2ff" : "white")};
  border: 1px solid
    ${({ winner }) => (winner ? "var(--blue)" : "var(--light-gray)")};
`;

export const ResultBar = styled.div`
  position: relative;
  background: var(--light-gray);
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
`;

export const ResultBarFill = styled.div<{ pct: number; winner?: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${({ pct }) => `${Math.max(0, Math.min(100, pct))}%`};
  background: ${({ winner }) => (winner ? "var(--blue)" : "var(--light-blue)")};
  border-radius: 999px;
  transition: width 0.4s ease;
`;

export const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
`;

export const TurnoutLine = styled.div`
  margin-top: 16px;
  font-size: 13px;
  color: var(--med-gray);
  text-align: center;
`;

export const HistoryRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid var(--light-gray);
  border-radius: 10px;
  cursor: pointer;
  background: white;
  transition: box-shadow 0.15s;
  margin-bottom: 10px;

  &:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
    border-color: var(--blue);
  }

  @media screen and (min-width: ${pxToEm(640)}) {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
`;

export const PropertySelect = styled.select`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--med-gray);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  outline: none;
  margin-bottom: 18px;

  &:focus {
    border-color: var(--blue);
  }
`;

export const CountdownText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--blue);
`;
