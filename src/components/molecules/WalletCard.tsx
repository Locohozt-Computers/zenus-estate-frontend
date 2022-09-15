import React from "react";
import { Typography } from "components/atoms";
import styled from "styled-components";
import { pxToEm } from "utils";
import withdraw from "assets/images/withdrawcash.png";
import add from "assets/images/addcash.png";
import { BiPlus } from "react-icons/bi";

type Props = {
  action: string;
  id: number | string;
  amount: number;
  date: string;
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
  const topUp = "Account Top up";
  // function toMonthName(monthNumber) {
  //   const date = new Date();
  //   date.setMonth(monthNumber - 1);

  //   return date.toLocaleString("en-US", {
  //     month: "long",
  //   });
  // }
  return (
    <StyledDiv>
      <img src={action === topUp ? add : withdraw} alt={action} />
      <div className="text-div">
        <div className="text-div-section">
          <Typography content={action} variant="bodyBig" />
          <Typography content={`id-#${id}`} variant="helperText" />
        </div>
        <div className="text-div-section">
          <Typography
            variant="subtitle"
            textColor={action === topUp ? "green" : "pink"}
          >
            <span
              style={{
                fontSize: "10px",
                // display: "flex",
                // alignItems: "center",
              }}
            >
              {action === topUp ? <BiPlus /> : ""}
            </span>
            ₦{amount}
          </Typography>
          <Typography
            content={date.substring(0, 10)}
            variant="bodySmall"
            textColor="med-gray"
          />
        </div>
      </div>
    </StyledDiv>
  );
};
