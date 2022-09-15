import React, { PropsWithChildren } from "react";
import { Loader } from "components/atoms/Loader";
import DataTable, { TableStyles } from "react-data-table-component";
import { TableProps } from "react-data-table-component/dist/src/DataTable/types";
import { Typography } from "components/atoms";
import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { useOnClickOutside } from "hooks";
import imgData from "./img.png";

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
      color: "var(--med-gray)",
    },
  },
  rows: {
    style: {
      padding: "14px 0px",
      color: "var(--med-gray)",
    },
  },
};

export const THeader = styled.div`
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

export const TFilter = ({ children }: PropsWithChildren) => {
  const { visible, setVisible, ref } = useOnClickOutside(false);

  return (
    <div ref={ref}>
      <button type="button" onClick={() => setVisible(!visible)}>
        filter
      </button>
      {visible && <div>{children}</div>}
    </div>
  );
};

export const Table = ({ ...props }: TableProps<any>) => {
  return (
    <DataTable
      customStyles={customStyles}
      {...props}
      noDataComponent={
        <div
          style={{
            padding: "6rem 1rem",
          }}
        >
          <img
            src={imgData}
            alt=""
            style={{ marginBottom: 30, maxWidth: 156 }}
          />
          <Typography content="You are yet to make any transaction" />
        </div>
      }
      fixedHeader
      progressComponent={
        <div style={{ position: "relative", height: 200 }}>
          <Loader open absolute />
        </div>
      }
    />
  );
};
