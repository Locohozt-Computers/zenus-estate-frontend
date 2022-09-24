import styled from "styled-components";
import { pxToEm } from "utils";

export const UlStyle = styled.ul`
  list-style: none;

  > li {
    padding: 10px 15px;

    :hover {
      color: white;
      cursor: pointer;
      background-color: var(--blue);
    }
  }

  @media screen and (min-width: ${pxToEm(900, false)}) {
    white-space: nowrap;
  }
`;
