import React from "react";
import styled from "styled-components/macro";
import { Typography } from "components/atoms/Typography";

const LoaderIconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;

  > div {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: var(--blue);
    animation: tween-color 0.5s infinite;
    animation-direction: alternate;
  }

  & > div:nth-child(2) {
    background-color: var(--pink);
    animation-name: single-color;
  }

  @keyframes tween-color {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes single-color {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const LoaderIcon = () => {
  return (
    <LoaderIconWrapper>
      <div />
      <div />
      <div />
    </LoaderIconWrapper>
  );
};

const LoaderWrapper = styled.div<{ absolute?: boolean }>`
  z-index: 9000;
  position: ${({ absolute }) => (absolute ? "absolute" : "fixed")};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f752;
  width: 100%;
  height: 100%;
`;

export const Loader = ({
  absolute,
  open,
}: {
  absolute?: boolean;
  open: boolean;
}) => {
  return open ? (
    <LoaderWrapper absolute={absolute}>
      <LoaderIcon />
    </LoaderWrapper>
  ) : null;
};

const PageLoadStyle = styled.div`
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  z-index: 1000;

  > div:first-child {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export const PageLoad = () => {
  return (
    <PageLoadStyle>
      <div>
        <img
          src="/apple-touch-icon.png"
          style={{ width: 47, height: 47 }}
          alt="zenus estate"
        />
        <Typography textColor="blue" size={42} weight={600}>
          ZENUS FINANCIALS
        </Typography>
      </div>
      <LoaderIcon />
    </PageLoadStyle>
  );
};
