import React from "react";
import { Typography } from "components/atoms";
import styled from "styled-components/macro";

const navSection1 = [
  "home",
  "report emergency",
  "home",
  "report emergency",
  "home",
  "report emergency",
  "home",
  "report emergency",
];
const navSection2 = [
  "my account",
  "contact admin",
  "my account",
  "contact admin",
  "my account",
  "contact admin",
  "my account",
  "contact admin",
];

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
`;

const Logo = styled.div`
  padding: 50px 10px 38px;
  border-bottom: 1px solid var(--gray-2);
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

const Nav = styled.nav`
  > ul {
    overflow-y: auto;
    height: calc(100vh - 180px);
  }
`;

const Hr = styled.div`
  background-color: var(--gray-2);
  height: 1px;
  margin: 10px 0;
`;

export const Sidebar = () => {
  return (
    <Container>
      <Logo>
        <img
          src="/apple-touch-icon.png"
          style={{ width: 36, height: 36 }}
          alt="zenus estate"
        />
        <Typography textColor="blue" size={33.14} weight={600}>
          ZENUS
        </Typography>
      </Logo>
      <Nav>
        <ul>
          {navSection1.map(() => (
            <li>x</li>
          ))}
          <Hr />
          {navSection2.map(() => (
            <li>x</li>
          ))}
          <li>logout</li>
        </ul>
      </Nav>
    </Container>
  );
};
