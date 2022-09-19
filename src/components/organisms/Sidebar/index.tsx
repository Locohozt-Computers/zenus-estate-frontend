import React, { FC, SVGProps, useState } from "react";
import { Button, Card, Modal, Typography } from "components/atoms";
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
  IconWallet,
} from "assets/icons";
import { AiFillPrinter, AiFillQuestionCircle } from "react-icons/ai";
import { useQueryClient } from "@tanstack/react-query";
import {
  Container,
  Drop,
  Hr,
  Li,
  Logo,
  LogoutBtn,
  LogoutBtnActions,
  Nav,
  NavContent,
} from "./styles";

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
  { label: "My Wallet", icon: IconWallet, route: ROUTES.myWallet.fullPath },
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

if (process.env.NODE_ENV === "development") {
  navSection2.push({
    label: "PlayGround",
    icon: IconUser,
    route: ROUTES.playground.path,
  });
}

const NavBtn = ({
  label,
  icon,
  route,
  drop,
  open,
}: NavType[0] & { open: boolean }) => {
  const [show, setShow] = useState(false);

  return (
    <Li>
      <NavLink
        to={route}
        className={({ isActive }) => (isActive ? "active link" : "link")}
      >
        {({ isActive }) => (
          <>
            <NavContent open={open}>
              <span>
                <AppIcon
                  render={icon}
                  style={{
                    fontSize: 23,
                    color: isActive ? "white" : "var(--med-gray)",
                  }}
                />
              </span>
              <Typography className="label">{label}</Typography>
            </NavContent>
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

export const Sidebar = ({ open }: { open: boolean }) => {
  const [visible, setVisible] = useState(false);
  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(authActions.logoutUser());
    queryClient.clear();
  };

  return (
    <Container>
      <Logo open={open}>
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
            <NavBtn open={open} key={values.label} {...values} />
          ))}
        </ul>
        <Hr />
        <ul>
          {navSection2.map((values) => (
            <NavBtn open={open} key={values.label} {...values} />
          ))}
          <Li open={open}>
            <LogoutBtn
              type="button"
              className="link"
              onClick={() => setVisible(!visible)}
              open={open}
            >
              <span>
                <AppIcon size={23} render={RiLogoutCircleFill} />
              </span>
              <span>logout</span>
            </LogoutBtn>
          </Li>
        </ul>
      </Nav>
      <Modal visible={visible} maxWidth={620} showCloseBtn={false}>
        <Card style={{ padding: "50px 70px" }}>
          <Typography
            variant="heading4"
            content="Are you sure you want to log out?"
            style={{ textAlign: "center" }}
          />
          <LogoutBtnActions>
            <Button secondary text="Cancel" onClick={() => setVisible(false)} />
            <Button text="Logout" onClick={logoutUser} />
          </LogoutBtnActions>
        </Card>
      </Modal>
    </Container>
  );
};
