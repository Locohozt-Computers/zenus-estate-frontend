import React, { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components/macro";
import { Modal } from "components/atoms/Modal";
import { Button, Card, Typography } from "components/atoms";
import { notification } from "services";
import { changePin } from "./requests";

const PinWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 16px 0 24px;
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

const Label = styled.p`
  font-size: 13px;
  color: var(--gray);
  text-align: left;
  margin-bottom: 4px;
`;

type RefsType = [
  React.RefObject<HTMLInputElement>,
  React.RefObject<HTMLInputElement>,
  React.RefObject<HTMLInputElement>,
  React.RefObject<HTMLInputElement>
];

const PinGroup = ({
  label,
  digits,
  refs,
  onChange,
  onKeyDown,
}: {
  label: string;
  digits: string[];
  refs: RefsType;
  onChange: (i: number, v: string) => void;
  onKeyDown: (i: number, e: React.KeyboardEvent) => void;
}) => (
  <div>
    <Label>{label}</Label>
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
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
        />
      ))}
    </PinWrapper>
  </div>
);

export const ChangePinModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [currentDigits, setCurrentDigits] = useState(["", "", "", ""]);
  const [newDigits, setNewDigits] = useState(["", "", "", ""]);

  const currentRefs: RefsType = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const newRefs: RefsType = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const { mutate, isLoading } = useMutation(changePin);

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    refs: RefsType,
    index: number,
    value: string
  ) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setter((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    digits: string[],
    refs: RefsType,
    index: number,
    e: React.KeyboardEvent
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handleSubmit = () => {
    const currentPin = parseInt(currentDigits.join(""), 10);
    const newPin = parseInt(newDigits.join(""), 10);
    if (
      currentDigits.some((d) => d === "") ||
      newDigits.some((d) => d === "")
    ) {
      notification.error("Please fill in all PIN digits");
      return;
    }
    mutate(
      { current_pin: currentPin, new_pin: newPin },
      {
        onSuccess: (res) => {
          notification.success(res?.message || "PIN changed successfully");
          onClose();
        },
      }
    );
  };

  return (
    <Modal visible={visible} closeModal={onClose} maxWidth={380}>
      <Card style={{ padding: "32px 24px", textAlign: "center" }}>
        <Typography variant="bodyBig" weight={700} textColor="blue">
          Change PIN
        </Typography>
        <PinGroup
          label="Current PIN"
          digits={currentDigits}
          refs={currentRefs}
          onChange={(i, v) => handleChange(setCurrentDigits, currentRefs, i, v)}
          onKeyDown={(i, e) => handleKeyDown(currentDigits, currentRefs, i, e)}
        />
        <PinGroup
          label="New PIN"
          digits={newDigits}
          refs={newRefs}
          onChange={(i, v) => handleChange(setNewDigits, newRefs, i, v)}
          onKeyDown={(i, e) => handleKeyDown(newDigits, newRefs, i, e)}
        />
        <Button
          text="Change PIN"
          loading={isLoading}
          onClick={handleSubmit}
          style={{ width: "100%", marginTop: 8 }}
        />
      </Card>
    </Modal>
  );
};
