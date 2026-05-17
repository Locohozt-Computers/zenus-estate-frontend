import React from "react";
import { Button, Card, Modal, Typography } from "components/atoms";
import { PollOptionI } from "api";
import { SelectedChip } from "./style";

interface Props {
  visible: boolean;
  alreadyVoted: boolean;
  options: PollOptionI[];
  onClose: () => void;
}

export const VoteSuccessModal = ({
  visible,
  alreadyVoted,
  options,
  onClose,
}: Props) => {
  return (
    <Modal
      visible={visible}
      maxWidth={520}
      showCloseBtn={false}
      closeModal={onClose}
      disableOutsideClick
    >
      <Card style={{ padding: "32px 28px", textAlign: "center" }}>
        <Typography
          variant="heading4"
          content={alreadyVoted ? "Vote already recorded" : "Vote recorded"}
          style={{ marginBottom: 10 }}
        />
        <Typography size={14} textColor="gray" style={{ marginBottom: 18 }}>
          {alreadyVoted
            ? "Your previous choice is shown below."
            : "Thanks for voting. Your choice has been saved."}
        </Typography>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          {options.map((o) => (
            <SelectedChip key={o.id}>{o.label}</SelectedChip>
          ))}
        </div>
        <Button text="Close" onClick={onClose} />
      </Card>
    </Modal>
  );
};
