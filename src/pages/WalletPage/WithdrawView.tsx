import React from "react";
import styled from "styled-components";
import { Typography, Button, Input, Select } from "components";
import Arrow from "assets/images/arrowright.png";
import Bankimg from "assets/images/firstbank.png";
import { pxToEm } from "utils";

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const StyledDiv = styled.div`
  width: ${pxToEm(570)};
  height: 100%;
  border: 1px solid red;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;

  .saved-account-div {
    padding: ${pxToEm(35)};
    height: ${pxToEm(185)};
    background: #fdfafd;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-self: stretch;
  }
`;

export const WithdrawView = ({ page, setPage }: Props) => {
  const Bank = "FIrst Bank";
  const Name = "Daniel Mbazu";
  const Account = "11111111111111";

  // eslint-disable-next-line
  const newAccount = String(Account.slice(0, 4) + "***" + Account.slice(6, 10));

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
      </span>
      <div className="wallet-content">
        <span className="arrow-icon">
          <Typography
            size={16}
            weight={500}
            textColor="med-gray"
            content="My Wallet"
          />
        </span>
        <div className="saved-account-div">
          <img
            src={Bankimg}
            alt="bank"
            style={{ width: `${pxToEm(85)}`, height: `${pxToEm(85)}` }}
          />
          <div className="saved-account-text">
            <Typography variant="subtitle" content={Bank} />
            <Typography variant="subtitle" content={newAccount} />
            <Typography variant="bodyBig">
              Recipient Name: <span>{Name}</span>
            </Typography>
          </div>
        </div>
        <Typography variant="subtitle" content="Amount to withdraw" />
        <Input name="amount" placeholder="N200,000" />
        <Button
          text="Withdraw"
          style={{ marginTop: `${pxToEm(32)}`, alignSelf: "center" }}
          disabled
        />
      </div>
    </StyledDiv>
  );
};
