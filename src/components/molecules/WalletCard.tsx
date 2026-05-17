import React from "react";
import { Typography } from "components/atoms";
import styled from "styled-components";
import { pxToEm } from "utils";
import { currencyFormat, getBalColor } from "utils/helpers";
import { format } from "date-fns";
import { DATE_FORMAT } from "app-constants";
import { TransactionTypeEnum } from "api";
import { HiArrowDown, HiArrowUp } from "react-icons/hi";

type Props = {
  action: TransactionTypeEnum;
  id: number | string;
  amount: number;
  date: string;
  name: string;
};

const StyledDiv = styled.div`
  width: 100%;
  //height: ${pxToEm(98)};
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
    align-items: flex-start;
    height: 100%;
    flex-direction: column;
    gap: 10px;

    > div:last-child {
      width: 100%;
    }

    @media screen and (min-width: ${pxToEm(900, false)}) {
      align-items: center;
      flex-direction: row;

      > div:last-child {
        width: fit-content;
      }
    }

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

  .space-out {
    justify-content: space-around;
    height: 100%;
  }

  .flex-end {
    align-items: flex-end;
  }
`;

const InflowIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e6f4ea, #c8e6c9);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const OutflowIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fdecea, #f8c8c4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const WalletCard = ({ action, name, id, amount, date }: Props) => {
  return (
    <StyledDiv>
      {action === TransactionTypeEnum.Credit ? (
        <InflowIconWrapper>
          <HiArrowDown size={20} color="#2e7d32" />
        </InflowIconWrapper>
      ) : (
        <OutflowIconWrapper>
          <HiArrowUp size={20} color="#c62828" />
        </OutflowIconWrapper>
      )}
      <div className="text-div">
        <div className="text-div-section space-out">
          <Typography content={name} variant="bodyBig" />
          <Typography content={`id-#${id}`} variant="helperText" />
        </div>
        <div className="text-div-section flex-end">
          <Typography
            variant="subtitle"
            color={getBalColor(amount)}
            content={`${amount < 0 ? "-" : "+"}${currencyFormat(
              Math.abs(amount)
            )}`}
          />
          <Typography variant="bodySmall" textColor="med-gray">
            {format(new Date(date), DATE_FORMAT.shortMonth)}
          </Typography>
        </div>
      </div>
    </StyledDiv>
  );
};
