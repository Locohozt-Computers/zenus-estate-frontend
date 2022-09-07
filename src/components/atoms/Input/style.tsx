import styled from "styled-components/macro";
import { pxToEm } from "utils";
import c from "assets/icons/carret-filled.svg";

export const InputWrapper = styled.div<{ suffix?: any; loading?: boolean }>`
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
    cursor: pointer;
    background-image: ${({ loading }) => (loading ? "none" : `url(${c})`)};
    background-repeat: no-repeat;
    background-position: 93.5% 50%;
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

    &:hover :not(:read-only) {
      border: 1px solid var(--light-blue);
    }
    &:focus :not(:read-only) {
      border: 1px solid var(--blue);
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

  pointer-events: ${({ loading }) => loading && "none"};
`;
