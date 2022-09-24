import React, { PropsWithChildren } from "react";
import { Loader } from "components/atoms/Loader";
import DataTable, { TableStyles } from "react-data-table-component";
import { TableProps } from "react-data-table-component/dist/src/DataTable/types";
import { Typography } from "components/atoms";
import styled from "styled-components/macro";
import { AppIcon, pxToEm } from "utils";
import { useOnClickOutside } from "hooks";
import { TextColor } from "components/atoms/Typography/style";
import { IconCaretDownFilled } from "assets/icons";
import imgData from "./img.png";

const customStyles: TableStyles = {
  header: {
    style: {
      paddingLeft: 40, // override the cell padding for head cells
      paddingRight: 40,
      minHeight: 40,
      fontSize: 17,
      borderBottom: "1px solid #0000001f",
      overflow: "unset",
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
  //align-items: flex-end;
  //flex-direction: column;
  gap: 20px;
  height: 78px;

  @media screen and (min-width: ${pxToEm(900)}) {
    flex-direction: row;
    align-items: center;
    height: 55px;
  }
`;

const TFStyling = styled.div`
  position: relative;
  .tf--button {
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
  }
  .tf--content {
    position: absolute;
    right: 0;
    box-shadow: 2px 5px 10px 1px #00000026;
    border-radius: 8px;
    background-color: white;
    z-index: 2;
    overflow: hidden;
  }
`;

interface TFI extends PropsWithChildren {
  renderSetVisible: (props: { setVisible: (arg: boolean) => void }) => void;
  active?: boolean | TextColor;
  text?: string;
}

export const TFilter = ({ children, text, renderSetVisible, active }: TFI) => {
  const { visible, setVisible, ref } = useOnClickOutside(false);

  return (
    <TFStyling ref={ref}>
      <button
        className="tf--button center-contents"
        type="button"
        onClick={() => setVisible(!visible)}
      >
        <AppIcon
          render={IconCaretDownFilled}
          textColor={active ? "blue" : "gray"}
        />
        <Typography
          weight={500}
          size={17}
          textColor={active ? "blue" : "gray"}
          content={text || "Filter"}
        />
      </button>
      {visible && (
        <div
          role="presentation"
          className="tf--content"
          onClick={() => renderSetVisible({ setVisible })}
        >
          {children}
        </div>
      )}
    </TFStyling>
  );
};

const DTStyling = styled.div`
  .rdt_TableHeader {
    > div:last-child {
      display: none;
    }
  }
`;

export const Table = ({ ...props }: TableProps<any>) => {
  return (
    <DTStyling>
      <DataTable
        customStyles={customStyles}
        {...props}
        noDataComponent={
          <div
            style={{
              padding: "6rem 1rem",
              textAlign: "center",
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
        progressComponent={
          <div style={{ position: "relative", height: 200 }}>
            <Loader open absolute />
          </div>
        }
      />
    </DTStyling>
  );
};
