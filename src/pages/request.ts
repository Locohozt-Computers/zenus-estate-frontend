import appRequest, {
  DelEmergency,
  GetAllBanks,
  GetAllEmergencies,
  GetAllEmergenciesTypes,
  GetAllPaymentType,
  GetComplaintCategory,
  GetCustomerTransaction,
  GetCustomerTransactionByLevyType,
  GetDashboard,
  GetLandlordProfile,
  GetOutstandingBalance,
  GetPaymentMethod,
  GetProfile,
  GetWalletTransactions,
  PostBillPayment,
  PostCreateEmergency,
  PostForgotPassword,
  PostMakeComplaint,
  PostResetPassword,
  PutUpdateEmergency,
} from "api";

export const getDashboard = async () => {
  const res = await appRequest.get<typeof GetDashboard.Res>(GetDashboard.Route);
  return res.data.data;
};
getDashboard.key = "getDashboard";

export const getWalletTransactions = async (params?: {
  page?: number;
  filter?: string;
}) => {
  const res = await appRequest.get<typeof GetWalletTransactions.Res>(
    GetWalletTransactions.Route,
    { params }
  );
  return res.data.data;
};
getWalletTransactions.key = "getWalletTransactions";

export const getAllBanks = async () => {
  const res = await appRequest.get<typeof GetAllBanks.Res>(GetAllBanks.Route);
  return res.data.data;
};
getAllBanks.key = "getAllBanks";

export const getUserProfile = async () => {
  const res = await appRequest.get<typeof GetProfile.Res>(GetProfile.Route);
  return res.data.data;
};
getUserProfile.key = "getUserProfile";

export const getLandlordsProfile = async () => {
  const res = await appRequest.get<typeof GetLandlordProfile.Res>(
    GetLandlordProfile.Route
  );
  return res.data.data;
};
getLandlordsProfile.key = "getLandlordsProfile";

export const getAllEmergency = async () => {
  const res = await appRequest.get<typeof GetAllEmergencies.Res>(
    GetAllEmergencies.Route
  );
  return res.data.data;
};
getAllEmergency.key = "getAllEmergency";

export const getOutstandingBalance = (id: number) => async () => {
  const res = await appRequest.get<typeof GetOutstandingBalance.Res>(
    GetOutstandingBalance.Route.replace(":id", id.toString())
  );
  return res.data.data;
};
getOutstandingBalance.key = "getOutstandingBalance";

export const getAllEmergencyTypes = async () => {
  const res = await appRequest.get<typeof GetAllEmergenciesTypes.Res>(
    GetAllEmergenciesTypes.Route
  );
  return res.data.data;
};
getAllEmergencyTypes.key = "getAllEmergencyTypes";

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

export const getAllTransactions = async (page?: number) => {
  const res = await appRequest.get<typeof GetCustomerTransaction.Res>(
    GetCustomerTransaction.Route,
    { params: { page } }
  );
  return res.data.data;
};

export const getAllTransactionsByLevyType = async ({
  payment_type_id: id,
  page,
}: {
  payment_type_id: string;
  page?: number;
}) => {
  const res = await appRequest.get<typeof GetCustomerTransactionByLevyType.Res>(
    GetCustomerTransactionByLevyType.Route.replace(":payment_type_id", id),
    {
      params: { page },
    }
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
