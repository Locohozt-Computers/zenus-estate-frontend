import React, { ChangeEvent } from "react";
import { Button, Input, Typography } from "components/atoms";
import { Link } from "react-router-dom";
import styled from "styled-components/macro";
import { pxToEm } from "utils";

export const Form = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: ${pxToEm(50)} 0;
  gap: 50px;
`;

type CreateAccountT = {
  onUpdate?: (pos: number) => void;
};

const CreateAccount: React.FC<CreateAccountT> = ({ onUpdate }) => {
  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onUpdate) {
      onUpdate(1);
    }
  };
  return (
    <div style={{ width: "100%", maxWidth: 572 }}>
      <Typography.Heading variant="heading3">
        Create a ZENUS account
      </Typography.Heading>
      <Typography.Heading variant="bodyBig">
        Estate management made easy
      </Typography.Heading>
      <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <Input
          name="email"
          label="Enter email address"
          placeholder="hello@zenux.com"
        />
        <Input name="password" type="password" label="Password" />
        <div className="center-contents">
          <Button type="submit" text="Create Account" />
        </div>
      </Form>
      <Typography>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--blue)" }}>
          Login here
        </Link>
      </Typography>
    </div>
  );
};

export default CreateAccount;
