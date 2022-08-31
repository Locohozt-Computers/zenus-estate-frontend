import React, { useState } from "react";
import { Typography } from "components/atoms";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";
import { ROUTES } from "app-constants";
import { useDispatch } from "react-redux";
import { authActions } from "store/reducers/auth/authDocSlice";

type NavType = Array<{
  label: string;
  icon: string;
  route: string;
  drop?: Omit<NavType, "drop">;
}>;

const navSection1: NavType = [
  { label: "Home", icon: "", route: ROUTES.home.fullPath },
  {
    label: "Report Emergency",
    icon: "",
    route: ROUTES.reportEmergency.fullPath,
  },
  {
    label: "My Bills",
    icon: "",
    route: ROUTES.myBills.fullPath,
    drop: [
      {
        label: "Instant Payment",
        icon: "",
        route: ROUTES.instantPay.fullPath,
        drop: [],
      },
      {
        label: "Account Statements",
        icon: "",
        route: ROUTES.accountStatements.fullPath,
        drop: [],
      },
    ],
  },
  { label: "My Wallet", icon: "", route: ROUTES.myWallet.fullPath },
];

const navSection2: NavType = [
  { label: "My Account", icon: "", route: ROUTES.myBills.fullPath },
  { label: "Contact Admin", icon: "", route: ROUTES.contactAdmin.fullPath },
  { label: "Estate Banks", icon: "", route: ROUTES.estateBanks.fullPath },
  { label: "Print Receipts", icon: "", route: ROUTES.printReceipt.fullPath },
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
  overflow-y: auto;
  height: calc(100vh - 180px);
  > ul {
  }
`;

const Hr = styled.div`
  background-color: var(--gray-2);
  height: 1px;
  margin: 10px 0;
`;

const NavBtn = ({ label, icon, route, drop }: NavType[0]) => {
  const [show, setShow] = useState(false);

  return (
    <li>
      <NavLink to={route}>
        <span>{icon}</span>
        <span>{label}</span>
        {drop && !!drop.length && (
          <button type="button" onClick={() => setShow(!show)}>
            ^
          </button>
        )}
        {show && drop && !!drop.length && (
          <div>
            {drop.map(({ label: l, route: r }) => (
              <NavLink to={r}>
                <span>{l}</span>
              </NavLink>
            ))}
          </div>
        )}
      </NavLink>
    </li>
  );
};

export const Sidebar = () => {
  const dispatch = useDispatch();

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
          {navSection1.map((values) => (
            <NavBtn {...values} />
          ))}
        </ul>
        <Hr />
        <ul>
          {navSection2.map((values) => (
            <NavBtn {...values} />
          ))}
          <li>
            <button
              type="button"
              onClick={() => dispatch(authActions.logoutUser())}
            >
              logout
            </button>
          </li>
        </ul>
      </Nav>
    </Container>
  );
};
