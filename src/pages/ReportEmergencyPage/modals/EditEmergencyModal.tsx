import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FiX } from "react-icons/fi";
import { Button, Typography } from "components/atoms";
import { Select, TextArea } from "components/atoms/Input";
import { notification, netErrorHandler } from "services";
import {
  getAllEmergencyTypes,
  getMyEmergencies,
  updateEmergency,
} from "pages/request";
import { EmergencyI } from "api";
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
  emergency: EmergencyI | null;
  onClose: () => void;
};

const schema = yup.object({
  emergency_type_id: yup
    .number()
    .typeError("Select an emergency type")
    .required("Select an emergency type")
    .min(1, "Select an emergency type"),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(5, "Description is too short"),
});

export const EditEmergencyModal = ({ emergency, onClose }: Props) => {
  const queryClient = useQueryClient();
  const typesQuery = useQuery(
    [getAllEmergencyTypes.key],
    getAllEmergencyTypes,
    { staleTime: 60_000 }
  );

  const mutation = useMutation(
    ["updateEmergency", emergency?.id],
    emergency ? updateEmergency(emergency.id) : () => Promise.resolve(null),
    {
      onSuccess: () => {
        notification.success("Emergency updated");
        queryClient.invalidateQueries([getMyEmergencies.key]);
        onClose();
      },
      onError: (err: AxiosError) => {
        notification.error(netErrorHandler(err));
      },
    }
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      emergency_type_id: emergency?.emergency_type_id ?? 0,
      description: emergency?.description ?? "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (!emergency) return;
      mutation.mutate({
        emergency_type_id: Number(values.emergency_type_id),
        description: values.description,
      });
    },
  });

  const communityOptions =
    typesQuery.data?.community.map((t) => ({
      value: String(t.id),
      label: t.name,
    })) ?? [];

  return (
    <BottomSheet open={emergency !== null} onClose={onClose}>
      <SheetHandle />
      <SheetHeader>
        <SheetTitleGroup>
          <Typography variant="subtitle" weight={600}>
            Edit Emergency
          </Typography>
        </SheetTitleGroup>
        <SheetClose type="button" aria-label="Close" onClick={onClose}>
          <FiX size={18} />
        </SheetClose>
      </SheetHeader>
      <form onSubmit={formik.handleSubmit}>
        <SheetBody>
          <Select
            name="emergency_type_id"
            label="Emergency type"
            value={String(formik.values.emergency_type_id || "")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={communityOptions}
            loading={typesQuery.isLoading}
            error={
              (formik.touched.emergency_type_id &&
                formik.errors.emergency_type_id) ||
              undefined
            }
          />
          <TextArea
            name="description"
            placeholder="Describe the emergency"
            rows={6}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              (formik.touched.description && formik.errors.description) ||
              undefined
            }
          />
          <ModalActions>
            <Button
              type="button"
              secondary
              text="Cancel"
              onClick={onClose}
              disabled={mutation.isLoading}
            />
            <Button
              type="submit"
              text="Save changes"
              loading={mutation.isLoading}
              disabled={!formik.isValid}
            />
          </ModalActions>
        </SheetBody>
      </form>
    </BottomSheet>
  );
};
