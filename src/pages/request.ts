import appRequest, {
  DelEmergency,
  GetAllEmergencies,
  GetAllEmergenciesTypes,
  GetLandlordProfile,
  GetProfile,
  GetAllPaymentType,
  GetPaymentMethod,
  PostCreateEmergency,
  GetOutstandingBalance,
  PutUpdateEmergency,
} from "api";

export const getUserProfile = async () => {
  const res = await appRequest.get<typeof GetProfile.Res>(GetProfile.Route);
  return res.data.data;
};

export const getLandlordsProfile = async () => {
  const res = await appRequest.get<typeof GetLandlordProfile.Res>(
    GetLandlordProfile.Route
  );
  return res.data.data;
};

export const getAllEmergency = async () => {
  const res = await appRequest.get<typeof GetAllEmergencies.Res>(
    GetAllEmergencies.Route
  );
  return res.data.data;
};

export const getOutstandingBalance = async () => {
  return appRequest.get<typeof GetOutstandingBalance.Res>(
    GetOutstandingBalance.Route
  );
};
export const getAllEmergencyTypes = async () => {
  const res = await appRequest.get<typeof GetAllEmergenciesTypes.Res>(
    GetAllEmergenciesTypes.Route
  );
  return res.data.data;
};

export const createEmergency = async (
  data: typeof PostCreateEmergency.Body
) => {
  const res = await appRequest.post<typeof PostCreateEmergency.Res>(
    PostCreateEmergency.Route,
    data
  );
  return res.data;
};

export const deleteEmergency = (emergencyId: number) => async () => {
  const res = await appRequest.delete<typeof DelEmergency.Res>(
    DelEmergency.Route.replace(":id", emergencyId.toString())
  );
  return res.data;
};

export const updateEmergency =
  (emergencyId: number) => async (data: typeof PutUpdateEmergency.Body) => {
    const res = await appRequest.put<typeof PutUpdateEmergency.Res>(
      PutUpdateEmergency.Route.replace(":id", emergencyId.toString()),
      data
    );
    return res.data.data;
  };

export const paymentType = async () => {
  const res = await appRequest.get<typeof GetAllPaymentType.Res>(
    GetAllPaymentType.Route
  );
  return res.data.data;
};
export const paymentMethod = async () => {
  const res = await appRequest.get<typeof GetPaymentMethod.Res>(
    GetPaymentMethod.Route
  );
  return res.data.data;
};
