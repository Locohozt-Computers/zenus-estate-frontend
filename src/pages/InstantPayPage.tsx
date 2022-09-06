import React, { useState } from "react";
import {
  InstantForm,
  PaySummary,
  PaySuccess,
  PayFailed,
  PayOption,
  Typography,
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

const InstantPayPage = () => {
  const [page, setPage] = useState(0);
  const [payStatus, setPayStatus] = useState(false);
  const payOption = useSelector(
    (state: RootState) => state.payment.payOption.name
  );

  let pageDetails = "";
  if (page === 1) {
    pageDetails = "/payment methods";
  } else if (page === 2 && payOption === "wallet") {
    pageDetails = "/wallet payment";
  } else if (page === 2 && payOption === "card") {
    pageDetails = "/card payment";
  } else if (page === 3 && payStatus) {
    pageDetails = "/payment methods/successful";
  } else if (page === 3 && !payStatus) {
    pageDetails = "/payment methods/failed";
  }
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
        <Typography
          size={16}
          weight={500}
          textColor="med-gray"
          content={`Pay bills${pageDetails}`}
        />
      </span>
      <div className="paymentDetails">
        {page === 0 && <InstantForm page={page} setPage={setPage} />}
        {page === 1 && <PayOption page={page} setPage={setPage} />}
        {page === 2 && (
          <PaySummary
            page={page}
            setPage={setPage}
            setPayStatus={setPayStatus}
          />
        )}
        {page === 3 && payStatus && <PaySuccess />}
        {page === 3 && !payStatus && <PayFailed />}
      </div>
    </StyledDiv>
  );
};

export default InstantPayPage;
