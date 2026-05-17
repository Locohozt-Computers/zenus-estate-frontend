import React, { useState } from "react";
import styled from "styled-components";
import { MdCheck, MdContentCopy } from "react-icons/md";
import { notification } from "services";

type Size = "sm" | "md";

const Wrapper = styled.button<{ $size: Size; $copied: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  background: ${({ $copied }) => ($copied ? "#dcfce7" : "#eff6ff")};
  border: 1.5px dashed ${({ $copied }) => ($copied ? "#16a34a" : "var(--blue)")};
  border-radius: 10px;
  padding: ${({ $size }) => ($size === "sm" ? "10px 12px" : "14px 16px")};
  font-family: "Montserrat", sans-serif;
  transition: background 0.18s, border-color 0.18s, transform 0.1s;

  &:hover {
    background: ${({ $copied }) => ($copied ? "#dcfce7" : "#e0ecff")};
  }

  &:active {
    transform: scale(0.99);
  }

  &:focus-visible {
    outline: 2px solid var(--blue);
    outline-offset: 2px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const Label = styled.span<{ $size: Size }>`
  font-size: ${({ $size }) => ($size === "sm" ? "0.7rem" : "0.75rem")};
  color: #555;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: 600;
`;

const Hint = styled.span<{ $copied: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ $copied }) => ($copied ? "#16a34a" : "var(--blue)")};
  letter-spacing: 0.02em;
`;

const TokenValue = styled.span<{ $size: Size }>`
  font-size: ${({ $size }) => ($size === "sm" ? "1rem" : "1.25rem")};
  font-weight: 700;
  color: var(--blue);
  letter-spacing: 0.08em;
  word-break: break-all;
  text-align: left;
`;

interface Props {
  token: string;
  label?: string;
  size?: Size;
}

export const CopyableToken = ({
  token,
  label = "Power Token",
  size = "md",
}: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard
      .writeText(token)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        notification.error("Failed to copy token");
      });
  };

  return (
    <Wrapper
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label} to clipboard`}
      $size={size}
      $copied={copied}
    >
      <HeaderRow>
        <Label $size={size}>{label}</Label>
        <Hint $copied={copied}>
          {copied ? (
            <>
              <MdCheck size={14} />
              Copied
            </>
          ) : (
            <>
              <MdContentCopy size={13} />
              Tap to copy
            </>
          )}
        </Hint>
      </HeaderRow>
      <TokenValue $size={size}>{token}</TokenValue>
    </Wrapper>
  );
};
