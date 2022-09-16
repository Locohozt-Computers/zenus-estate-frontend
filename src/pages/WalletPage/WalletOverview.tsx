import React, { useState } from "react";
import styled from "styled-components";
import Balanceimg from "assets/images/balanceimg.png";
import { Button, Card, TFilter, Typography } from "components";
import { WalletCard } from "components/molecules/WalletCard";
import { pxToEm } from "utils";
import { useQuery } from "@tanstack/react-query";
import { getWalletTransactions, getUserProfile } from "pages/request";
import { currencyFormat } from "utils/helpers";
import { Loader } from "components/atoms/Loader";
import { PropsI } from "pages/WalletPage/types";
import { TransactionTypeEnum } from "api";

const StyledDiv = styled.div``;

const PaymentHistory = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 30px;
  background-color: #fefbfe;
  margin-bottom: 20px;
`;

const TransactionList = styled.div`
  max-height: 400px;
  overflow: auto;
  display: grid;
  gap: 10px;
  padding: 10px;
`;

const UlStyle = styled.ul`
  list-style: none;
  white-space: nowrap;
  > li {
    padding: 10px 15px;
    :hover {
      color: white;
      cursor: pointer;
      background-color: var(--blue);
    }
  }
`;

const filterOptions = [
  { label: "All", value: "null" },
  { label: "Credit", value: TransactionTypeEnum.Credit },
  { label: "Debit", value: TransactionTypeEnum.Debit },
];

export const WalletOverview = ({ page, setPage }: PropsI) => {
  const { data: transactions, isLoading: transactionsLoading } = useQuery(
    ["getWalletTransactions"],
    getWalletTransactions
  );
  const { data: profile, isLoading: profileLoading } = useQuery(
    ["getUserProfile"],
    getUserProfile
  );

  return (
    <StyledDiv>
      <Card
        className="center-contents text-center direction-column"
        style={{
          background: `url(${Balanceimg})`,
          height: 243,
          marginBottom: 65,
        }}
      >
        <Typography
          variant="subtitle"
          textColor="med-gray"
          content="Your Balance"
        />
        <Typography
          size={39}
          weight={500}
          textColor="blue"
          content={currencyFormat(profile?.walletBalance || 0)}
        />
      </Card>
      <div
        className="center-contents space-between"
        style={{ marginBottom: 40, gap: 15 }}
      >
        <Button
          text="Withdraw"
          style={{ width: "100%" }}
          color="blue"
          secondary
          onClick={() => {
            setPage(page + 1);
          }}
        />
        <Button text="Fund Wallet" style={{ width: "100%" }} />
      </div>
      <PaymentHistory>
        <Typography textColor="blue" content="Payment History" />
        <div>
          <TFilter
            active
            renderSetVisible={({ setVisible }) => setVisible(false)}
          >
            <UlStyle onClick={() => {}}>
              {filterOptions.map(({ label, value }) => (
                <li id={value}>{label}</li>
              ))}
            </UlStyle>
          </TFilter>
        </div>
      </PaymentHistory>
      <TransactionList>
        {transactions?.map((item) => (
          <WalletCard
            action={item.transaction_type.name}
            name={item.transaction_source.name}
            id={item.reference}
            amount={item.amount}
            date={item.created_at}
          />
        ))}
      </TransactionList>
      <Loader open={profileLoading || transactionsLoading} />
    </StyledDiv>
  );
};
