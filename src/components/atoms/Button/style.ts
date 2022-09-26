import styled, { css } from "styled-components/macro";
import { pxToEm } from "utils";

export const ButtonWrapper = styled.button<{
  btnDisable: boolean;
  secondary?: boolean;
  size?: string;
  disabled?: boolean;
}>`
  all: unset;
  cursor: pointer;
  position: relative;
  pointer-events: ${({ btnDisable }) => (btnDisable ? "none" : "auto")};
  padding: ${pxToEm(14)} ${pxToEm(82)};
  text-transform: capitalize;
  text-align: center;
  font-size: clamp(${pxToEm(15)}, 4vw, ${pxToEm(20)});
  font-weight: 500;
  background-color: var(--blue);
  border-radius: 29px;
  font-family: "Montserrat", sans-serif;
  color: white;

  ${({ secondary }) =>
    secondary &&
    css`
      background-color: white;
      border: 1px solid var(--blue);
      color: var(--blue);
    `};

  &:active {
    transform: scale(0.98);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `};

  @media screen and (min-width: ${pxToEm(900, false)}) {
    padding: ${pxToEm(14)} ${pxToEm(30)};
  }
`;

export const ButtonLoader = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
`;
