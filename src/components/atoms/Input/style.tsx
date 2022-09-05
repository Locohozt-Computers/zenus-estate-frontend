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
  select.input-input {
    background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position: 98% 50%;
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
    appearance: none;

    &:hover {
      border: 1px solid var(--light-blue);
    }
    &:focus {
      border: 1px solid var(--blue);
    }
    &:read-only:focus,
    &:read-only:hover {
      border: none;
    }
  }

  ::placeholder {
    font-weight: 500;
    font-size: 17px;
    color: var(--med-gray);
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
