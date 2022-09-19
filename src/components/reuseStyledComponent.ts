import styled from "styled-components";

export const UlStyle = styled.ul`
  list-style: none;
  white-space: nowrap;

  > li {
    padding: 10px 15px;

    :hover {
      color: white;
      cursor: pointer;
      background-color: var(--blue);
    }
  }
`;
