import React from "react";
import styled from "styled-components";
import withdraw from "assets/images/withdrawsuccess.png";
import { Typography } from "components";
import { PropsI } from "pages/WalletPage/types";

const StyledDiv = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
`;

export const WithdrawSuccess = ({ page, setPage }: PropsI) => {
  return (
    <StyledDiv>
      <img
        src={withdraw}
        alt="successful payment"
        style={{ marginBottom: "3rem" }}
      />
      <Typography
        variant="subtitle"
        content="You’ve successfully withdrawn N400,000."
        textColor="blue"
      />
    </StyledDiv>
  );
};
