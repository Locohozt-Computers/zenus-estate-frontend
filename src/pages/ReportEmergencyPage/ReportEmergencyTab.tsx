import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Button, Typography } from "components/atoms";
import { TextArea } from "components/atoms/Input";
import { Loader } from "components/atoms/Loader";
import { FiCheckCircle, FiMapPin, FiPhoneCall, FiX } from "react-icons/fi";
import { notification, netErrorHandler } from "services";
import {
  createEmergency,
  getAllEmergencyTypes,
  getMyEmergencies,
} from "pages/request";
import {
  CommunityEmergencyTypeI,
  EmergencyCategory,
  EmergencyLocationI,
  HotlineEmergencyTypeI,
} from "api";
import successImg from "assets/images/successEmergency.png";
import {
  BottomSheet,
  SheetBody,
  SheetClose,
  SheetHandle,
  SheetHeader,
  SheetTitleGroup,
} from "components/molecules";
import {
  ButtonStyle,
  CategoryHeading,
  CategoryPill,
  CategoryPills,
  CheckRow,
  HotlineBadge,
  LocationStatus,
  Selections,
} from "./style";
import { EmergencyIcon } from "./iconMap";

const formatPhoneForTel = (raw: string) => {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return `${plus}${trimmed.replace(/[^\d]/g, "")}`;
};

const dialHotline = (phone: string) => {
  window.location.href = `tel:${formatPhoneForTel(phone)}`;
};

const tryGetLocation = (): Promise<EmergencyLocationI | null> =>
  new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );
  });

type Props = {
  onViewMyEmergencies: () => void;
};

const validationSchema = yup.object({
  emergency_type_id: yup
    .number()
    .typeError("Please pick an emergency type")
    .min(1, "Please pick an emergency type")
    .required("Please pick an emergency type"),
  description: yup
    .string()
    .trim()
    .required("Description is required")
    .min(5, "Description is too short"),
  additional_info: yup.string().when("requires_additional_info", {
    is: true,
    then: (s) => s.trim().required("Additional info is required"),
  }),
  requires_additional_info: yup.boolean(),
  broadcast_to_community: yup.boolean(),
});

export const ReportEmergencyTab = ({ onViewMyEmergencies }: Props) => {
  const queryClient = useQueryClient();
  const typesQuery = useQuery([getAllEmergencyTypes.key], getAllEmergencyTypes);

  const [selected, setSelected] = useState<CommunityEmergencyTypeI | null>(
    null
  );
  const [category, setCategory] = useState<EmergencyCategory>("community");
  const [location, setLocation] = useState<EmergencyLocationI | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  const mutation = useMutation(["createEmergency"], createEmergency, {
    onSuccess: () => {
      notification.success("Emergency reported");
      queryClient.invalidateQueries([getMyEmergencies.key]);
    },
    onError: (err: AxiosError) => {
      notification.error(netErrorHandler(err));
    },
  });

  const formik = useFormik({
    initialValues: {
      emergency_type_id: 0,
      description: "",
      additional_info: "",
      requires_additional_info: false,
      broadcast_to_community: false,
    },
    validationSchema,
    enableReinitialize: false,
    onSubmit: (values) => {
      const body: Parameters<typeof createEmergency>[0] = {
        emergency_type_id: values.emergency_type_id,
        description: values.description.trim(),
      };
      if (selected?.requires_additional_info && values.additional_info) {
        body.additional_info = values.additional_info.trim();
      }
      if (selected?.allows_broadcast) {
        body.broadcast_to_community = values.broadcast_to_community;
      }
      if (location) {
        body.location = location;
      }
      mutation.mutate(body);
    },
  });

  const handleSelectCommunity = async (type: CommunityEmergencyTypeI) => {
    setSelected(type);
    setLocation(null);
    setLocationDenied(false);
    formik.setValues({
      emergency_type_id: type.id,
      description: "",
      additional_info: "",
      requires_additional_info: !!type.requires_additional_info,
      broadcast_to_community: false,
    });
    const loc = await tryGetLocation();
    if (loc) setLocation(loc);
    else setLocationDenied(true);
  };

  const handleSelectHotline = (type: HotlineEmergencyTypeI) => {
    if (type.phone_number) dialHotline(type.phone_number);
  };

  const handleReset = () => {
    setSelected(null);
    setLocation(null);
    setLocationDenied(false);
    formik.resetForm();
    mutation.reset();
  };

  const data = typesQuery.data;
  const sheetOpen = !!selected || mutation.isSuccess;

  return (
    <>
      <Loader absolute open={typesQuery.isLoading} />

      <Typography variant="heading5">
        What type of emergency do you want to report?
      </Typography>

      <CategoryPills role="tablist">
        <CategoryPill
          type="button"
          role="tab"
          aria-selected={category === "community"}
          active={category === "community"}
          onClick={() => setCategory("community")}
        >
          Community
        </CategoryPill>
        <CategoryPill
          type="button"
          role="tab"
          aria-selected={category === "national"}
          active={category === "national"}
          onClick={() => setCategory("national")}
        >
          National Hotlines
        </CategoryPill>
        <CategoryPill
          type="button"
          role="tab"
          aria-selected={category === "state"}
          active={category === "state"}
          onClick={() => setCategory("state")}
        >
          State Hotlines
        </CategoryPill>
      </CategoryPills>

      {category === "community" && (
        <>
          <CategoryHeading>
            <Typography size={12} textColor="gray">
              Sends an in-app alert to estate security
            </Typography>
          </CategoryHeading>
          <Selections>
            {data?.community?.map((type) => (
              <ButtonStyle
                key={type.id}
                type="button"
                accent={type.color}
                active={selected?.id === type.id}
                onClick={() => {
                  handleSelectCommunity(type).catch(() => undefined);
                }}
              >
                <EmergencyIcon icon={type.icon} color={type.color} size={26} />
                <Typography variant="subtitle" weight={600}>
                  {type.name}
                </Typography>
                <Typography size={12} textColor="gray">
                  {type.description}
                </Typography>
              </ButtonStyle>
            ))}
          </Selections>
        </>
      )}

      {category === "national" && (
        <>
          <CategoryHeading>
            <Typography size={12} textColor="gray">
              Tap to dial
            </Typography>
          </CategoryHeading>
          <Selections>
            {data?.national?.map((type) => (
              <ButtonStyle
                key={type.id}
                type="button"
                accent={type.color}
                onClick={() => handleSelectHotline(type)}
              >
                <EmergencyIcon icon={type.icon} color={type.color} size={26} />
                <Typography variant="subtitle" weight={600}>
                  {type.name}
                </Typography>
                <Typography size={12} textColor="gray">
                  {type.description}
                </Typography>
                {type.phone_number && (
                  <HotlineBadge>
                    <FiPhoneCall size={12} /> {type.phone_number}
                  </HotlineBadge>
                )}
              </ButtonStyle>
            ))}
          </Selections>
        </>
      )}

      {category === "state" && (
        <>
          <CategoryHeading>
            <Typography size={12} textColor="gray">
              Tap to dial
            </Typography>
          </CategoryHeading>
          <Selections>
            {data?.state?.map((type) => (
              <ButtonStyle
                key={type.id}
                type="button"
                accent={type.color}
                onClick={() => handleSelectHotline(type)}
              >
                <EmergencyIcon icon={type.icon} color={type.color} size={26} />
                <Typography variant="subtitle" weight={600}>
                  {type.name}
                </Typography>
                <Typography size={12} textColor="gray">
                  {type.description}
                </Typography>
                {type.phone_number && (
                  <HotlineBadge>
                    <FiPhoneCall size={12} /> {type.phone_number}
                  </HotlineBadge>
                )}
              </ButtonStyle>
            ))}
          </Selections>
        </>
      )}

      <BottomSheet open={sheetOpen} onClose={handleReset}>
        <SheetHandle />
        {mutation.isSuccess ? (
          <>
            <SheetHeader>
              <SheetTitleGroup>
                <Typography variant="subtitle" weight={600}>
                  Emergency sent
                </Typography>
              </SheetTitleGroup>
              <SheetClose
                type="button"
                aria-label="Close"
                onClick={handleReset}
              >
                <FiX size={18} />
              </SheetClose>
            </SheetHeader>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 16,
                padding: "8px 0 4px",
              }}
            >
              <img
                style={{ maxWidth: 260, width: "100%" }}
                src={successImg}
                alt=""
              />
              <Typography variant="subtitle" textColor="blue">
                Thank you for informing us, help is on the way.
              </Typography>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="button"
                  secondary
                  text="Report another"
                  onClick={handleReset}
                />
                <Button
                  type="button"
                  text="View my emergencies"
                  onClick={onViewMyEmergencies}
                />
              </div>
            </div>
          </>
        ) : (
          selected && (
            <form onSubmit={formik.handleSubmit}>
              <SheetHeader>
                <SheetTitleGroup>
                  <EmergencyIcon
                    icon={selected.icon}
                    color={selected.color}
                    size={22}
                  />
                  <Typography variant="subtitle" weight={600}>
                    {selected.name}
                  </Typography>
                </SheetTitleGroup>
                <SheetClose
                  type="button"
                  aria-label="Close"
                  onClick={handleReset}
                >
                  <FiX size={18} />
                </SheetClose>
              </SheetHeader>
              <SheetBody>
                <TextArea
                  name="description"
                  placeholder="Describe what's happening"
                  rows={5}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    (formik.touched.description && formik.errors.description) ||
                    undefined
                  }
                />

                {selected.requires_additional_info && (
                  <TextArea
                    name="additional_info"
                    placeholder="Any additional info (people involved, exact location, etc.)"
                    rows={3}
                    value={formik.values.additional_info}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      (formik.touched.additional_info &&
                        formik.errors.additional_info) ||
                      undefined
                    }
                  />
                )}

                {selected.allows_broadcast && (
                  <CheckRow>
                    <input
                      type="checkbox"
                      name="broadcast_to_community"
                      checked={formik.values.broadcast_to_community}
                      onChange={formik.handleChange}
                    />
                    Broadcast this alert to the rest of the community
                  </CheckRow>
                )}

                <LocationStatus ok={!!location}>
                  {location ? (
                    <>
                      <FiCheckCircle size={14} /> Location captured
                    </>
                  ) : (
                    <>
                      <FiMapPin size={14} />{" "}
                      {locationDenied
                        ? "Location unavailable — emergency will be sent without coordinates"
                        : "Capturing your location..."}
                    </>
                  )}
                </LocationStatus>

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
                    onClick={handleReset}
                  />
                  <Button
                    type="submit"
                    text="Send emergency"
                    loading={mutation.isLoading}
                    disabled={!formik.isValid || mutation.isLoading}
                  />
                </div>
              </SheetBody>
            </form>
          )
        )}
      </BottomSheet>
    </>
  );
};
