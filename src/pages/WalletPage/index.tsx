import React, { useState } from "react";
import styled from "styled-components";
import { DashboardContent } from "layouts";
import { Card, NavigationController } from "components";
import { useQuery } from "@tanstack/react-query";
import { getBankAccounts } from "pages/WalletPage/request";
import { pxToEm } from "utils";
import { WalletOverview } from "./WalletOverview";
import { AddAccount } from "./AddAccount";
import { WithdrawView } from "./WithdrawView";
import { WithdrawSuccess } from "./WithdrawSuccess";

const StyledDiv = styled(Card)`
  max-width: 824px;
  margin: 0 auto;

  .nav {
    margin-bottom: 30px;
  }

  padding: 16px;

  @media screen and (min-width: ${pxToEm(900, false)}) {
    padding: 59px 80px;
  }
`;

const WalletPage = () => {
  const { data: bankAccounts } = useQuery(
    [getBankAccounts.key],
    getBankAccounts
  );

  const [page, setPage] = useState(1);

  const handleSetPage = (p: number) => {
    if (page > 2) {
      setPage(1);
    } else setPage(p);
  };

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
            onPageChange={handleSetPage}
          />
        </div>
        {
          [
            <WalletOverview page={page} setPage={setPage} />,
            !!bankAccounts?.length && (
              <WithdrawView page={page} setPage={setPage} />
            ),
            <AddAccount page={page} setPage={setPage} />,
            <WithdrawSuccess />,
          ].filter(Boolean)[page - 1]
        }
      </StyledDiv>
    </DashboardContent>
  );
};

export default WalletPage;
