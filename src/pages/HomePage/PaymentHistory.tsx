import React from "react";
import { Table, Tag, THeader, Typography } from "components";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "pages/request";
import { TableColumn } from "react-data-table-component";
import { PaymentHistoryI } from "api";
import { currencyFormat, getStatusColor } from "utils/helpers";

const columns: TableColumn<PaymentHistoryI>[] = [
  {
    name: "Payment Type",
    selector: (row) => row.payment_type.name,
    format: (v) => <Typography content={v.payment_type.name} />,
    style: {
      paddingLeft: 40,
    },
  },
  {
    name: "Date",
    selector: (row) => row.created_at,
    format: (v) => (
      <Typography content={format(new Date(v.created_at), "do MMMM, yyyy")} />
    ),
    center: true,
  },
  {
    name: "Amount",
    selector: (row) => row.amount,
    format: (v) => (
      <Typography
        style={{
          color: v.amount < 0 ? "var(--pink)" : "var(--green)",
        }}
        content={currencyFormat(v.amount)}
      />
    ),
    center: true,
  },
  {
    name: "Status",
    selector: (row) => row.transaction_status.name,
    format: (v) => (
      <Tag
        label={v.transaction_status.name}
        colors={getStatusColor(v.transaction_status.name)}
      />
    ),
    right: true,
    style: {
      paddingRight: 40,
    },
  },
];

export const PaymentHistory = () => {
  const { isLoading, data } = useQuery(["getDashboard"], getDashboard);

  return (
    <div>
      <Table
        title={
          <THeader>
            <Typography weight={500} size={17} content="Payment History" />
          </THeader>
        }
        columns={columns}
        data={data?.payment_history || []}
        progressPending={isLoading}
      />
    </div>
  );
};
