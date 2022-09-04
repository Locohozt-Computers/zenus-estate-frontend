import appRequest, {
  GetAllEmergencies,
  GetLandlordProfile,
  GetOustandingBalance,
} from "api";

export const getLandlordsProfile = async () => {
  return appRequest.get<typeof GetLandlordProfile.Res>(
    GetLandlordProfile.Route
  );
};

export const getAllEmergency = async () => {
  return appRequest.get<typeof GetAllEmergencies.Res>(GetAllEmergencies.Route);
};

export const getOustandingBalance = async () => {
  return appRequest.get<typeof GetOustandingBalance.Res>(
    GetOustandingBalance.Route
  );
};
