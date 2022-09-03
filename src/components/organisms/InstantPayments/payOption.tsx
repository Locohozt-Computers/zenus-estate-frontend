import React from "react";
import styled from "styled-components";
import { Typography, Input, Button } from "components/atoms";
// import { IoWallet } from "react-icons/io5";
import { IoWallet } from "assets/icons";

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  padding: 76px 40px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .paymentMethod {
    width: 570px;
    height: 58px;
    background: #f7f7f7;
    border-radius: 7px;
    border-radius: 16px;
    font-size: 17px;
    padding-left: 33px;
    color: #909090;
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: calc();
  }
  .balance {
    width: 570px;
    height: 28px;
    display: flex;
    justify-content: space-between;
    color: var(--blue);
  }
`;
export const PayOption = ({ page, setPage }: Props) => {
  return (
    <StyledDiv>
      <span style={{ alignSelf: "flex-start" }}>
        <Typography
          textColor="blue"
          size={23}
          weight={500}
          content=" Pay your bills in few minuites"
        />
      </span>
      <div className="paymentMethod">
        <IoWallet fill="var(--blue)" />
        My Zenus Wallet Balance
      </div>
      <div className="paymentMethod">Pay with Card or Bank Transfer</div>
      <div className="balance">
        <span>
          <IoWallet fill="var(--blue)" />
          Wallet Balance
        </span>
        <span>N300000</span>
      </div>
      <Button text="Next" type="submit" onClick={() => setPage(page + 1)} />
    </StyledDiv>
  );
};
