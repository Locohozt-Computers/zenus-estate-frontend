import React from "react";
import styled from "styled-components";
import Arrow from "assets/images/arrowright.png";
import { FormikProvider, useFormik } from "formik";
import { FormikInput, Button, Typography } from "components/atoms";
import { pxToEm } from "utils";

const StyledDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  .withdraw-items {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }
  form {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
`;
type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const AddAccount = ({ page, setPage }: Props) => {
  const formik = useFormik({
    initialValues: {
      accName: "",
      accNumber: "",
      bankName: "",
      amount: "",
    },
    onSubmit: () => {
      setPage(page + 1);
      //  dispatch(setValues({ values, chosenType }));
    },
  });
  return (
    <StyledDiv>
      <span className="arrow-icon">
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          style={{ visibility: page < 1 ? "hidden" : "visible" }}
        >
          <img
            src={Arrow}
            alt="arrow"
            style={{ margin: ` 0 ${pxToEm(14)} 0 -${pxToEm(32)}` }}
          />
        </button>
      </span>
      <div className="withdraw-items">
        <span className="arrow-icon">
          <Typography
            variant="bodyBig"
            textColor="med-gray"
            content="My wallet/withdraw"
          />
        </span>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <FormikInput
              name="accName"
              label="Account Name to Pay"
              placeholder="Daniel Mbazu"
            />
            <FormikInput
              name="accNumber"
              label="Account Number to Pay"
              placeholder="3119378455"
            />
            <FormikInput
              name="bankName"
              label="Bank Name"
              placeholder="First Bank PLC"
            />
            <FormikInput
              name="amount"
              label="Amount to Withdraw"
              placeholder="N60,0000"
            />
            <Button text="Withdraw" />
          </form>
        </FormikProvider>
      </div>
    </StyledDiv>
  );
};
