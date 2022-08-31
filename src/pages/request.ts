import appRequest, { GetAllEmergencies, GetLandlordProfile } from "api";

export const getLandlordsProfile = async () => {
  return appRequest.get<typeof GetLandlordProfile.Res>(
    GetLandlordProfile.Route
  );
};

export const getAllEmergency = async () => {
  return appRequest.get<typeof GetAllEmergencies.Res>(GetAllEmergencies.Route);
};
