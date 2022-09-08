import React, { useState } from "react";
import {
  Typography,
  WalletOverview,
  AddAccount,
  WithdrawView,
  WithdrawSuccess,
} from "components";
import styled from "styled-components";
import Arrow from "assets/images/arrowright.png";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers";

const StyledDiv = styled.div`
  padding: 39px 80px 47px;
  border-radius: 16px;
  width: 804px;
  height: 757px;
  background-color: var(--white);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .arrow-icon {
    display: flex;
  }

  .paymentDetails {
    align-self: center;
    width: 570px;
    height: 100%;
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
      <span className="arrow-icon">
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          style={{ visibility: page < 1 ? "hidden" : "visible" }}
        >
          <img src={Arrow} alt="arrow" style={{ margin: " 0 12px 0 -1rem" }} />
        </button>
        <Typography size={16} weight={500} textColor="med-gray" content="" />
      </span>
      <div className="paymentDetails">
        {/* {page === 0 && <InstantForm page={page} setPage={setPage} />}
        {page === 1 && <PayOption page={page} setPage={setPage} />}
        {page === 2 && (
          <PaySummary
            page={page}
            setPage={setPage}
            setPayStatus={setPayStatus}
          />
        )}
        {page === 3 && payStatus && <PaySuccess />}
        {page === 3 && !payStatus && <PayFailed />} */}
      </div>
      <div className="content">
        <WalletOverview page={page} setPage={setPage} />
        <AddAccount page={page} setPage={setPage} />
        <WithdrawSuccess page={page} setPage={setPage} />
      </div>
    </StyledDiv>
  );
};

export default WalletPage;
