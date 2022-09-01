import React, { FC, SVGProps, useState } from "react";
import { Typography } from "components/atoms";
import { NavLink } from "react-router-dom";
import { ROUTES } from "app-constants";
import { useDispatch } from "react-redux";
import { authActions } from "store/reducers/auth/authDocSlice";
import { RiDashboardFill, RiLogoutCircleFill } from "react-icons/ri";
import { AppIcon } from "utils";
import { IconType } from "react-icons";
import { FaCoins } from "react-icons/fa";
import {
  IconCarEmergency,
  IconCaretDown,
  IconUser,
  IconUserQuestion,
  IoWallet,
} from "assets/icons";
import { AiFillPrinter, AiFillQuestionCircle } from "react-icons/ai";
import { Container, Drop, Hr, Li, Logo, LogoutBtn, Nav } from "./styles";

type NavType = Array<{
  label: string;
  icon: IconType | FC<SVGProps<SVGSVGElement>>;
  route: string;
  drop?: Array<{ label: string; route: string }>;
}>;

const navSection1: NavType = [
  { label: "Home", icon: RiDashboardFill, route: ROUTES.home.fullPath },
  {
    label: "Report Emergency",
    icon: IconCarEmergency,
    route: ROUTES.reportEmergency.fullPath,
  },
  {
    label: "My Bills",
    icon: FaCoins,
    route: ROUTES.myBills.fullPath,
    drop: [
      {
        label: "Instant Payment",
        route: ROUTES.instantPay.fullPath,
      },
      {
        label: "Account Statements",
        route: ROUTES.accountStatements.fullPath,
      },
    ],
  },
  { label: "My Wallet", icon: IoWallet, route: ROUTES.myWallet.fullPath },
];

const navSection2: NavType = [
  { label: "My Account", icon: IconUser, route: ROUTES.myAccount.fullPath },
  {
    label: "Contact Admin",
    icon: AiFillQuestionCircle,
    route: ROUTES.contactAdmin.fullPath,
  },
  {
    label: "Estate Banks",
    icon: IconUserQuestion,
    route: ROUTES.estateBanks.fullPath,
  },
  {
    label: "Print Receipts",
    icon: AiFillPrinter,
    route: ROUTES.printReceipt.fullPath,
  },
];

const NavBtn = ({ label, icon, route, drop }: NavType[0]) => {
  const [show, setShow] = useState(false);

  return (
    <Li>
      <NavLink
        to={route}
        className={({ isActive }) => (isActive ? "active link" : "link")}
      >
        {({ isActive }) => (
          <>
            <span style={{ display: "flex", gap: 10 }}>
              <span>
                <AppIcon
                  render={icon}
                  style={{
                    fontSize: 23,
                    color: isActive ? "white" : "var(--med-gray)",
                  }}
                />
              </span>
              <Typography>{label}</Typography>
            </span>
            {drop && !!drop.length && (
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 4px 4px 10px",
                }}
                type="button"
                onClick={(e) => {
                  setShow(!show);
                  e.preventDefault();
                }}
              >
                <AppIcon
                  render={IconCaretDown}
                  style={{
                    color: isActive ? "white" : "var(--med-gray)",
                    transform: `rotate(${!show ? -90 : 0}deg)`,
                    transition: "all 0.5s",
                  }}
                />
              </button>
            )}
          </>
        )}
      </NavLink>
      {show && drop && !!drop.length && (
        <Drop>
          {drop.map(({ label: l, route: r }) => (
            <NavLink style={{ display: "block" }} to={r}>
              <Typography size={14}>{l}</Typography>
            </NavLink>
          ))}
        </Drop>
      )}
    </Li>
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
          <Li>
            <LogoutBtn
              type="button"
              className="link"
              onClick={() => dispatch(authActions.logoutUser())}
            >
              <span>
                <AppIcon size={23} render={RiLogoutCircleFill} />
              </span>
              <span>logout</span>
            </LogoutBtn>
          </Li>
        </ul>
      </Nav>
    </Container>
  );
};
