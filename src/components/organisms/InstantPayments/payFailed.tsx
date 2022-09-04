import React from "react";
import styled from "styled-components";
import { Typography } from "components/atoms";
import pay from "assets/images/payfailed.png";

const StyledDiv = styled.div`
  width: 480px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
`;

export const PayFailed = () => {
  const selectMethod = () => {};
  return (
    <StyledDiv>
      <img
        src={pay}
        alt="successful payment"
        style={{ marginBottom: "1.5rem" }}
      />
      <Typography
        variant="subtitle"
        content="Your payment did not go through, please check your internet connection and try again."
        textColor="blue"
      />
    </StyledDiv>
  );
};
