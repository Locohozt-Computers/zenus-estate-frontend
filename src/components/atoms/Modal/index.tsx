import React, { FC, PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components/macro";
import { pxToEm } from "utils";

export type ModalType = {
  maxWidth?: number;
  disableOutsideClick?: boolean;
  closeModal?: () => void;
  account?: any;
  setAccount?: any;
};

const Portal = ({ children }: PropsWithChildren) =>
  ReactDOM.createPortal(
    children,
    document.getElementById("root-modal") as Element
  );

const PortalStyling = styled.div<{ maxWidth?: number; visible: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  pointer-events: ${({ visible }) => (visible ? "auto" : "none")};
  transition: opacity 0.5s;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  z-index: 200;

  .modal-content {
    display: flex;
    background-color: #12121224;
    height: 100vh;
    width: 100vw;
    overflow: auto;
    padding: 20px;
  }

  .modal-body {
    margin: auto;
    z-index: 1;
    width: 100%;
    max-width: ${({ maxWidth }) => pxToEm(maxWidth || 300)};
  }
`;

export const Modal: FC<
  ModalType & PropsWithChildren & { visible: boolean }
> = ({ children, disableOutsideClick, visible, closeModal, ...props }) => {
  if (!visible) return null;

  return (
    <Portal>
      <PortalStyling className="modal" visible={visible} {...props}>
        <div
          role="presentation"
          className="modal-content"
          onClick={!disableOutsideClick ? closeModal : undefined}
        >
          <div
            role="presentation"
            className="modal-body"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </PortalStyling>
    </Portal>
  );
};
