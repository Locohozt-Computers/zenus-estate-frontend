import React, { useState } from "react";
import styled from "styled-components";
import Arrow from "assets/images/arrowright.png";
import Balanceimg from "assets/images/balanceimg.png";
import { Typography, Button, Select } from "components";
import { WalletCard } from "components/molecules/WalletCard";
import { pxToEm } from "utils";

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 0 auto;

  .wallet-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    flex-direction: column;
  }
  .wallet-balance {
    display: flex;
    height: 10rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: url(${Balanceimg}) no-repeat center;
    background-size: cover;
  }
  .wallet-select {
    background: #ffffff;
    border-radius: 16px;
  }
  .wallet-buttons {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
  }
`;
type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};
export const WalletOverview = ({ page, setPage }: Props) => {
  const balance = 400000;
  return (
    <StyledDiv>
      <span className="arrow-icon">
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          style={{ visibility: page < 1 ? "hidden" : "visible" }}
        >
          <img src={Arrow} alt="arrow" style={{ margin: " 0 12px 0 -1rem" }} />
        </button>
      </span>
      <div className="wallet-content">
        <span className="arrow-icon">
          <Typography
            size={16}
            weight={500}
            textColor="med-gray"
            content="My Wallet"
          />
        </span>
        <div
          className="wallet-balance"
          // style={{ backgroundImage: `url(${Balanceimg})` }}
        >
          <Typography
            content="Your balance"
            variant="subtitle"
            textColor="med-gray"
          />
          <Typography
            content={`${balance}`}
            size={39}
            weight={500}
            textColor="blue"
          />
        </div>
        <div className="wallet-buttons">
          <Button
            text="Withdraw"
            style={{ padding: ` ${pxToEm(18)} ${pxToEm(70)}` }}
            color="blue"
            secondary
          />
          <Button
            text="Fund Wallet"
            style={{
              padding: `${pxToEm(18)}  ${pxToEm(70)}`,
            }}
          />
        </div>
        <Select
          name="history"
          options={["a", "b"]}
          placeholder="Payment history"
          style={{
            backgroundColor: "#FEFBFE",
            borderRadius: "10px",
            color: "var(--blue)",
          }}
        />
        <div className="wallet-transaction">
          <WalletCard action="Account Topup" id={12} amount="5000" date={44} />
        </div>
      </div>
    </StyledDiv>
  );
};
