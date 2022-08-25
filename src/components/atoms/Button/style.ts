import styled from "styled-components/macro";

export const ButtonWrapper = styled.button<{ btnDisable: boolean }>`
  position: relative;
  pointer-events: ${({ btnDisable }) => (btnDisable ? "none" : "auto")};
`;

export const ButtonLoader = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
