import React from "react";
import { Button, Card, Select, Typography } from "components";
import { TextArea } from "pages/ReportEmergencyPage/style";
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
  .complaints-select {
    margin: 25px 0 29px 0;
  }
  .btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 35px;
  }
`;
const ContactAdminPage = () => {
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
            >
              Contact admin
            </Typography>
            <Typography
              className="p-tag-two"
              textColor="blue"
              weight={500}
              size={23}
            >
              Got a problem? Send us a message immediately
            </Typography>
            <Typography className="" textColor="med-gray" weight={400}>
              We’ll reply you as soon as possible.
            </Typography>

            <div>
              <div className="complaints-select">
                <Select
                  label="Complaints Category"
                  options={["Payment Issues"]}
                  name="Complaints Category"
                />{" "}
              </div>
              <TextArea
                placeholder="Describe the emergency type here"
                name="description"
                rows={10}
              />
              <div className="btn-container">
                <Button text="Send" />
              </div>
            </div>
          </div>
        </Card>
      </ContactAdminStyle>
    </DashboardContent>
  );
};

export default ContactAdminPage;
