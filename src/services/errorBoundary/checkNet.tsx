import React from "react";
import styled from "styled-components/macro";
import { Typography } from "components";
import { useNetwork } from "hooks";

const Styling = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 500;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 7px 2px #0000004d;
  background-color: #455afe;
  color: white;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  border: 1px solid #8f1c1c;
`;

const CheckNet = () => {
  const { online } = useNetwork();

  if (!online) {
    return (
      <Styling>
        Wifi
        <Typography content="No Network" color="inherit" />
      </Styling>
    );
  }
  return null;
};

export default CheckNet;
