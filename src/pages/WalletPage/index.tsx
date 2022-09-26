import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { DashboardContent } from "layouts";
import { Card, NavigationController } from "components";
import { useQuery } from "@tanstack/react-query";
import { getBankAccounts } from "pages/WalletPage/request";
import { pxToEm } from "utils";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  const { data: bankAccounts } = useQuery(
    [getBankAccounts.key],
    getBankAccounts
  );

  const pages = useMemo(
    () => [
      "My Wallet",
      bankAccounts?.length ? "Withdraw" : undefined,
      "Add New Account",
    ],
    [bankAccounts?.length]
  );

  const [page, setPage] = useState(1);

  const handleSetPage = useCallback(
    (p: number) => {
      if (page > 2) {
        setPage(1);
      } else setPage(p);
    },
    [page]
  );

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const queryPage = query.get("page");
    if (queryPage) {
      const idx = pages
        .filter(Boolean)
        .findIndex((el) => el?.toLowerCase() === queryPage);
      if (idx > -1) handleSetPage(idx);
    }
  }, [handleSetPage, location.search, pages]);

  return (
    <DashboardContent>
      <StyledDiv>
        <div className="nav">
          <NavigationController
            pages={pages}
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
