import React from "react";
import { Typography } from "components/atoms";
import styled from "styled-components";
import { pxToEm } from "utils";
import withdraw from "assets/images/withdrawcash.png";
import add from "assets/images/addcash.png";

type Props = {
  action: string;
  id: number | string;
  amount: string;
  date: number;
};
const StyledDiv = styled.div`
  width: 100%;
  height: ${pxToEm(98)};
  padding: ${pxToEm(14)};
  display: flex;
  align-items: center;
  background: #ffffff;
  box-shadow: 4px 4px 24px rgba(182, 192, 211, 0.11);
  border-radius: 8px;

  .text-div {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-section,
    &-section-right {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: flex-start;
      height: 50%;
      padding: 0 ${pxToEm(10)};
    }
    &-section-right {
      align-items: flex-end;
    }
  }
`;
export const WalletCard = ({ action, id, amount, date }: Props) => {
  return (
    <StyledDiv>
      <img src={action === "Account Topup" ? add : withdraw} alt={action} />
      <div className="text-div">
        <div className="text-div-section">
          <Typography content={action} variant="bodyBig" />
          <Typography content={id} variant="helperText" />
        </div>
        <div className="text-div-section">
          <Typography
            content={amount}
            variant="subtitle"
            textColor={action === "Account Topup" ? "green" : "red"}
          />
          <Typography content={date} variant="bodySmall" textColor="med-gray" />
        </div>
      </div>
    </StyledDiv>
  );
};
