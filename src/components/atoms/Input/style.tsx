import styled from "styled-components/macro";
import { pxToEm } from "utils";

export const InputWrapper = styled.div<{ suffix?: any }>`
  position: relative;
  width: 100%;

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  span.input-label {
    display: block;
    font-weight: 500;
    font-size: ${pxToEm(17)};
    color: var(--black);
    margin-bottom: ${pxToEm(12)};
  }

  input.input-input,
  select.input-input {
    width: 100%;
    font-size: ${pxToEm(16)};
    padding: ${pxToEm(23)} ${pxToEm(30)};
    border: none;
    background-color: var(--light-gray);
    border-radius: ${pxToEm(34)};
    padding-right: ${({ suffix }) => suffix && pxToEm(60)};

    &:hover {
      border: 1px solid var(--light-blue);
    }
    &:focus {
      border: 1px solid var(--blue);
    }
  }

  button.input-suffix {
    all: unset;
    cursor: pointer;
    position: absolute;
    right: ${pxToEm(25)};
  }

  .input-suffix {
    position: absolute;
    right: ${pxToEm(25)};
  }

  small.input-error {
    margin-top: 5px;
    display: block;
    color: var(--pink);
    font-size: ${pxToEm(14)};
  }
`;
