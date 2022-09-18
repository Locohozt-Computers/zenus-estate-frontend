import React, { useState } from "react";
import styled from "styled-components";
import { DashboardContent } from "layouts";
import { Card, NavigationController } from "components";
import { useQuery } from "@tanstack/react-query";
import { getBankAccounts } from "pages/WalletPage/request";
import { WalletOverview } from "./WalletOverview";
import { AddAccount } from "./AddAccount";
import { WithdrawView } from "./WithdrawView";
import { WithdrawSuccess } from "./WithdrawSuccess";

const StyledDiv = styled(Card)`
  padding: 50px 100px;
  max-width: 824px;
  margin: 0 auto;

  .nav {
    margin-bottom: 30px;
  }
`;

const WalletPage = () => {
  const { data: bankAccounts } = useQuery(["getBankAccounts"], getBankAccounts);

  const [page, setPage] = useState(1);

  return (
    <DashboardContent>
      <StyledDiv>
        <div className="nav">
          <NavigationController
            pages={[
              "My Wallet",
              bankAccounts?.length ? "Withdraw" : undefined,
              "Add New Account",
            ]}
            active={page}
            onPageChange={setPage}
          />
        </div>
        {
          [
            <WalletOverview page={page} setPage={setPage} />,
            !!bankAccounts?.length && (
              <WithdrawView page={page} setPage={setPage} />
            ),
            <AddAccount page={page} setPage={setPage} />,
            <WithdrawSuccess page={page} setPage={setPage} />,
          ].filter(Boolean)[page - 1]
        }
      </StyledDiv>
    </DashboardContent>
  );
};

export default WalletPage;
