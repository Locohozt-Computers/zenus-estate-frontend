import React, { useState } from "react";
import {
  Typography,
  WalletOverview,
  AddAccount,
  WithdrawView,
  WithdrawSuccess,
} from "components";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers";
import { pxToEm } from "utils";

const StyledDiv = styled.div`
  padding: ${pxToEm(32)} ${pxToEm(32)};
  border-radius: 16px;
  width: ${pxToEm(840)};
  height: ${pxToEm(757)};
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
  const payOption = useSelector(
    (state: RootState) => state.payment.payOption.name
  );

  return (
    <StyledDiv>
      <div className="page-content">
        {page === 3 && <WalletOverview page={page} setPage={setPage} />}
        {page === 1 && <AddAccount page={page} setPage={setPage} />}
        {page === 0 && <WithdrawView page={page} setPage={setPage} />}
        {page === 3 && <WithdrawSuccess page={page} setPage={setPage} />}
      </div>
    </StyledDiv>
  );
};

export default WalletPage;
