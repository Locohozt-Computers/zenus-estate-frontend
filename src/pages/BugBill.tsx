import React from "react";
import { Button, Card, Input, Select, Typography } from "components";
import styled from "styled-components/macro";
import { DashboardContent } from "layouts";
import { pxToEm } from "utils";

const BugBillStyle = styled.div`
  width: 100%;
  height: calc(100vh - 40px);

  @media screen and (min-width: ${pxToEm(900)}) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .contact-card {
    width: 100%;
    max-width: 810px;
  }
  .bug-bill-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    @media screen and (min-width: ${pxToEm(900)}) {
      margin: 0 96px 48px 96px;
    }
  }
  .p-tag-two {
    margin: 29px 0 23px 0;
  }
  .select {
    margin-top: 23px;
  }
  .input {
    margin-top: 35px;
  }
  .btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 66px;
  }
`;
const BugBill = () => {
  return (
    <DashboardContent>
      <BugBillStyle>
        <Card className="contact-card">
          <div className="bug-bill-content">
            <Typography
              className="p-tag-two"
              textColor="blue"
              weight={500}
              size={23}
            >
              Pay your bills in few minuites
            </Typography>
            <form>
              <div className="select">
                <Select
                  label="Payment Type"
                  options={["Service charge Fee"]}
                  name="Fee Type"
                />{" "}
              </div>
              <div className="input">
                <Input readOnly label="Amount" name="amount" />
              </div>
              <div className="input">
                <Input
                  readOnly
                  label="Outstanding Payment Balance"
                  name="amount"
                />
              </div>
              <div className="btn-container">
                <Button text="Next" />
              </div>
            </form>
          </div>
        </Card>
      </BugBillStyle>
    </DashboardContent>
  );
};

export default BugBill;
