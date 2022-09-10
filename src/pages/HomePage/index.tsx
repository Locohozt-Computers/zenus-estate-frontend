import React from "react";
import { Card } from "components";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { DashboardContent } from "layouts";
import { HomeHeader } from "pages/HomePage/Header";
import { currencyFormat } from "utils/helpers";
import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { PaymentHistory } from "./PaymentHistory";
import { BalanceCard } from "./BalanceCard";

const CardStyling = styled(Card)`
  padding: 0;
`;

const Wrapper = styled.div`
  padding: 10px 8px;

  @media screen and (min-width: ${pxToEm(1200, false)}) {
    padding: 20px 40px;
  } ;
`;

const AccountList = styled.div`
  display: flex;
  gap: 20px;
  overflow: auto;
  margin-bottom: 10px;
  padding: 20px 5px;
`;

const HomePage = () => {
  const { isLoading, data } = useQuery(["getDashboard"], getDashboard);

  return (
    <>
      <HomeHeader />
      <DashboardContent>
        <Loader absolute open={isLoading} />
        <CardStyling>
          <Wrapper>
            <AccountList>
              {data?.balances.map((t) => (
                <BalanceCard
                  name={t.special_name}
                  amount={currencyFormat(t.user_levy_outstanding_balance)}
                />
              ))}
            </AccountList>
          </Wrapper>
          <div>
            <PaymentHistory />
          </div>
        </CardStyling>
      </DashboardContent>
    </>
  );
};

export default HomePage;
