import { Typography } from "components";
import React from "react";
import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { currencyFormat } from "utils/helpers";
import bDrop from "./img.png";

const Styling = styled.div`
  background: url("${bDrop}");
  background-size: cover;
  max-height: 200px;
  max-width: 500px;
  height: 100%;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: ${pxToEm(50)} 50px;
  border-radius: 8px;
  box-shadow: 5px 6px 9px 0 #b5b5b52b;
`;

export const BalanceCard = ({
  name,
  amount,
}: {
  name: string;
  amount: string;
}) => {
  return (
    <Styling>
      <Typography style={{ whiteSpace: "nowrap" }} size={12}>
        {name}
      </Typography>
      <Typography
        style={{ whiteSpace: "nowrap" }}
        textColor={currencyFormat.removeFormat(amount) < 0 ? "pink" : "blue"}
        size={39}
        weight={600}
      >
        {amount}
      </Typography>
    </Styling>
  );
};
