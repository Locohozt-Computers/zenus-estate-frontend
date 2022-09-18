import React, { FC, PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components/macro";
import { AppIcon, pxToEm } from "utils";
import { CgClose } from "react-icons/cg";

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
    position: relative;
    margin: auto;
    z-index: 1;
    width: 100%;
    max-width: ${({ maxWidth }) => pxToEm(maxWidth || 300)};
  }

  .close-btn {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 15px;
    top: 15px;

    & > button {
      cursor: pointer;
    }
  }
`;

export const Modal: FC<
  ModalType & PropsWithChildren & { visible: boolean; showCloseBtn?: boolean }
> = ({
  children,
  showCloseBtn = true,
  disableOutsideClick,
  visible,
  closeModal,
  ...props
}) => {
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
            {showCloseBtn && (
              <div className="close-btn">
                <button type="button" onClick={closeModal}>
                  <AppIcon render={CgClose} />
                </button>
              </div>
            )}
            {children}
          </div>
        </div>
      </PortalStyling>
    </Portal>
  );
};
