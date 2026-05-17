import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Loader } from "components/atoms/Loader";
import { getElectricityQuotaUsage } from "pages/request";
import { ROUTES } from "app-constants";
import { currencyFormat } from "utils/helpers";

import {
  Card,
  Label,
  Message,
  Notice,
  OkButton,
  Row,
  SectionTitle,
  Value,
} from "./style";

const formatQuotaAmount = (
  amount: string | number | null,
  type: string
): string => {
  if (amount === null || amount === undefined || amount === "") return "—";
  if (type === "kwh") return `${amount} kWh`;
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(numeric)) return String(amount);
  return currencyFormat(numeric);
};

export const QuotaTab = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery(
    [getElectricityQuotaUsage.key],
    getElectricityQuotaUsage
  );

  return (
    <>
      {isLoading && <Loader open absolute />}
      {!!error && (
        <Message>Failed to load quota usage. Please try again.</Message>
      )}

      {data && (
        <>
          <Card>
            <SectionTitle>Window</SectionTitle>
            <Row>
              <Label>Period</Label>
              <Value>
                {data.window.from} → {data.window.to}
              </Value>
            </Row>
            <Row>
              <Label>Duration</Label>
              <Value>{data.window.days} day(s)</Value>
            </Row>
            <Row>
              <Label>Granularity</Label>
              <Value>{data.window.granularity}</Value>
            </Row>
          </Card>

          <Card>
            <SectionTitle>Quota Used</SectionTitle>
            <Row>
              <Label>Quota Type</Label>
              <Value>{data.quota.type}</Value>
            </Row>
            <Row>
              <Label>Quota Limit</Label>
              <Value>
                {formatQuotaAmount(data.quota.amount, data.quota.type)}
              </Value>
            </Row>
            <Row>
              <Label>Money Spent</Label>
              <Value>{currencyFormat(data.usage.money.spent)}</Value>
            </Row>
            <Row>
              <Label>Money Remaining</Label>
              <Value>
                {data.usage.money.remaining === null
                  ? "—"
                  : currencyFormat(data.usage.money.remaining)}
              </Value>
            </Row>
            <Row>
              <Label>kWh Spent</Label>
              <Value>{data.usage.kwh.spent} kWh</Value>
            </Row>
            <Row>
              <Label>kWh Remaining</Label>
              <Value>
                {data.usage.kwh.remaining === null
                  ? "—"
                  : `${data.usage.kwh.remaining} kWh`}
              </Value>
            </Row>
          </Card>

          <Notice>
            According to the policy setup by your facility manager, the maximum
            energy purchase limit is{" "}
            <strong>
              {formatQuotaAmount(data.quota.amount, data.quota.type)}
            </strong>{" "}
            per <strong>{data.window.days}-day</strong> period. Purpose: prevent
            financial losses from stockpiling energy during low-tariff periods.
            <br />
            <br />
            <strong>Action required:</strong> if exceeded, contact your facility
            manager for assistance.
          </Notice>

          <OkButton onClick={() => navigate(ROUTES.powerTokenBuy.fullPath)}>
            OK
          </OkButton>
        </>
      )}
    </>
  );
};
