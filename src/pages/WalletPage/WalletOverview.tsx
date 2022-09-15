import React, { useState } from "react";
import styled from "styled-components";
import Arrow from "assets/images/arrowright.png";
import Balanceimg from "assets/images/balanceimg.png";
import { Button, Select, Typography } from "components";
import { WalletCard } from "components/molecules/WalletCard";
import { pxToEm } from "utils";
import { useQuery } from "@tanstack/react-query";
import { getWalletTransactions, getUserProfile } from "pages/request";

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
  const { data: transactions } = useQuery(
    ["getWalletTransactions"],
    getWalletTransactions
  );
  const { data: walletBalance } = useQuery(["getUserProfile"], getUserProfile);
  const [filter, setFilter] = useState("");
  let firstTransactionPage = transactions;
  if (filter === "") {
    firstTransactionPage = transactions;
  } else if (filter === "Credit") {
    firstTransactionPage = transactions?.filter((item) => {
      return item.amount > 0;
    });
  } else {
    firstTransactionPage = transactions?.filter((item) => {
      return item.amount < 0;
    });
  }
  type Item = {
    amount: number;
    reference: string;
    created_at: string;
    transaction_source: {
      name: string;
    };
  };
  return (
    <StyledDiv>
      <span className="arrow-icon">
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          style={{ display: page < 1 ? "none" : "block" }}
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
        <div className="wallet-balance">
          <Typography
            content="Your balance"
            variant="subtitle"
            textColor="med-gray"
          />
          <Typography
            content={`₦ ${
              walletBalance?.walletBalance.toLocaleString() || "0"
            }`}
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
            onClick={() => {
              setPage(page + 1);
            }}
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
          options={["Credit", "Debit"]}
          value={filter}
          onChange={(event) => {
            setFilter(event?.target.value);
          }}
          placeholder="Payment history"
          style={{
            backgroundColor: "#FEFBFE",
            borderRadius: "10px",
            color: "var(--blue)",
            fontSize: `${pxToEm(17)}`,
          }}
        >
          <Typography
            content="filter"
            variant="subtitle"
            textColor="blue"
            style={{ position: "absolute", right: `${pxToEm(16)}`, top: "50%" }}
          />
        </Select>

        <div
          className="wallet-transaction"
          style={{ overflow: "scroll", height: "40%" }}
        >
          {firstTransactionPage?.map((item: Item) => {
            return (
              <WalletCard
                action={item.transaction_source.name}
                id={item.reference}
                amount={item.amount}
                date={item.created_at}
              />
            );
          })}
        </div>
      </div>
    </StyledDiv>
  );
};
