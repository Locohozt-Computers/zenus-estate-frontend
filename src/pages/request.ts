import appRequest, {
  DelEmergency,
  GetAllBanks,
  GetAllEmergencyTypes,
  GetAllPaymentType,
  GetBills,
  GetComplaintCategory,
  GetElectricityPurchases,
  GetElectricityQuotaUsage,
  GetMeter,
  PostPayWithWalletBill,
  PostDemandNoticePaymentLinksRegenerate,
  PostElectricityPaymentLinksGenerate,
  PostMeterTispTokenBuyWithWallet,
  GetCustomerTransaction,
  GetCustomerTransactionByLevyType,
  GetDashboard,
  GetLandlordProfile,
  GetMyEmergencies,
  GetOutstandingBalance,
  GetPaymentMethod,
  GetProfile,
  GetProperties,
  GetPropertyDashboard,
  GetSalesItems,
  GetPolls,
  GetPoll,
  GetPollResults,
  GetPollHistory,
  PostPollVote,
  GetSupportIssueTypes,
  GetSupportTicket,
  GetSupportTickets,
  GetVisitHistory,
  GetWalletTransactions,
  PostApproveExitVisit,
  PostBillPayment,
  PostCancelVisit,
  PostCreateEmergency,
  PostDenyExitVisit,
  PostForgotPassword,
  PostMakeComplaint,
  PostRegisterVisit,
  PostResetPassword,
  PostResolveEmergency,
  PostSupportTicket,
  PostSupportTicketClose,
  PostSupportTicketComment,
  PostSupportTicketReopen,
  PutUpdateEmergency,
} from "api";
import { excludeObjectEmptyValues } from "utils/helpers";

export const getProperties = async () => {
  const res = await appRequest.get<typeof GetProperties.Res>(
    GetProperties.Route
  );
  return res.data.data;
};
getProperties.key = "getProperties";

export const getDashboard = async () => {
  const res = await appRequest.get<typeof GetDashboard.Res>(GetDashboard.Route);
  return res.data.data;
};
getDashboard.key = "getDashboard";

export const getPropertyDashboard = async () => {
  const res = await appRequest.get<typeof GetPropertyDashboard.Res>(
    GetPropertyDashboard.Route
  );
  return res.data.data;
};
getPropertyDashboard.key = "getPropertyDashboard";

export const getWalletTransactions = async (
  params?: typeof GetWalletTransactions.Params
) => {
  const res = await appRequest.get<typeof GetWalletTransactions.Res>(
    GetWalletTransactions.Route,
    { params: excludeObjectEmptyValues(params || {}) }
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

export const getMyEmergencies = async (
  params?: typeof GetMyEmergencies.Params
) => {
  const res = await appRequest.get<typeof GetMyEmergencies.Res>(
    GetMyEmergencies.Route,
    { params: excludeObjectEmptyValues(params || {}) }
  );
  return res.data.data;
};
getMyEmergencies.key = "getMyEmergencies";

export const getOutstandingBalance = (id: number) => async () => {
  const res = await appRequest.get<typeof GetOutstandingBalance.Res>(
    GetOutstandingBalance.Route.replace(":id", id.toString())
  );
  return res.data.data;
};
getOutstandingBalance.key = "getOutstandingBalance";

export const getAllEmergencyTypes = async () => {
  const res = await appRequest.get<typeof GetAllEmergencyTypes.Res>(
    GetAllEmergencyTypes.Route
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
  return res.data.data;
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

export const resolveEmergency = (emergencyId: number) => async () => {
  const res = await appRequest.post<typeof PostResolveEmergency.Res>(
    PostResolveEmergency.Route.replace(":id", emergencyId.toString())
  );
  return res.data;
};

export const getPaymentType = async () => {
  const res = await appRequest.get<typeof GetAllPaymentType.Res>(
    GetAllPaymentType.Route
  );
  return res.data.data;
};
getPaymentType.key = "getPaymentType";

export const getPaymentMethod = async () => {
  const res = await appRequest.get<typeof GetPaymentMethod.Res>(
    GetPaymentMethod.Route
  );
  return res.data.data;
};
getPaymentMethod.key = "getPaymentMethod";

export const postBillPayment = async (data: typeof PostBillPayment.Body) => {
  const res = await appRequest.post<typeof PostBillPayment.Res>(
    PostBillPayment.Route,
    data
  );
  return res.data.data;
};
postBillPayment.key = "postBillPayment";

export const postComplaint = async (data: typeof PostMakeComplaint.Body) => {
  const res = await appRequest.post<typeof PostMakeComplaint.Res>(
    PostMakeComplaint.Route,
    data
  );
  return res.data;
};
postComplaint.key = "postComplaint";

export const getComplaints = async () => {
  const res = await appRequest.get<typeof GetComplaintCategory.Res>(
    GetComplaintCategory.Route
  );
  return res.data.data;
};
getComplaints.key = "getComplaints";

export const getAllTransactions = async (page?: number) => {
  const res = await appRequest.get<typeof GetCustomerTransaction.Res>(
    GetCustomerTransaction.Route,
    { params: { page } }
  );
  return res.data.data;
};
getAllTransactions.key = "getAllTransactions";

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
getAllTransactionsByLevyType.key = "getAllTransactionsByLevyType";

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

export const postRegisterVisit = async (
  data: typeof PostRegisterVisit.Body
) => {
  const res = await appRequest.post<typeof PostRegisterVisit.Res>(
    PostRegisterVisit.Route,
    data
  );
  return res.data;
};

export const getVisitHistory = async (
  params?: typeof GetVisitHistory.Params
) => {
  const res = await appRequest.get<typeof GetVisitHistory.Res>(
    GetVisitHistory.Route,
    { params: excludeObjectEmptyValues(params || {}) }
  );
  return res.data;
};
getVisitHistory.key = "getVisitHistory";

export const cancelVisit = async (id: number) => {
  const res = await appRequest.post<typeof PostCancelVisit.Res>(
    PostCancelVisit.Route.replace(":id", id.toString())
  );
  return res.data;
};

export const approveExitVisit = async (id: number) => {
  const res = await appRequest.post<typeof PostApproveExitVisit.Res>(
    PostApproveExitVisit.Route.replace(":id", id.toString())
  );
  return res.data;
};

export const denyExitVisit = async (id: number) => {
  const res = await appRequest.post<typeof PostDenyExitVisit.Res>(
    PostDenyExitVisit.Route.replace(":id", id.toString())
  );
  return res.data;
};

export const getBills = async () => {
  const res = await appRequest.get<typeof GetBills.Res>(GetBills.Route);
  return res.data.data;
};
getBills.key = "getBills";

export const postPayWithWalletBill = async (
  data: typeof PostPayWithWalletBill.Body
) => {
  const res = await appRequest.post<typeof PostPayWithWalletBill.Res>(
    PostPayWithWalletBill.Route,
    data
  );
  return res.data;
};

export const postDemandNoticePaymentLinksRegenerate = async (
  data: typeof PostDemandNoticePaymentLinksRegenerate.Body
) => {
  const res = await appRequest.post<
    typeof PostDemandNoticePaymentLinksRegenerate.Res
  >(PostDemandNoticePaymentLinksRegenerate.Route, data);
  return res.data.data;
};

export const getSalesItems = async () => {
  const res = await appRequest.get<typeof GetSalesItems.Res>(
    GetSalesItems.Route
  );
  return res.data.data;
};
getSalesItems.key = "getSalesItems";

export const getElectricityPurchases = async (
  customerId: number,
  params?: typeof GetElectricityPurchases.Params
) => {
  const res = await appRequest.get<typeof GetElectricityPurchases.Res>(
    GetElectricityPurchases.Route.replace(":customer", String(customerId)),
    { params: excludeObjectEmptyValues(params || {}) }
  );
  return res.data.data;
};
getElectricityPurchases.key = "getElectricityPurchases";

export const getElectricityQuotaUsage = async () => {
  const res = await appRequest.get<typeof GetElectricityQuotaUsage.Res>(
    GetElectricityQuotaUsage.Route
  );
  return res.data.data;
};
getElectricityQuotaUsage.key = "getElectricityQuotaUsage";

export const getMeter = async (id: number) => {
  const res = await appRequest.get<typeof GetMeter.Res>(
    GetMeter.Route.replace(":id", String(id))
  );
  return res.data.data;
};
getMeter.key = "getMeter";

export const postElectricityPaymentLinksGenerate = async (
  data: typeof PostElectricityPaymentLinksGenerate.Body
) => {
  const res = await appRequest.post<
    typeof PostElectricityPaymentLinksGenerate.Res
  >(PostElectricityPaymentLinksGenerate.Route, data);
  return res.data.data;
};

export const postMeterTispTokenBuyWithWallet = async (data: {
  meterPan: number;
  amount: number;
  pin: number;
  levy_id: number;
}) => {
  const { meterPan, ...body } = data;
  const res = await appRequest.post<typeof PostMeterTispTokenBuyWithWallet.Res>(
    PostMeterTispTokenBuyWithWallet.Route.replace(
      ":meterPan",
      String(meterPan)
    ),
    body
  );
  return res.data;
};

// ============================================================
// Support Tickets ("Report Issue")
// ============================================================

export const getSupportIssueTypes = async () => {
  const res = await appRequest.get<typeof GetSupportIssueTypes.Res>(
    GetSupportIssueTypes.Route
  );
  return res.data.data;
};
getSupportIssueTypes.key = "getSupportIssueTypes";

export const getSupportTickets = async (
  params?: typeof GetSupportTickets.Params
) => {
  const res = await appRequest.get<typeof GetSupportTickets.Res>(
    GetSupportTickets.Route,
    { params: excludeObjectEmptyValues(params || {}) }
  );
  return res.data;
};
getSupportTickets.key = "getSupportTickets";

export const getSupportTicket = async (id: number | string) => {
  const res = await appRequest.get<typeof GetSupportTicket.Res>(
    GetSupportTicket.Route.replace(":id", String(id))
  );
  return res.data.data;
};
getSupportTicket.key = "getSupportTicket";

const buildTicketFormData = (data: {
  body?: string;
  subject?: string;
  description?: string;
  issue_type_id?: number;
  priority?: string;
  customer_id?: number;
  images?: File[];
  attachments?: File[];
}) => {
  const fd = new FormData();
  if (data.subject !== undefined) fd.append("subject", data.subject);
  if (data.description !== undefined)
    fd.append("description", data.description);
  if (data.issue_type_id !== undefined)
    fd.append("issue_type_id", String(data.issue_type_id));
  if (data.priority) fd.append("priority", data.priority);
  if (data.customer_id !== undefined && data.customer_id !== null)
    fd.append("customer_id", String(data.customer_id));
  if (data.body !== undefined) fd.append("body", data.body);
  data.images?.forEach((f) => fd.append("images[]", f));
  data.attachments?.forEach((f) => fd.append("attachments[]", f));
  return fd;
};

export const createSupportTicket = async (
  data: typeof PostSupportTicket.Body
) => {
  const res = await appRequest.post<typeof PostSupportTicket.Res>(
    PostSupportTicket.Route,
    buildTicketFormData(data)
  );
  return res.data.data;
};
createSupportTicket.key = "createSupportTicket";

export const replyToSupportTicket = async (
  id: number | string,
  data: typeof PostSupportTicketComment.Body
) => {
  const res = await appRequest.post<typeof PostSupportTicketComment.Res>(
    PostSupportTicketComment.Route.replace(":id", String(id)),
    buildTicketFormData(data)
  );
  return res.data.data;
};
replyToSupportTicket.key = "replyToSupportTicket";

export const closeSupportTicket = async (id: number | string) => {
  const res = await appRequest.post<typeof PostSupportTicketClose.Res>(
    PostSupportTicketClose.Route.replace(":id", String(id))
  );
  return res.data;
};
closeSupportTicket.key = "closeSupportTicket";

export const reopenSupportTicket = async (id: number | string) => {
  const res = await appRequest.post<typeof PostSupportTicketReopen.Res>(
    PostSupportTicketReopen.Route.replace(":id", String(id))
  );
  return res.data;
};
reopenSupportTicket.key = "reopenSupportTicket";

export const getPolls = async (params?: typeof GetPolls.Params) => {
  const res = await appRequest.get<typeof GetPolls.Res>(GetPolls.Route, {
    params: excludeObjectEmptyValues(params || {}),
  });
  return res.data.data;
};
getPolls.key = "getPolls";

export const getPoll = async (id: number | string) => {
  const res = await appRequest.get<typeof GetPoll.Res>(
    GetPoll.Route.replace(":id", String(id))
  );
  return res.data.data;
};
getPoll.key = "getPoll";

export const votePoll = async (
  id: number | string,
  body: typeof PostPollVote.Body
) => {
  const res = await appRequest.post<typeof PostPollVote.Res>(
    PostPollVote.Route.replace(":id", String(id)),
    body
  );
  return res.data;
};
votePoll.key = "votePoll";

export const getPollResults = async (id: number | string) => {
  const res = await appRequest.get<typeof GetPollResults.Res>(
    GetPollResults.Route.replace(":id", String(id))
  );
  return res.data.data;
};
getPollResults.key = "getPollResults";

export const getPollHistory = async (params?: typeof GetPollHistory.Params) => {
  const res = await appRequest.get<typeof GetPollHistory.Res>(
    GetPollHistory.Route,
    { params: excludeObjectEmptyValues(params || {}) }
  );
  return res.data.data;
};
getPollHistory.key = "getPollHistory";
