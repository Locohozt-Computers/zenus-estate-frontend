import styled from "styled-components/macro";
import { pxToEm } from "utils";

export const SheetBackdrop = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  opacity: ${({ open }) => (open ? 1 : 0)};
  pointer-events: ${({ open }) => (open ? "auto" : "none")};
  transition: opacity 0.22s ease;
  z-index: 250;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (min-width: ${pxToEm(768)}) {
    align-items: center;
    padding: 24px;
  }
`;

export const Sheet = styled.div<{ open: boolean; maxWidth?: number }>`
  position: relative;
  background: white;
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 20px 20px 0 0;
  padding: 8px 20px 24px;
  box-sizing: border-box;
  box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.18);
  transform: translateY(${({ open }) => (open ? "0" : "100%")});
  transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1);
  -webkit-overflow-scrolling: touch;

  @media (min-width: ${pxToEm(768)}) {
    max-width: ${({ maxWidth }) => pxToEm(maxWidth || 560)};
    border-radius: 16px;
    padding: 24px 28px 28px;
    transform: ${({ open }) =>
      open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)"};
    opacity: ${({ open }) => (open ? 1 : 0)};
    transition: transform 0.22s ease, opacity 0.22s ease;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);
  }
`;

export const SheetHandle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: #d1d5db;
  margin: 8px auto 14px;

  @media (min-width: ${pxToEm(768)}) {
    display: none;
  }
`;

export const SheetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 16px;
`;

export const SheetTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
`;

export const SheetClose = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  min-width: 34px;
  border-radius: 50%;
  background: #f3f4f6;
  color: #374151;
  transition: background 0.15s;

  &:hover {
    background: #e5e7eb;
  }
`;

export const SheetBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
