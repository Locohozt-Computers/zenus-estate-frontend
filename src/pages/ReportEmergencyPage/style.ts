import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { Card } from "components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 40px);
`;

export const GoBack = styled.button`
  margin-bottom: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background: none;
  border: none;
  cursor: pointer;
`;

export const Selections = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  margin-top: 30px;
  gap: 20px;

  @media screen and (min-width: 900px) {
    flex-direction: row;
  }
`;

export const ButtonStyle = styled.button<{ active?: boolean }>`
  background-color: white;
  cursor: pointer;
  width: 100%;
  height: 80px;
  padding: 5px;
  border-radius: 8px;
  border: ${({ active }) =>
    active ? "2px solid var(--blue)" : "1px solid var(--med-gray)"};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 23px;

  @media screen and (min-width: ${pxToEm(900)}) {
    width: min(34% - 15px, 189px);
    flex-direction: column;
    height: 156px;
  }
`;

export const DivContent = styled(Card)`
  padding: 56px 96px;
  max-width: 804px;
  max-height: 757px;
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: auto auto 1fr auto;

  @media screen and (min-width: ${pxToEm(900)}) {
    padding: 56px 96px;
  }
`;
