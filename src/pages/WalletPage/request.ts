import appRequest, {
  GetBankAccounts,
  GetVerifyWalletFunding,
  PostAddBankAccount,
  PostFundWallet,
  PostGeneratePaymentLink,
  PostResolveBankAccountName,
  PostStartFundingWallet,
  PostWalletTransferBank,
} from "api";

export const startFundingWallet = async (amount: number) => {
  const res = await appRequest.post<typeof PostStartFundingWallet.Res>(
    PostStartFundingWallet.Route,
    { amount }
  );
  return res.data.data;
};
startFundingWallet.key = "startFundingWallet";

export const generatePaymentLink = async (
  data: typeof PostGeneratePaymentLink.Body
) => {
  const res = await appRequest.post<typeof PostGeneratePaymentLink.Res>(
    PostGeneratePaymentLink.Route,
    data
  );
  return res.data.data;
};

export const getBankAccounts = async () => {
  const res = await appRequest.get<typeof GetBankAccounts.Res>(
    GetBankAccounts.Route
  );
  return res.data.data;
};
getBankAccounts.key = "getBankAccounts";

export const walletTransferBank = async (
  data: typeof PostWalletTransferBank.Body
) => {
  const res = await appRequest.post<typeof PostWalletTransferBank.Res>(
    PostWalletTransferBank.Route,
    data
  );
  return res.data.data;
};

export const fundWallet = async (data: typeof PostFundWallet.Body) => {
  const res = await appRequest.post<typeof PostFundWallet.Res>(
    PostFundWallet.Route,
    data
  );
  return res.data.data;
};

export const resolveBank = async (
  data: typeof PostResolveBankAccountName.Body
) => {
  const res = await appRequest.post<typeof PostResolveBankAccountName.Res>(
    PostResolveBankAccountName.Route,
    data
  );

  return res.data;
};

export const addBank = async (data: typeof PostAddBankAccount.Body) => {
  const res = await appRequest.post(PostAddBankAccount.Route, data);
  return res.data.data;
};

export const verifyWalletFunding = async (
  params: typeof GetVerifyWalletFunding.Params
) => {
  const res = await appRequest.get<typeof GetVerifyWalletFunding.Res>(
    GetVerifyWalletFunding.Route,
    { params }
  );
  return res.data;
};
verifyWalletFunding.key = "verifyWalletFunding";
