import React, { useState } from "react";
import styled from "styled-components";
import Arrow from "assets/images/arrowright.png";
import { Typography, Button, FormikSelect } from "components";

const StyledDiv = styled.div``;
type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};
export const WalletOverview = ({ page, setPage }: Props) => {
  return (
    <StyledDiv>
      {" "}
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
      <div className="content">
        <div className="balance">
          <Button text="Withdraw" />
          <Button text="Fund Wallet" />
          {/* <FormikSelect /> */}
        </div>
      </div>
    </StyledDiv>
  );
};
