import React from "react";
import { Tag, Typography } from "components";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "pages/request";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
import { PaymentHistoryI } from "api";
import { currencyFormat, hexToHSL } from "utils/helpers";
import styled from "styled-components/macro";
import { pxToEm } from "utils";

const getStatus = (status: string) => {
  const fn = (c: string) => hexToHSL(c, 10);
  switch (status) {
    case "failed":
      return { bg: fn("#ff006e"), text: "var(--pink)" };
    case "processing":
      return { bg: fn("#003085"), text: "var(--blue)" };
    case "completed":
      return { bg: fn("#007416"), text: "var(--green)" };
    default:
      return { bg: fn("#003085"), text: "var(--blue)" };
  }
};

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
    format: (v) => <Typography content={currencyFormat(v.amount)} />,
    center: true,
  },
  {
    name: "Status",
    selector: (row) => row.transaction_status.name,
    format: (v) => (
      <Tag
        label={v.transaction_status.name}
        colors={getStatus(v.transaction_status.name)}
      />
    ),
    right: true,
    style: {
      paddingRight: 40,
    },
  },
];

const customStyles: TableStyles = {
  header: {
    style: {
      paddingLeft: 40, // override the cell padding for head cells
      paddingRight: 40,
      minHeight: 40,
      fontSize: 17,
      borderBottom: "1px solid #0000001f",
    },
  },
  headCells: {
    style: {
      fontSize: 17,
      paddingLeft: 40, // override the cell padding for head cells
      paddingRight: 40,
    },
  },
  head: {
    style: {
      height: 62,
    },
  },
  rows: {
    style: {
      padding: "14px 0px",
      // borderBottom: "1px solid var(--gray) !important",
    },
  },
};

const THeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-direction: column;
  gap: 20px;

  @media screen and (min-width: ${pxToEm(900)}) {
    flex-direction: row;
    align-items: center;
  }
`;

export const PaymentHistory = () => {
  const { isLoading, data } = useQuery(["getDashboard"], getDashboard);

  return (
    <div>
      <DataTable
        title={
          <THeader>
            <Typography weight={500} size={17} content="Payment History" />
            <div>
              <Typography>filter</Typography>
            </div>
          </THeader>
        }
        columns={columns}
        data={data?.payment_history || []}
        progressPending={isLoading}
        customStyles={customStyles}
      />
    </div>
  );
};
