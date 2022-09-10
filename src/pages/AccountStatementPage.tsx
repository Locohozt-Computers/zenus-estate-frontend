import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { Typography } from "components";
import DataTable, { TableColumn } from "react-data-table-component";
import { PaymentHistoryI } from "api";
import { format } from "date-fns";
import { currencyFormat } from "utils/helpers";

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
    name: "Balance",
    selector: (row) => row.transaction_status.name,
    format: (v) => (
      <Typography
        content={currencyFormat(v.amount)}
        textColor={v.amount < 0 ? "pink" : "blue"}
      />
    ),
    right: true,
    style: {
      paddingRight: 40,
    },
  },
];

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
      <Loader open={isLoading} />
      <DataTable
        title="Users"
        columns={columns}
        data={data?.data || []}
        progressPending={isLoading}
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
