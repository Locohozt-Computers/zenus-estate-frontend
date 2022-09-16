import React from "react";
import styled from "styled-components";
import { Button, Input, Typography } from "components";
import Bankimg from "assets/images/firstbank.png";
import { pxToEm } from "utils";
import { AiOutlinePlus } from "react-icons/ai";
import { PropsI } from "pages/WalletPage/types";

const StyledDiv = styled.div`
  width: ${pxToEm(570)};
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  .display-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .wallet-content {
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: flex-start;
  }

  .saved-account {
    padding: ${pxToEm(35)};
    height: ${pxToEm(185)};
    background: #fdfafd;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    width: 100%;

    &-text {
      align-items: flex-start;
      align-self: flex-start;
      flex-direction: column;
      margin-left: ${pxToEm(22)};
      min-height: ${pxToEm(90)};
    }
  }
`;

export const WithdrawView = ({ page, setPage }: PropsI) => {
  const Bank = "First Bank PLC";
  const Name = "Daniel Mbazu";
  const Account = "11111111111111";

  // eslint-disable-next-line
  const newAccount = String(Account.slice(0, 4) + "***" + Account.slice(6, 10));

  return (
    <StyledDiv>
      <div className="display-flex wallet-content">
        <span className="arrow-icon">
          <Typography
            size={16}
            weight={500}
            textColor="med-gray"
            content="My Wallet"
          />
        </span>
        <div className="saved-account">
          <img
            src={Bankimg}
            alt="bank"
            style={{ width: `${pxToEm(85)}`, height: `${pxToEm(85)}` }}
          />
          <div className="saved-account-text display-flex ">
            <Typography variant="heading5" content={Bank} />
            <Typography
              variant="subtitle"
              content={newAccount}
              textColor="med-gray"
            />
            <Typography variant="bodyBig">
              Recipient Name: <span>{Name}</span>
            </Typography>
          </div>
        </div>
        <div style={{ alignSelf: "flex-end" }} className="display-flex">
          <button type="button" style={{ color: "var(--blue)" }}>
            <AiOutlinePlus />
          </button>
          <Typography
            variant="bodyBig"
            textColor="blue"
            content="Add New Account"
          />
        </div>
        <Input
          name="amount"
          placeholder="N200,000"
          label="Amount to withdraw"
        />
        <Button
          text="Withdraw"
          style={{
            marginBottom: `${pxToEm(75)}`,
            marginTop: `${pxToEm(60)}`,
            alignSelf: "center",
          }}
          disabled
        />
      </div>
    </StyledDiv>
  );
};
