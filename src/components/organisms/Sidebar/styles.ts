import styled from "styled-components/macro";
import { pxToEm } from "utils";

export const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
`;

export const Logo = styled.div<{ open?: boolean }>`
  padding: 50px 10px 38px;
  border-bottom: 1px solid var(--gray-2);
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;

  > p {
    display: ${({ open }) => (open ? "block" : "none")};

    @media screen and (min-width: 900px) {
      display: block;
    }
  }
`;

export const Nav = styled.nav`
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 180px);
`;

export const Hr = styled.div`
  background-color: var(--gray-2);
  height: 1px;
  margin: 10px 0;
`;

export const Li = styled.li<{ open?: boolean }>`
  display: block;

  .link {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    padding: 8px ${({ open }) => (open ? "25px" : "30px")};
    margin: 23px 0;

    @media screen and (min-width: 900px) {
      padding: 8px 30px;
    }
  }

  .active {
    background-color: var(--blue);
    color: white;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`;

export const NavContent = styled.span<{ open: boolean }>`
  display: flex;
  gap: 10px;

  .label {
    white-space: nowrap;
    display: ${({ open }) => (open ? "block" : "none")};

    @media screen and (min-width: 900px) {
      display: block;
    }
  }
`;

export const Drop = styled.div`
  padding: 0 calc(30px + 23px + 10px);

  > a {
    margin-bottom: 23px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .active {
    background: none;
    color: var(--blue);
  }
`;

export const LogoutBtn = styled.button<{ open: boolean }>`
  display: flex;
  justify-content: flex-start !important;
  align-items: center;
  all: unset;
  width: 100%;
  cursor: pointer;

  > span:last-child {
    display: ${({ open }) => (open ? "flex" : "none")};

    @media screen and (min-width: 900px) {
      display: inline;
    }
  }
`;

export const LogoutBtnActions = styled.div`
  margin-top: 50px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 15px;

  @media screen and (min-width: ${pxToEm(600)}) {
    margin-top: 70px;
    flex-direction: row;
  }
`;
