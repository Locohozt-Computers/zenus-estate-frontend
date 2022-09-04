import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createEmergency, getAllEmergency } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { Button, Typography } from "components";
import { IconArrowLeft, IconEmergencyAdd, IconFire } from "assets/icons";
import { DashboardContent } from "layouts";
import { AppIcon } from "utils";
import { useFormik } from "formik";
import { GoPrimitiveDot } from "react-icons/go";
import { PostCreateEmergency } from "api";
import { VALIDATIONS } from "app-constants";
import * as yup from "yup";
import successImg from "assets/images/successEmergency.png";
import {
  ButtonStyle,
  DivContent,
  GoBack,
  Selections,
  TextArea,
  Wrapper,
} from "./style";

const getIcon = (icon: string) => {
  switch (icon) {
    case "fire":
      return <IconFire style={{ fontSize: 35, color: "var(--blue)" }} />;
    case "add new":
      return (
        <IconEmergencyAdd style={{ fontSize: 35, color: "var(--blue)" }} />
      );
    default:
      return <GoPrimitiveDot size={35} color="var(--blue)" />;
  }
};

enum CONST {
  Add = "Add New",
}

const addMore = {
  emergency_type_id: 2,
  description:
    "My name is Gbolagade Winner and i love to leave my footprint on every project i touch which is why am making my name reflect in test decription for CREATE EMERGENCIES",
  user_id: 1,
  branch_id: 1,
  updated_at: "2022-09-03T11:30:20.000000Z",
  created_at: "2022-09-03T11:30:20.000000Z",
  id: 12,
  emergency_type: {
    id: 2,
    name: "Add New",
    status: true,
    created_at: "2022-08-29T00:11:26.000000Z",
    updated_at: "2022-08-29T00:11:26.000000Z",
  },
};

const validationSchema = yup.object({
  type: yup.string().required(),
  description: VALIDATIONS.description.when("type", (type, field) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    type === "Add New" ? field.required("Description is required") : field
  ),
});

const ReportEmergencyPage = () => {
  const { isLoading, data } = useQuery(["getAllEmergency"], getAllEmergency);
  const mutation = useMutation(["createEmergency"], createEmergency);

  const [selected, setSelected] = useState<number | null>(null);

  const formik = useFormik({
    initialValues: { emergency_type_id: 0, description: "", type: "" },
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      mutation.mutate({
        description: values.description,
      });
    },
  });

  const handleSelection =
    (idx: number, d: typeof PostCreateEmergency["Res"]["data"]) => () => {
      setSelected(idx);
      if (d.emergency_type.name === CONST.Add) {
        formik.setFieldValue("type", d.emergency_type.name, true);
      }
    };

  return (
    <>
      <Loader absolute fill open={isLoading} />
      <DashboardContent>
        <form onSubmit={formik.handleSubmit}>
          <Wrapper aria-label="success page">
            {mutation.isSuccess ? (
              <DivContent>
                <GoBack
                  aria-label="go back to start"
                  onClick={() => mutation.reset()}
                >
                  <AppIcon size={40} render={IconArrowLeft} />
                  <Typography
                    variant="bodyBig"
                    textColor="gray"
                    style={{ marginLeft: 5 }}
                  >
                    Report Emergency
                  </Typography>
                </GoBack>
                <div className="center-contents flex-column text-center">
                  <img
                    style={{ maxWidth: 440, maxHeight: 332 }}
                    src={successImg}
                    alt=""
                  />
                  <Typography
                    style={{
                      maxWidth: 440,
                      marginTop: 10,
                    }}
                    variant="subtitle"
                    textColor="blue"
                  >
                    Thank you for informing us, we will come to your resque as
                    soon as possible.
                  </Typography>
                </div>
              </DivContent>
            ) : (
              <DivContent>
                <Typography variant="heading5" style={{ marginTop: 30 }}>
                  What type of emergency will you like to report?
                </Typography>
                <Selections>
                  {data &&
                    data.concat([addMore]).map((d, i: number) => {
                      const {
                        description,
                        emergency_type: { name, status, id },
                      } = d;
                      return (
                        <ButtonStyle
                          title={description}
                          active={i === selected}
                          key={id}
                          disabled={!status}
                          type="button"
                          onClick={handleSelection(i, d)}
                        >
                          <div>{getIcon(name)}</div>
                          <Typography variant="subtitle">{name}</Typography>
                        </ButtonStyle>
                      );
                    })}
                </Selections>
                <div style={{ marginTop: 50 }}>
                  {formik.values.type === CONST.Add && (
                    <TextArea
                      placeholder="Describe the emergency type here"
                      name="description"
                      rows={10}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                    />
                  )}
                </div>
                <div className="center-contents">
                  <Button
                    type="submit"
                    text={formik.values.type !== CONST.Add ? "Next" : "Send"}
                    disabled={!formik.isValid}
                  />
                </div>
              </DivContent>
            )}
          </Wrapper>
        </form>
      </DashboardContent>
    </>
  );
};

export default ReportEmergencyPage;
