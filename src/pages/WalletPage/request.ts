import appRequest, {
  GetBankAccounts,
  PostAddBankAccount,
  PostFundWallet,
  PostResolveBankAccountName,
} from "api";

export const getBankAccounts = async () => {
  const res = await appRequest.get<typeof GetBankAccounts.Res>(
    GetBankAccounts.Route
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
