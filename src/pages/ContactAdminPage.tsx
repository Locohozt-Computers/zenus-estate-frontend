import React, { useMemo } from "react";
import {
  Button,
  Card,
  FormikSelect,
  Typography,
  FormikTextArea,
} from "components";
import { DashboardContent } from "layouts";
import styled from "styled-components/macro";
import { pxToEm } from "utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";
import { VALIDATIONS } from "app-constants";
import { notification } from "services";
import { getComplaints, postComplaint } from "./request";

const validationSchema = yup.object({
  complaint_category_id: VALIDATIONS.complaintCategory,
  description: VALIDATIONS.description.required("Description is required"),
});

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
  const { data: categories, isLoading } = useQuery(
    ["getComplaints"],
    getComplaints
  );
  const { mutate, isLoading: isSubmitting } = useMutation(postComplaint);

  const categoriesOption = useMemo(() => {
    if (categories) {
      return categories.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [categories]);

  const formik = useFormik({
    initialValues: {
      complaint_category_id: undefined,
      description: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutate(
        {
          ...values,
          complaint_category_id:
            values.complaint_category_id as unknown as number,
        },
        {
          onSuccess: (r) => {
            notification.success(r.message || "Success");
          },
        }
      );
    },
  });

  return (
    <DashboardContent>
      <ContactAdminStyle>
        <Card className="contact-card">
          <div className="contact-admin-content">
            <Typography className="p-tag-one" textColor="black">
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
            <Typography className="" textColor="med-gray">
              We’ll reply you as soon as possible.
            </Typography>

            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit}>
                <div className="complaints-select">
                  <FormikSelect
                    label="Complaints Category"
                    options={categoriesOption}
                    name="complaint_category_id"
                    loading={isLoading}
                  />
                </div>
                <FormikTextArea
                  placeholder="Describe the emergency type here"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  rows={10}
                />
                <div className="btn-container">
                  <Button type="submit" text="Send" loading={isSubmitting} />
                </div>
              </form>
            </FormikProvider>
          </div>
        </Card>
      </ContactAdminStyle>
    </DashboardContent>
  );
};

export default ContactAdminPage;
