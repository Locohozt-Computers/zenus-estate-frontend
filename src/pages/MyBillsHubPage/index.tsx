import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { DashboardContent } from "layouts";
import { ROUTES } from "app-constants";
import { pxToEm } from "utils";
import {
  MdPayment,
  MdPeople,
  MdReceiptLong,
  MdHistory,
  MdArrowBack,
} from "react-icons/md";

const PageWrapper = styled.div`
  padding: 24px 0;
`;

const BackButton = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--blue);
  font-family: "Montserrat", sans-serif;
  margin-bottom: 20px;

  &:hover {
    opacity: 0.75;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.2rem, 4vw, 1.6rem);
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 8px;
  font-family: "Montserrat", sans-serif;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 32px;
  font-family: "Montserrat", sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media screen and (min-width: ${pxToEm(700, false)}) {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
`;

const ActionCard = styled.button`
  all: unset;
  cursor: pointer;
  background: white;
  border-radius: 16px;
  padding: 28px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  transition: transform 0.15s, box-shadow 0.15s;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const IconCircle = styled.div<{ color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  font-family: "Montserrat", sans-serif;
  line-height: 1.3;
`;

const actions = [
  {
    label: "Pay Utilities",
    icon: MdPayment,
    color: "#FFF3CD",
    iconColor: "#F59E0B",
    route: ROUTES.utilities.fullPath,
  },
  {
    label: "Pay Community Dues",
    icon: MdPeople,
    color: "#D1FAE5",
    iconColor: "#059669",
    route: ROUTES.communityDues.fullPath,
  },
  {
    label: "Generate Statement",
    icon: MdReceiptLong,
    color: "#DBEAFE",
    iconColor: "#2563EB",
    route: ROUTES.accountStatements.fullPath,
  },
  {
    label: "Payment Transactions",
    icon: MdHistory,
    color: "#EDE9FE",
    iconColor: "#7C3AED",
    route: ROUTES.accountStatements.fullPath,
  },
];

const MyBillsHubPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardContent>
      <PageWrapper>
        <BackButton onClick={() => navigate(-1)}>
          <MdArrowBack size={18} />
          Back
        </BackButton>
        <Title>My Bills</Title>
        <Subtitle>Manage your payments and financial activities</Subtitle>
        <Grid>
          {actions.map(({ label, icon: Icon, color, iconColor, route }) => (
            <ActionCard key={label} onClick={() => navigate(route)}>
              <IconCircle color={color}>
                <Icon size={26} color={iconColor} />
              </IconCircle>
              <CardLabel>{label}</CardLabel>
            </ActionCard>
          ))}
        </Grid>
      </PageWrapper>
    </DashboardContent>
  );
};

export default MyBillsHubPage;
