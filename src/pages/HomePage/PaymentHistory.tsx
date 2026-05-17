import React from "react";
import { Table, Tag, THeader, Typography } from "components";
import { format } from "date-fns";
import { TableColumn } from "react-data-table-component";
import { DashboardLevyI, DashboardTransactionI } from "api/types";
import { currencyFormat, getStatusColor } from "utils/helpers";
import { DATE_FORMAT } from "app-constants";

const columns: TableColumn<DashboardTransactionI>[] = [
  {
    name: "Levy Type",
    selector: (row) => row.levy.special_name,
    format: (v) => (
      <Typography
        variant="bodyBig"
        textColor="med-gray"
        title={v.levy.special_name}
        content={v.levy.special_name}
      />
    ),
    minWidth: "270px",
  },
  {
    name: "Date",
    selector: (row) => row.created_at,
    format: (v) => (
      <Typography
        variant="bodyBig"
        textColor="med-gray"
        title={format(new Date(v.created_at), DATE_FORMAT.shorterDate)}
        content={format(new Date(v.created_at), DATE_FORMAT.shorterDate)}
      />
    ),
    center: true,
    width: "230px",
  },
  {
    name: "Amount",
    selector: (row) => row.amount,
    format: (v) => (
      <Typography
        variant="bodyBig"
        style={{
          color: v.amount < 0 ? "var(--pink)" : "var(--green)",
        }}
        content={currencyFormat(Math.abs(v.amount))}
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
  },
];

export const PaymentHistory = ({ levies }: { levies: DashboardLevyI[] }) => {
  const transactions: DashboardTransactionI[] = levies.flatMap(
    (levy) => levy.recent_transactions
  );

  return (
    <div>
      <Table
        title={
          <THeader>
            <Typography weight={500} size={17} content="Payment History" />
          </THeader>
        }
        columns={columns}
        data={transactions}
        progressPending={false}
      />
    </div>
  );
};
