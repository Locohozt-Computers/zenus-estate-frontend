import React from "react";
import { Button, Card, Select, Typography } from "components";
import { DashboardContent } from "layouts";
import styled from "styled-components/macro";
import { pxToEm } from "utils";

const ContactAdminStyle = styled.div`
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
  .contact-admin-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    @media screen and (min-width: ${pxToEm(900)}) {
      margin: 0 96px 48px 96px;
    }
  }
  .p-tag-one {
    margin-top: 61px;
  }
  .p-tag-two {
    margin: 29px 0 19px 0;
  }
  .select {
    margin: 44px 0 44px 0;
  }
  .btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 105px;
  }
`;

const PrintReceiptPage = () => {
  return (
    <DashboardContent>
      <ContactAdminStyle>
        <Card className="contact-card">
          <div className="contact-admin-content">
            <Typography
              className="p-tag-one"
              textColor="black"
              weight={400}
              color="#131313"
              size={16}
            >
              Print receipts
            </Typography>
            <Typography
              className="p-tag-two"
              textColor="blue"
              weight={500}
              size={23}
            >
              Print receipts for previously paid fees
            </Typography>
            <form>
              <div className="select">
                <Select
                  label="Fee Type"
                  options={["Service charge Fee"]}
                  name="Fee Type"
                />{" "}
              </div>
              <div className="select">
                <Select
                  label="Select Receipt"
                  options={["Service Fee 2022"]}
                  name="Fee Type"
                />{" "}
              </div>
              <div className="btn-container">
                <Button text="Print Receipt" />
              </div>
            </form>
          </div>
        </Card>
      </ContactAdminStyle>
    </DashboardContent>
  );
};

export default PrintReceiptPage;
