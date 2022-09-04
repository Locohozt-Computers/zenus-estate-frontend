import React from "react";
import { useOnClickOutside } from "hooks";
import { Card } from "components/atoms";
import styled from "styled-components/macro";
import { BsBellFill } from "react-icons/bs";
import { pxToEm } from "utils";

const Button = styled.button`
  all: unset;
  cursor: pointer;
  background-color: var(--gray-2);
  border-radius: 16px;
  padding: ${pxToEm(15)};

  :active {
    transform: scale(0.98);
  }
`;

const Drop = styled.div`
  position: absolute;
  top: 65px;
  right: 0;

  > div {
    box-shadow: 2px 5px 10px 1px #00000026;
  }
`;

export const NotificationDropdown = () => {
  const { ref, visible, setVisible } = useOnClickOutside(false);
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <Button type="button" onClick={() => setVisible(!visible)}>
        <BsBellFill size={20} color="var(--blue)" />
      </Button>
      {visible && (
        <Drop>
          <Card>HHHH</Card>
        </Drop>
      )}
    </div>
  );
};
