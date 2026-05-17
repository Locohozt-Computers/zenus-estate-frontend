import React, { useState } from "react";
import styled from "styled-components/macro";
import { Typography } from "components/atoms";
import { AppIcon } from "utils";
import { currencyFormat } from "utils/helpers";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import { HiOutlineCreditCard } from "react-icons/hi";
import { RiArrowUpCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "app-constants";

const Card = styled.div`
  background: linear-gradient(135deg, #003085 0%, #0050d8 100%);
  border-radius: 20px;
  padding: 28px 24px 20px;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -40px;
    right: -40px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -60px;
    left: 30px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const RefreshBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 14px;
  border-radius: 20px;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const BalanceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
`;

const SubRow = styled.div`
  display: flex;
  gap: 28px;
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
`;

const SubItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
`;

const ActionBtn = styled.button<{ $outline?: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 10px;
  border-radius: 12px;
  background: ${({ $outline }) =>
    $outline ? "transparent" : "rgba(255,255,255,0.18)"};
  border: ${({ $outline }) =>
    $outline ? "1.5px solid rgba(255,255,255,0.4)" : "none"};
  transition: background 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }
`;

const ToggleBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

interface WalletBalanceCardProps {
  balance: number;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  onRefresh,
  isRefreshing,
}) => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  return (
    <Card>
      <TopRow>
        <RefreshBtn onClick={onRefresh}>
          <AppIcon
            render={MdRefresh}
            size={16}
            color="white"
            style={{
              animation: isRefreshing ? "spin 0.8s linear infinite" : "none",
            }}
          />
          <Typography size={13} style={{ color: "white" }}>
            Refresh
          </Typography>
        </RefreshBtn>
        <Typography size={14} style={{ color: "rgba(255,255,255,0.7)" }}>
          Wallet Balance
        </Typography>
      </TopRow>

      <BalanceRow>
        <Typography
          variant="heading3"
          style={{
            color: "white",
            fontSize: "clamp(28px, 5vw, 36px)",
            letterSpacing: "-0.5px",
          }}
        >
          {visible ? currencyFormat(balance) : "₦ ••••••"}
        </Typography>
        <ToggleBtn onClick={() => setVisible(!visible)}>
          <AppIcon
            render={visible ? AiFillEyeInvisible : AiFillEye}
            size={20}
            color="white"
          />
        </ToggleBtn>
      </BalanceRow>

      <SubRow>
        <SubItem>
          <Typography size={11} style={{ color: "rgba(255,255,255,0.6)" }}>
            Available
          </Typography>
          <Typography size={14} weight={600} style={{ color: "white" }}>
            {visible ? currencyFormat(balance) : "₦ ••••"}
          </Typography>
        </SubItem>
        <SubItem>
          <Typography size={11} style={{ color: "rgba(255,255,255,0.6)" }}>
            Pending
          </Typography>
          <Typography size={14} weight={600} style={{ color: "white" }}>
            {visible ? currencyFormat(0) : "₦ ••••"}
          </Typography>
        </SubItem>
      </SubRow>

      <ActionRow>
        <ActionBtn onClick={() => navigate(ROUTES.myBills.fullPath)}>
          <AppIcon render={HiOutlineCreditCard} size={17} color="white" />
          <Typography size={13} style={{ color: "white" }}>
            Pending Charges
          </Typography>
        </ActionBtn>
        <ActionBtn $outline onClick={() => navigate(ROUTES.myWallet.fullPath)}>
          <AppIcon render={RiArrowUpCircleLine} size={17} color="white" />
          <Typography size={13} style={{ color: "white" }}>
            Top Up Wallet
          </Typography>
        </ActionBtn>
      </ActionRow>
    </Card>
  );
};
