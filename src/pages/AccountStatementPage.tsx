import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "pages/request";
import { Table, Tag, TFilter, THeader, Typography } from "components";
import {
  ExpanderComponentProps,
  TableColumn,
} from "react-data-table-component";
import { PaymentHistoryI } from "api";
import { format } from "date-fns";
import { currencyFormat, getStatusColor, hexToHSL } from "utils/helpers";
import styled from "styled-components/macro";

const columns: TableColumn<PaymentHistoryI>[] = [
  {
    name: "Levy Type",
    selector: (row) => row.levy.special_name,
    format: (v) => <Typography content={v.levy.special_name} />,
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
    name: "Balance",
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

const TabStyling = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr:nth-child(even) {
    background-color: ${hexToHSL("#003085", 80)};
    color: white;
  }

  td {
    border: 1px solid var(--light-gray);
    padding: 8px;
  }
`;

const ExpandedComponent = ({
  data,
}: ExpanderComponentProps<PaymentHistoryI>) => {
  const expD = useMemo(
    () => [
      {
        label: "Description:",
        data: data.description,
      },
      {
        label: "Fee",
        data: currencyFormat(data.fee),
      },
      {
        label: "Ref No",
        data: data.ref_no,
      },
      {
        label: "Bank",
        data: data.bank,
      },
      {
        label: "Payment By",
        data: data.payment_by,
      },
      {
        label: "Payment Type",
        data: data.payment_type.name,
      },
    ],
    [data]
  );

  return (
    <TabStyling>
      <tbody>
        {expD.map(({ label, data: value }) => (
          <tr key={label}>
            <td>
              <Typography>{label}</Typography>
            </td>
            <td>
              <Typography>{value}</Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </TabStyling>
  );
};

const AccountStatementPage = () => {
  // const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(
    ["getAllTransactions"],
    getAllTransactions
  );

  // const handlePerRowsChange = (
  //   currentRowsPerPage: number,
  //   currentPage: number
  // ) => {};

  // const handlePageChange = (page: number, totalRows: number) => {
  // };

  // Prefetch the next page!
  // React.useEffect(() => {
  //   if (data?.next_page_url) {
  //     queryClient.prefetchQuery(
  //       ["getAllTransactions", data.current_page + 1],
  //       () => getAllTransactions()
  //     );
  //   }
  // }, [data, queryClient]);

  return (
    <div>
      <Table
        progressPending={isLoading}
        title={
          <THeader style={{ height: 66 }}>
            <Typography weight={500} size={17} content="All Levy Statements" />
            <TFilter>content</TFilter>
          </THeader>
        }
        columns={columns}
        data={data?.data || []}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        pagination
        paginationServer
        paginationTotalRows={data?.total}
        // onChangeRowsPerPage={handlePerRowsChange}
        // onChangePage={handlePageChange}
      />
    </div>
  );
};

export default AccountStatementPage;
