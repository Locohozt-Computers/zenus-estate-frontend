import React, { useCallback, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllTransactions,
  getAllTransactionsByLevyType,
  getPaymentType,
} from "pages/request";
import { Card, Table, Tag, TFilter, THeader, Typography } from "components";
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

  .button {
    background-color: var(--blue);
    color: white;
    padding: 5px 10px;
    border-radius: 8px;
  }
`;

const UlStyle = styled.ul`
  list-style: none;
  white-space: nowrap;
  > li {
    padding: 10px 15px;
    :hover {
      color: white;
      cursor: pointer;
      background-color: var(--blue);
    }
  }
`;

const ExpandedComponent = ({
  data,
}: ExpanderComponentProps<PaymentHistoryI>) => {
  const downloadRef = useRef<HTMLAnchorElement>(null);

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

  const onPrint = () => {
    if (downloadRef.current) {
      downloadRef.current.click();
    }
  };

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
        <tr>
          <td>
            <Typography>Print Receipt</Typography>
          </td>
          <td>
            <a
              type="presentations"
              ref={downloadRef}
              href="https://picsum.photos/200/300"
              style={{ display: "none" }}
            >
              receipt
            </a>
            <button className="button" type="button" onClick={onPrint}>
              Print
            </button>
          </td>
        </tr>
      </tbody>
    </TabStyling>
  );
};

const AccountStatementPage = () => {
  const queryClient = useQueryClient();

  const [pId, setPid] = useState<string | null>(null);
  const [hasFilter, setHasFilter] = useState(false);
  const [page, setPage] = useState(1);

  const { data: paymentTypes, isLoading: paymentTypesLoading } = useQuery(
    ["paymentType"],
    getPaymentType
  );

  const { isLoading, data } = useQuery(
    ["getAllTransactions", page],
    () => getAllTransactions(page),
    {
      keepPreviousData: true,
      enabled: !hasFilter && !pId,
    }
  );

  const { data: dataFiltered, isFetching: mLoading } = useQuery(
    ["getAllTransactionsByLevyType", page, pId],
    () =>
      getAllTransactionsByLevyType({
        payment_type_id: pId as string,
        page,
      }),
    { keepPreviousData: true, enabled: !!pId && hasFilter }
  );

  const paymentTypeOptions = useMemo(() => {
    if (paymentTypes) {
      return paymentTypes.map((item) => ({
        label: item.special_name,
        value: item.id.toString(),
      }));
    }
    return [];
  }, [paymentTypes]);

  const handleFilter = useCallback((e: { target: Record<string, any> }) => {
    setPage(1);
    const id = e.target.id;
    if (id !== "null") {
      setPid(id as string);
      setHasFilter(true);
    } else {
      setPid(null);
      setHasFilter(false);
    }
  }, []);

  const handlePageChange = useCallback(
    (p: number) => {
      setPage(p);
      // Prefetch the next page!
      if (hasFilter) {
        if (pId) {
          queryClient.prefetchQuery(
            [getAllTransactionsByLevyType.key, p + 1],
            () =>
              getAllTransactionsByLevyType({
                page: p + 1,
                payment_type_id: pId,
              })
          );
        }
      } else if (data?.current_page) {
        queryClient.prefetchQuery(["getAllTransactions", p + 1], () =>
          getAllTransactions(p + 1)
        );
      }
    },
    [data, hasFilter, pId, queryClient]
  );

  return (
    <Card style={{ padding: 0, overflow: "hidden", marginTop: 80 }}>
      <Table
        style={{ marginTop: 50 }}
        progressPending={isLoading || paymentTypesLoading || mLoading}
        title={
          <THeader style={{ height: 66 }}>
            <Typography weight={500} size={17} content="All Levy Statements" />
            <TFilter
              active={hasFilter}
              renderSetVisible={({ setVisible }) => setVisible(false)}
            >
              <UlStyle onClick={handleFilter}>
                {[{ label: "All", value: "null" }]
                  .concat(paymentTypeOptions)
                  .map(({ label, value }) => (
                    <li key={label} id={value}>
                      {label}
                    </li>
                  ))}
              </UlStyle>
            </TFilter>
          </THeader>
        }
        columns={columns}
        data={hasFilter ? dataFiltered?.data || [] : data?.data || []}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        pagination
        paginationServer
        paginationDefaultPage={page}
        paginationTotalRows={hasFilter ? dataFiltered?.total : data?.total}
        paginationPerPage={10}
        onChangePage={handlePageChange}
        paginationRowsPerPageOptions={[10]}
      />
    </Card>
  );
};

export default AccountStatementPage;
