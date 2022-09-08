import React, { useState } from "react";
import styled from "styled-components";
import withdraw from "assets/images/withdrawsuccess.png";
import Arrow from "assets/images/arrowright.png";
import { Typography } from "components";

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

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};
export const WithdrawSuccess = ({ page, setPage }: Props) => {
  const selectMethod = () => {};

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
          content="Pay bills"
        />
      </span>
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
