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
  PostBillPayment,
  GetDashboard,
  PostWalletPayment,
  GetComplaintCategory,
  PostMakeComplaint,
  PostForgotPassword,
  PostResetPassword,
} from "api";

export const getDashboard = async () => {
  const res = await appRequest.get<typeof GetDashboard.Res>(GetDashboard.Route);
  return res.data.data;
};

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

export const getOutstandingBalance = (id: number) => async () => {
  const res = await appRequest.get<typeof GetOutstandingBalance.Res>(
    GetOutstandingBalance.Route.replace(":id", id.toString())
  );
  return res.data.data;
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

export const getPaymentType = async () => {
  const res = await appRequest.get<typeof GetAllPaymentType.Res>(
    GetAllPaymentType.Route
  );
  return res.data.data;
};

export const getPaymentMethod = async () => {
  const res = await appRequest.get<typeof GetPaymentMethod.Res>(
    GetPaymentMethod.Route
  );
  return res.data.data;
};

export const postBillPayment = async (data: typeof PostBillPayment.Body) => {
  const res = await appRequest.post<typeof PostBillPayment.Res>(
    PostBillPayment.Route,
    data
  );
  return res.data.data;
};

export const postWalletPayment = async (
  data: typeof PostWalletPayment.Body
) => {
  const res = await appRequest.post<typeof PostWalletPayment.Res>(
    PostWalletPayment.Route,
    data
  );
  return res.data.data;
};

export const postComplaint = async (data: typeof PostMakeComplaint.Body) => {
  const res = await appRequest.post<typeof PostMakeComplaint.Res>(
    PostMakeComplaint.Route,
    data
  );
  return res.data;
};

export const getComplaints = async () => {
  const res = await appRequest.get<typeof GetComplaintCategory.Res>(
    GetComplaintCategory.Route
  );
  return res.data.data;
};

export const forgetPassword = async (data: typeof PostForgotPassword.Body) => {
  const res = await appRequest.post<typeof PostForgotPassword.Res>(
    PostForgotPassword.Route,
    data
  );
  return res.data;
};

export const resetPassword = async (data: typeof PostResetPassword.Body) => {
  const res = await appRequest.post<typeof PostResetPassword.Res>(
    PostResetPassword.Route,
    data
  );
  return res.data;
};
