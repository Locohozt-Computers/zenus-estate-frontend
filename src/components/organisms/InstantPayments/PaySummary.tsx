import React from "react";
import styled from "styled-components";
import { Typography, Button } from "components/atoms";
import { PaystackButton } from "react-paystack";
import { useSelector } from "react-redux";
import { getLandlordsProfile } from "pages/request";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "store/reducers";

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPayStatus: React.Dispatch<React.SetStateAction<boolean>>;
};

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;

  .paystack-button {
    padding: 14px 82px;
    text-transform: capitalize;
    text-align: center;
    font-size: 20px;
    font-weight: 500;
    background-color: var(--blue);
    border-radius: 29px;
    font-family: "Montserrat", sans-serif;
    color: white;

    &:active {
      transform: scale(0.98);
    }
  }

  .summary {
    background: #fdfafd;
    border-radius: 10px;
    width: 100%;
  }
  .summary-field,
  .summary-title {
    border-bottom: 1px solid var(--gray-2);
    padding: 0 50px;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    text-transform: capitalize;
    justify-content: space-between;

    span {
      width: 40%;
    }
  }
  .summary-title {
    height: 89px;
    width: 100%;

    justify-content: center;
  }
`;

export const PaySummary = ({ page, setPage, setPayStatus }: Props) => {
  const details = useSelector((state: RootState) => state.payment);
  const amountCharged = details.charges;
  const paymentType = details.paymentType;
  const address = details.address;
  const payOption = details.payOption.name;
  const email = useQuery(["getLandlordsProfile"], getLandlordsProfile).data
    ?.landlord_email;
  const walletBalance = useSelector(
    (state: RootState) => state.payment.walletBalance
  );

  const key = "pk_test_e540194faba0a917009e15da930c0e2803408318";
  const paymentFee = payOption === "wallet" ? 0 : 200;
  const total = amountCharged + paymentFee;
  const componentProps = {
    email: `${email}`,
    amount: total * 100,
    publicKey: key,
    text: `${total}`,
    onSuccess: () => {
      setPayStatus(true);
      setPage(page + 1);
    },
    onClose: () => {
      setPayStatus(false);
      setPage(page + 1);
    },
  };

  const walletPayment = () => {
    if (walletBalance > total) {
      setPayStatus(true);
      setPage(page + 1);
    } else {
      setPayStatus(false);
      setPage(page + 1);
    }
  };
  return (
    <StyledDiv>
      <span style={{ alignSelf: "flex-start" }}>
        <Typography
          textColor="blue"
          size={23}
          weight={500}
          content={`You are about to pay N ${total}`}
        />
      </span>
      <div className="summary">
        <div className="summary-title">{paymentType}</div>
        <div className="summary-field">
          <span>Name</span>
          <Typography
            variant="subtitle"
            textColor="blue"
            content="Daniel Mbazu"
          />
        </div>
        <div className="summary-field">
          <span>Address</span>
          <Typography
            variant="subtitle"
            textColor="blue"
            content={address.substring(0, 20)}
          />
        </div>
        <div className="summary-field">
          <span>{payOption === "wallet" ? "" : "Pay stack"} fees</span>
          <Typography
            variant="subtitle"
            textColor="blue"
            content={payOption === "wallet" ? "0" : paymentFee}
          />
        </div>
        <div className="summary-field">
          <span>Type</span>
          <Typography
            variant="subtitle"
            textColor="blue"
            content={paymentType}
          />
        </div>
        <div className="summary-field">
          <span>Charges</span>
          <Typography
            variant="subtitle"
            textColor="blue"
            content={`${amountCharged}`}
          />
        </div>
        <div className="summary-field" style={{ height: "89px" }}>
          <span>Total</span>
          <Typography
            textColor="blue"
            size={23}
            weight={500}
            content={`N ${total}`}
          />
        </div>
      </div>
      {payOption === "wallet" ? (
        <Button text={`Pay ${total}`} onClick={walletPayment} />
      ) : (
        <PaystackButton {...componentProps} className="paystack-button" />
      )}
    </StyledDiv>
  );
};
