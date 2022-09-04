import React from "react";
import styled from "styled-components";
import { Typography, Button } from "components/atoms";

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
  justify-content: space-between;
  margin-top: 1.5rem;

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
  }
  .summary-title {
    height: 89px;
    justify-content: center;
  }
`;

export const PaySummary = ({ page, setPage }: Props) => {
  return (
    <StyledDiv>
      <span style={{ alignSelf: "flex-start" }}>
        <Typography
          textColor="blue"
          size={23}
          weight={500}
          content="You are about to pay N202,000"
        />
      </span>
      <div className="summary">
        <div className="summary-title">Annual Service Charge </div>
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
            content="12 okota road, Ajao"
          />
        </div>
        <div className="summary-field">
          <span>Paystack Fee</span>
          <Typography variant="subtitle" textColor="blue" content="N2000" />
        </div>
        <div className="summary-field">
          <span>Type</span>
          <Typography
            variant="subtitle"
            textColor="blue"
            content="Annual Service Charge"
          />
        </div>
        <div className="summary-field">
          <span>Charges</span>
          <Typography
            variant="subtitle"
            size={17}
            weight={500}
            textColor="blue"
            content="N200,000"
          />
        </div>
        <div className="summary-field" style={{ height: "89px" }}>
          <span>Total</span>
          <Typography
            textColor="blue"
            size={23}
            weight={500}
            content="N202,000"
          />
        </div>
      </div>
      <Button onClick={() => setPage(page + 1)} text="Pay N202,000" />
    </StyledDiv>
  );
};
