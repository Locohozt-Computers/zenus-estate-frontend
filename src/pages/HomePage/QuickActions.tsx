import React, { FC, SVGProps, useState } from "react";
import styled from "styled-components/macro";
import { Typography } from "components/atoms";
import { AppIcon } from "utils";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "app-constants";
import { RiDashboardFill } from "react-icons/ri";
import { FaCoins } from "react-icons/fa";
import { IconType } from "react-icons";
import { MdContactSupport } from "react-icons/md";
import { IconCarEmergency, IconWallet, IconUser } from "assets/icons";

const Wrapper = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
`;

const TabRow = styled.div`
  display: flex;
  background: #f0f4ff;
  border-radius: 30px;
  padding: 4px;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ $active: boolean }>`
  all: unset;
  flex: 1;
  cursor: pointer;
  text-align: center;
  padding: 10px 8px;
  border-radius: 26px;
  background: ${({ $active }) => ($active ? "var(--blue)" : "transparent")};
  transition: background 0.2s ease;
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media screen and (min-width: 600px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const IconBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &:hover .icon-circle {
    background: #dce8ff;
  }
`;

const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
`;

type NavItem = {
  label: string;
  icon: IconType | FC<SVGProps<SVGSVGElement>>;
  route: string;
};

const communityItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: RiDashboardFill,
    route: ROUTES.dashboard.fullPath,
  },
  { label: "My Bills", icon: FaCoins, route: ROUTES.myBills.fullPath },
  {
    label: "My Wallet",
    icon: IconWallet,
    route: ROUTES.myWallet.fullPath,
  },
  {
    label: "Emergency",
    icon: IconCarEmergency,
    route: ROUTES.reportEmergency.fullPath,
  },
];

const forYouItems: NavItem[] = [
  { label: "My Account", icon: IconUser, route: ROUTES.myAccount.fullPath },
  {
    label: "Contact Admin",
    icon: MdContactSupport,
    route: ROUTES.contactAdmin.fullPath,
  },
];

export const QuickActions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"community" | "you">("community");
  const navigate = useNavigate();

  const items = activeTab === "community" ? communityItems : forYouItems;

  return (
    <Wrapper>
      <TabRow>
        <Tab
          $active={activeTab === "community"}
          onClick={() => setActiveTab("community")}
        >
          <Typography
            size={13}
            weight={600}
            style={{
              color: activeTab === "community" ? "white" : "var(--med-gray)",
            }}
          >
            For Your Community
          </Typography>
        </Tab>
        <Tab $active={activeTab === "you"} onClick={() => setActiveTab("you")}>
          <Typography
            size={13}
            weight={600}
            style={{
              color: activeTab === "you" ? "white" : "var(--med-gray)",
            }}
          >
            For You
          </Typography>
        </Tab>
      </TabRow>

      <IconGrid>
        {items.map((item) => (
          <IconBtn key={item.label} onClick={() => navigate(item.route)}>
            <IconCircle className="icon-circle">
              <AppIcon render={item.icon} size={24} color="var(--blue)" />
            </IconCircle>
            <Typography
              size={12}
              style={{ textAlign: "center", color: "var(--dark)" }}
            >
              {item.label}
            </Typography>
          </IconBtn>
        ))}
      </IconGrid>
    </Wrapper>
  );
};
