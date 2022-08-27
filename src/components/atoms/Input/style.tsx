import styled from "styled-components/macro";
import { pxToEm } from "utils";

export const InputWrapper = styled.div`
  position: relative;
  span.input-label {
    display: block;
    font-weight: 500;
    font-size: ${pxToEm(17)};
  }

  input {
  }
`;
