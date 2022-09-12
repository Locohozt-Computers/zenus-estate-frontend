import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers";
import { pxToEm } from "utils";
import { WalletOverview } from "./WalletOverview";
import { AddAccount } from "./AddAccount";
import { WithdrawView } from "./WithdrawView";
import { WithdrawSuccess } from "./WithdrawSuccess";

const StyledDiv = styled.div`
  padding: ${pxToEm(32)} ${pxToEm(32)};
  border-radius: 16px;
  width: ${pxToEm(840)};
  height: calc(100vh - 40px);
  background-color: var(--white);
  margin: 0 auto;

  .arrow-icon {
    display: flex;
    align-self: flex-start;
    margin-bottom: ${pxToEm(32)};
  }
  .page-content {
    width: ${pxToEm(570)};
    height: 100%;
    margin: 0 auto;
  }
`;

const WalletPage = () => {
  const [page, setPage] = useState(0);
  const [payStatus, setPayStatus] = useState(false);
  // const payOption = useSelector(
  //   (state: RootState) => state.payment.payOption.name
  // );

  return (
    <StyledDiv>
      <div className="page-content">
        {page === 0 && <WalletOverview page={page} setPage={setPage} />}
        {page === 1 && <AddAccount page={page} setPage={setPage} />}
        {page === 2 && <WithdrawView page={page} setPage={setPage} />}
        {page === 3 && <WithdrawSuccess page={page} setPage={setPage} />}
      </div>
    </StyledDiv>
  );
};

export default WalletPage;
