import styled from "styled-components/macro";
import { pxToEm } from "utils";

export const MyAccountStyle = styled.div`
  position: relative;

  fieldset {
    border: none;
  }

  legend {
    margin-bottom: 37px;
  }

  .my-account-card {
    width: 100%;
    max-width: 697px;
    margin: auto;
    padding: 16px;

    @media screen and (min-width: ${pxToEm(900, false)}) {
      padding: 59px 42px;
    }
  }

  .initials {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: var(--blue);
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2.3px solid white;
    position: relative;
    top: 132px;
  }
`;

export const MyAccountHeader = styled.div`
  height: 192px;
  margin-bottom: 35px;
  border-radius: 10px;
  background-position: center;
  background-size: cover;
  width: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: baseline;
`;

export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${pxToEm(35)};
`;

export const DataFieldStyling = styled.div`
  .value-container {
    position: relative;
    margin-top: 26px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--gray-3);
  }

  .edit-btn {
    position: absolute;
    right: 0;
    bottom: 8px;
    width: 40px;
    height: 40px;
    border-radius: 20px;

    &:hover {
      background-color: var(--light-gray);
    }
  }
`;

export const AccountInnerInputStyling = styled.input`
  font-size: clamp(14px, 4vw, 16px);
  border: none;
  border-bottom: 1px solid var(--gray-3);
  padding-bottom: 8px;
  outline: none;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:focus {
    border-bottom: 1px solid var(--blue);
  }

  @media screen and (min-width: ${pxToEm(900)}) {
    border: none;
  }
`;
