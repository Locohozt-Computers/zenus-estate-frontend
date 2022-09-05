import React, { useState } from "react";
import styled from "styled-components";
import { Typography, Button } from "components/atoms";
import { IconWallet } from "assets/icons";
import mastercard from "assets/images/logos_mastercard.png";
import { useQuery } from "@tanstack/react-query";
import { paymentMethod } from "pages/request";

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .paymentMethod {
    width: 100%;
    height: 58px;
    background: var(--light-gray);
    border-radius: 7px;
    font-size: 17px;
    padding-left: 33px;
    color: var(--med-grey);
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 20px 0;
  }
  .paymentMethod:hover,
  .paymentMethod:focus,
  .paymentMethod:active {
    color: var(--blue);
    background: #f5f8ff;
    border: 1px solid var(--blue);
    outline: none !important;
  }

  .balance {
    width: 100%;
    height: 28px;
    display: flex;
    justify-content: space-between;
    color: var(--blue);
  }
`;
export const PayOption = ({ page, setPage }: Props) => {
  const [payOption, setpayOption] = useState("");
  // requests
  const payMethod = useQuery(["getPaymentMethod"], paymentMethod).data;
  const payMethodName = payMethod?.map((item) => {
    return item.name;
  });

  const selectMethod = () => {};
  return (
    <StyledDiv>
      <span style={{ alignSelf: "flex-start", marginBottom: "37px" }}>
        <Typography
          textColor="blue"
          size={23}
          weight={500}
          content="Choose Your Prefered Payment Method"
        />
      </span>

      <button
        className="paymentMethod"
        type="button"
        onClick={() => {
          setpayOption();
        }}
      >
        <IconWallet fill="var(--blue)" style={{ marginRight: "12px" }} />
        My Zenus Wallet Balance
      </button>
      <button className="paymentMethod" type="button" onClick={() => {}}>
        <img
          src={mastercard}
          alt="logos_mastercard"
          style={{ marginRight: "12px" }}
        />
        Pay with Card or Bank Transfer
      </button>
      <div className="balance">
        <span>
          <IconWallet fill="var(--blue)" style={{ marginRight: "12px" }} />
          Wallet Balance
        </span>
        <span>N300000</span>
      </div>
      <Button
        text="Next"
        type="submit"
        onClick={() => setPage(page + 1)}
        style={{ marginTop: "130px" }}
      />
    </StyledDiv>
  );
};
