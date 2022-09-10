import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createEmergency, getAllEmergencyTypes } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { Button, TextArea, Typography } from "components";
import {
  IconArrowLeft,
  IconEmergencyAdd,
  IconFire,
  IconFlood,
} from "assets/icons";
import { DashboardContent } from "layouts";
import { AppIcon } from "utils";
import { useFormik } from "formik";
import { GoPrimitiveDot } from "react-icons/go";
import { EmergencyTypesI, EmergencyTypesStatusEnum } from "api";
import { VALIDATIONS } from "app-constants";
import * as yup from "yup";
import successImg from "assets/images/successEmergency.png";
import { ButtonStyle, DivContent, GoBack, Selections, Wrapper } from "./style";

const getIcon = (icon: string) => {
  switch (icon) {
    case EmergencyTypesStatusEnum.Fire:
      return (
        <AppIcon render={IconFire} size={35} style={{ color: "var(--blue)" }} />
      );
    case EmergencyTypesStatusEnum.Flood:
      return (
        <AppIcon
          render={IconFlood}
          size={35}
          style={{ color: "var(--blue)" }}
        />
      );
    case EmergencyTypesStatusEnum.Add:
      return (
        <AppIcon
          render={IconEmergencyAdd}
          size={35}
          style={{ color: "var(--blue)" }}
        />
      );
    default:
      return <GoPrimitiveDot size={35} color="var(--blue)" />;
  }
};

const addMore = {
  status: true,
  name: EmergencyTypesStatusEnum.Add,
} as EmergencyTypesI;

const validationSchema = yup.object({
  type: yup.string().required(),
  description: VALIDATIONS.description.when(
    "type",
    (field, originalFieldProp) =>
      field === EmergencyTypesStatusEnum.Add
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          originalFieldProp.required("Description is required")
        : originalFieldProp
  ),
});

const ReportEmergencyPage = () => {
  const { isLoading, data } = useQuery(
    ["getAllEmergencyTypes"],
    getAllEmergencyTypes
  );

  const mutation = useMutation(["createEmergency"], createEmergency);

  const [selected, setSelected] = useState<number | null>(null);

  const formik = useFormik({
    initialValues: { emergency_type_id: 0, description: "", type: "" },
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      if (values.type !== EmergencyTypesStatusEnum.Add) {
        mutation.mutate({
          emergency_type_id: values.emergency_type_id,
        });
      } else {
        mutation.mutate({
          description: values.description,
        });
      }
    },
  });

  const handleReset = () => {
    setSelected(null);
    formik.resetForm();
    formik.validateForm();
    mutation.reset();
  };

  const handleSelection = (idx: number, d: EmergencyTypesI) => () => {
    setSelected(idx);
    formik.setFieldValue("type", d.name, true);
    formik.setFieldValue("emergency_type_id", d.id, true);
    formik.handleBlur({ emergency_type_id: d.id, type: d.name });
  };

  return (
    <>
      <Loader absolute fill open={isLoading} />
      <DashboardContent>
        <form onSubmit={formik.handleSubmit}>
          <Wrapper aria-label="success page">
            {mutation.isSuccess ? (
              <DivContent>
                <GoBack aria-label="go back to start" onClick={handleReset}>
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
                      const { name, status } = d;
                      return (
                        <ButtonStyle
                          key={`${i.toString()}`}
                          active={i === selected}
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
                  {formik.values.type === EmergencyTypesStatusEnum.Add && (
                    <>
                      <TextArea
                        placeholder="Describe the emergency type here"
                        name="description"
                        rows={10}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.description &&
                        formik.touched.description && (
                          <small style={{ color: "var(--pink)" }}>
                            {formik.errors.description}
                          </small>
                        )}
                    </>
                  )}
                </div>
                <div className="center-contents">
                  <Button
                    type="submit"
                    loading={mutation.isLoading}
                    text={
                      formik.values.type !== EmergencyTypesStatusEnum.Add
                        ? "Next"
                        : "Send"
                    }
                    disabled={!formik.dirty && !formik.isValid}
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
