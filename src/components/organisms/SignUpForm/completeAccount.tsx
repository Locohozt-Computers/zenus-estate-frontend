import React, { ChangeEvent, useState } from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  Select,
  Typography,
} from "components/atoms";
import { Form } from "components/organisms/SignUpForm/createAccount";
import styled from "styled-components/macro";

type CompleteAccountT = {
  onUpdate?: (pos: number) => void;
  status?: (verify: boolean) => void;
  // status?: boolean;
  // check?: boolean;
};

const CompleteAccountStyle = styled.div`
  width: 100%;
  max-width: 678px;
  .completed-card {
    width: 100%;
    padding: 100px;
    //max-width: 480px;
  }
`;

const CompleteAccount: React.FC<CompleteAccountT> = ({ onUpdate, status }) => {
  const [visible, setVisible] = useState(false);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onUpdate && status) {
      onUpdate(0);
      status(true);
    }
  };
  const handleClick = () => {
    setVisible(!visible);
  };

  return (
    <CompleteAccountStyle>
      <Typography.Heading size={39} variant="heading3">
        Complete your account setup
      </Typography.Heading>
      <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <Input
          name="email"
          label="Enter your full name *"
          placeholder="ZENUX ABUBAKAR"
        />
        <Select
          options={[]}
          name="email"
          label="Select your apartment number *"
          placeholder="ZENUX ABUBAKAR"
        />
        <Input name="upload" type="file" label="Upload your picture" />
        <div className="center-contents">
          <Button type="submit" text="Complete Setup" onClick={handleClick} />
        </div>
      </Form>
      <Modal maxWidth={620} visible={visible}>
        <Card
          style={{
            padding: "50px 70px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography.Heading
            size={28}
            style={{ marginBottom: 18 }}
            variant="heading3"
          >
            Completed!
          </Typography.Heading>
          <Typography style={{ marginBottom: 18, textAlign: "center" }}>
            Your details has been recorded, it will appear on your dashboard
            after admin’s approval.
          </Typography>
          <div>
            <Button
              type="submit"
              text="Okay"
              onClick={() => setVisible(false)}
              className="modal-btn"
              style={{ marginTop: 70 }}
            />
          </div>
        </Card>
      </Modal>
    </CompleteAccountStyle>
  );
};

export default CompleteAccount;
