import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import { Button, Typography } from "components/atoms";
import { TextArea } from "components/atoms/Input";
import { Loader } from "components/atoms/Loader";
import {
  BottomSheet,
  SheetBody,
  SheetClose,
  SheetHandle,
  SheetHeader,
  SheetTitleGroup,
} from "components/molecules";
import { ROUTES } from "app-constants";
import { clientSelectors } from "store/reducers/client/clientSlice";
import {
  createSupportTicket,
  getSupportIssueTypes,
  getSupportTickets,
} from "pages/request";
import { SupportIssueTypeI, SupportTicketPriority } from "api";
import { notification } from "services";
import {
  ErrorText,
  FieldLabel,
  FormBlock,
  PrioritySelect,
  TextInput,
} from "./style";
import { IssueTypeIcon } from "./iconMap";
import { AttachmentPicker, validateAttachments } from "./AttachmentPicker";

const validationSchema = yup.object({
  issue_type_id: yup
    .number()
    .min(1, "Please pick a category")
    .required("Please pick a category"),
  subject: yup
    .string()
    .trim()
    .max(255, "Subject must be 255 characters or fewer")
    .required("Subject is required"),
  description: yup
    .string()
    .trim()
    .min(5, "Please add more detail")
    .required("Description is required"),
  priority: yup
    .mixed<SupportTicketPriority>()
    .oneOf(["low", "medium", "high"])
    .required(),
});

export const RaiseTicketTab = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const selectedProperty = useSelector(clientSelectors.selectedProperty);

  const typesQuery = useQuery([getSupportIssueTypes.key], getSupportIssueTypes);

  const [selected, setSelected] = useState<SupportIssueTypeI | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);

  const attachmentChecks = validateAttachments(images, attachments);
  const hasAttachmentErrors =
    attachmentChecks.imageErrors.some(Boolean) ||
    attachmentChecks.attachmentErrors.some(Boolean) ||
    !!attachmentChecks.globalError;

  const mutation = useMutation(createSupportTicket, {
    onSuccess: (ticket) => {
      notification.success("Ticket raised successfully");
      queryClient.invalidateQueries([getSupportTickets.key]);
      navigate(
        ROUTES.reportIssueDetail.fullPath.replace(":id", String(ticket.id))
      );
    },
  });

  const formik = useFormik({
    initialValues: {
      issue_type_id: 0,
      subject: "",
      description: "",
      priority: "medium" as SupportTicketPriority,
    },
    validationSchema,
    onSubmit: (values) => {
      if (hasAttachmentErrors) return;
      mutation.mutate({
        issue_type_id: values.issue_type_id,
        subject: values.subject.trim(),
        description: values.description.trim(),
        priority: values.priority,
        customer_id: selectedProperty?.id,
        images,
        attachments,
      });
    },
  });

  const activeTypes =
    typesQuery.data?.filter((t) => t.is_active !== false) ?? [];

  const handlePickCategory = (id: number) => {
    const t = activeTypes.find((x) => x.id === id);
    if (!t) return;
    setSelected(t);
    formik.setValues({
      issue_type_id: t.id,
      subject: "",
      description: "",
      priority: t.default_priority || "medium",
    });
    setImages([]);
    setAttachments([]);
  };

  const closeSheet = () => {
    setSelected(null);
    formik.resetForm();
    setImages([]);
    setAttachments([]);
    mutation.reset();
  };

  return (
    <div style={{ position: "relative", minHeight: 200 }}>
      <Loader absolute open={typesQuery.isLoading} />

      <Typography variant="heading5">
        What kind of issue do you want to report?
      </Typography>

      <div style={{ marginTop: 16, maxWidth: 480 }}>
        <FieldLabel htmlFor="issue_type_id">Choose a category</FieldLabel>
        <PrioritySelect
          id="issue_type_id"
          name="issue_type_id"
          value={selected?.id ?? ""}
          onChange={(e) => handlePickCategory(Number(e.target.value))}
        >
          <option value="" disabled>
            {typesQuery.isLoading
              ? "Loading categories…"
              : "Select an issue category"}
          </option>
          {activeTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </PrioritySelect>
      </div>

      {!typesQuery.isLoading && activeTypes.length === 0 && (
        <Typography
          size={13}
          textColor="gray"
          style={{ marginTop: 16, display: "block" }}
        >
          No issue categories are configured yet. Please contact the estate
          admin.
        </Typography>
      )}

      <BottomSheet open={!!selected} onClose={closeSheet}>
        <SheetHandle />
        {selected && (
          <form onSubmit={formik.handleSubmit}>
            <SheetHeader>
              <SheetTitleGroup>
                <IssueTypeIcon
                  icon={selected.icon}
                  color={selected.color || undefined}
                  size={22}
                />
                <Typography variant="subtitle" weight={600}>
                  {selected.name}
                </Typography>
              </SheetTitleGroup>
              <SheetClose type="button" aria-label="Close" onClick={closeSheet}>
                <FiX size={18} />
              </SheetClose>
            </SheetHeader>
            <SheetBody>
              <FormBlock>
                <div>
                  <FieldLabel htmlFor="subject">Subject</FieldLabel>
                  <TextInput
                    id="subject"
                    name="subject"
                    placeholder="Short summary"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    maxLength={255}
                  />
                  {formik.touched.subject && formik.errors.subject && (
                    <ErrorText>{formik.errors.subject}</ErrorText>
                  )}
                </div>

                <div>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <TextArea
                    id="description"
                    name="description"
                    rows={5}
                    placeholder="Tell us what's happening, when it started, and anything we should know."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      (formik.touched.description &&
                        formik.errors.description) ||
                      undefined
                    }
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="priority">Priority</FieldLabel>
                  <PrioritySelect
                    id="priority"
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </PrioritySelect>
                </div>

                <div>
                  <FieldLabel>Attachments</FieldLabel>
                  <AttachmentPicker
                    images={images}
                    attachments={attachments}
                    onImagesChange={setImages}
                    onAttachmentsChange={setAttachments}
                    imageErrors={attachmentChecks.imageErrors}
                    attachmentErrors={attachmentChecks.attachmentErrors}
                    globalError={attachmentChecks.globalError}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 8,
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    type="button"
                    secondary
                    text="Cancel"
                    onClick={closeSheet}
                  />
                  <Button
                    type="submit"
                    text="Submit ticket"
                    loading={mutation.isLoading}
                    disabled={
                      !formik.isValid ||
                      hasAttachmentErrors ||
                      mutation.isLoading ||
                      !formik.values.subject.trim() ||
                      !formik.values.description.trim()
                    }
                  />
                </div>
              </FormBlock>
            </SheetBody>
          </form>
        )}
      </BottomSheet>
    </div>
  );
};
