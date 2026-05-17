import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FiX } from "react-icons/fi";
import { Button, Typography } from "components/atoms";
import { notification, netErrorHandler } from "services";
import { deleteEmergency, getMyEmergencies } from "pages/request";
import {
  BottomSheet,
  SheetBody,
  SheetClose,
  SheetHandle,
  SheetHeader,
  SheetTitleGroup,
} from "components/molecules";
import { ModalActions } from "../style";

type Props = {
  emergencyId: number | null;
  onClose: () => void;
};

export const DeleteConfirmModal = ({ emergencyId, onClose }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    ["deleteEmergency", emergencyId],
    emergencyId ? deleteEmergency(emergencyId) : () => Promise.resolve(null),
    {
      onSuccess: () => {
        notification.success("Emergency deleted");
        queryClient.invalidateQueries([getMyEmergencies.key]);
        onClose();
      },
      onError: (err: AxiosError) => {
        notification.error(netErrorHandler(err));
      },
    }
  );

  return (
    <BottomSheet open={emergencyId !== null} onClose={onClose}>
      <SheetHandle />
      <SheetHeader>
        <SheetTitleGroup>
          <Typography variant="subtitle" weight={600}>
            Delete this emergency?
          </Typography>
        </SheetTitleGroup>
        <SheetClose type="button" aria-label="Close" onClick={onClose}>
          <FiX size={18} />
        </SheetClose>
      </SheetHeader>
      <SheetBody>
        <Typography variant="bodySmall" textColor="gray">
          This action cannot be undone. The record will be permanently removed.
        </Typography>
        <ModalActions>
          <Button
            secondary
            text="Cancel"
            onClick={onClose}
            disabled={mutation.isLoading}
          />
          <Button
            text="Delete"
            loading={mutation.isLoading}
            onClick={() => mutation.mutate()}
          />
        </ModalActions>
      </SheetBody>
    </BottomSheet>
  );
};
