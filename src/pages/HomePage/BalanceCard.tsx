import { Typography } from "components";
import React, { useState } from "react";
import styled from "styled-components/macro";
import { AppIcon, pxToEm } from "utils";
import { currencyFormat } from "utils/helpers";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import bDrop from "./img.png";

const Styling = styled.div`
  position: relative;
  background: url("${bDrop}");
  background-size: cover;
  max-height: 200px;
  max-width: 500px;
  min-width: 215px;
  height: 100%;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: clamp(${pxToEm(32)}, 4vw, ${pxToEm(50)});
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
  const [showBalance, setShowBalance] = useState(true);

  return (
    <Styling>
      <div
        className="center-contents justify-flex-end"
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
        }}
      >
        <button
          style={{
            margin: 5,
          }}
          type="button"
          onClick={() => setShowBalance(!showBalance)}
        >
          <AppIcon
            textColor="blue"
            render={!showBalance ? AiFillEye : AiFillEyeInvisible}
          />
        </button>
      </div>
      <Typography style={{ whiteSpace: "nowrap" }} size={12}>
        {name}
      </Typography>
      <Typography
        style={{ whiteSpace: "nowrap" }}
        variant="heading3"
        textColor={currencyFormat.removeFormat(amount) < 0 ? "pink" : "blue"}
      >
        {showBalance ? amount : "*********"}
      </Typography>
    </Styling>
  );
};
