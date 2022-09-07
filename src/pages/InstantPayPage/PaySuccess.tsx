import React from "react";
import styled from "styled-components";
import { Typography } from "components/atoms";
import pay from "assets/images/paysuccess.png";

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

export const PaySuccess = () => {
  return (
    <StyledDiv>
      <img
        src={pay}
        alt="successful payment"
        style={{ marginBottom: "1.5rem" }}
      />
      <Typography
        variant="subtitle"
        content="Your Payment has been successfully registered in Zenux database."
        textColor="blue"
      />
    </StyledDiv>
  );
};
