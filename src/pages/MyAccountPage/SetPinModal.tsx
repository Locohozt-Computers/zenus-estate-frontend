import React, { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { Modal } from "components/atoms/Modal";
import { Button, Card, Typography } from "components/atoms";
import { authActions } from "store/reducers/auth/authDocSlice";
import { notification } from "services";
import { setPin } from "./requests";

const PinWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 24px 0;
`;

const PinInput = styled.input`
  width: 52px;
  height: 60px;
  border: 2px solid var(--gray-3);
  border-radius: 10px;
  font-size: 24px;
  text-align: center;
  outline: none;
  background: transparent;
  color: var(--blue);
  caret-color: transparent;

  &:focus {
    border-color: var(--blue);
  }
`;

export const SetPinModal = ({ visible }: { visible: boolean }) => {
  const dispatch = useDispatch();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const { mutate, isLoading } = useMutation(setPin);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handleSubmit = () => {
    const pin = parseInt(digits.join(""), 10);
    if (digits.some((d) => d === "") || Number.isNaN(pin)) {
      notification.error("Please enter a 4-digit PIN");
      return;
    }
    mutate(
      { pin },
      {
        onSuccess: (res) => {
          notification.success(res?.message || "PIN set successfully");
          dispatch(authActions.setPinIsSet(true));
        },
      }
    );
  };

  return (
    <Modal
      visible={visible}
      showCloseBtn={false}
      disableOutsideClick
      maxWidth={300}
    >
      <Card style={{ padding: "24px 20px", textAlign: "center" }}>
        <Typography variant="bodyBig" weight={700} textColor="blue">
          Set Your PIN
        </Typography>
        <Typography textColor="gray" size={13} style={{ marginTop: 6 }}>
          Create a 4-digit PIN to secure your account
        </Typography>
        <PinWrapper>
          {digits.map((digit, i) => (
            <PinInput
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              ref={refs[i]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </PinWrapper>
        <Button
          text="Set PIN"
          loading={isLoading}
          onClick={handleSubmit}
          style={{
            width: "auto",
            padding: "10px 40px",
            margin: "0 auto",
            display: "block",
          }}
        />
      </Card>
    </Modal>
  );
};
