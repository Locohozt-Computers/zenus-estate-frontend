import appRequest, {
  GetBankAccounts,
  GetWalletTransactionsWithFilter,
  PostAddBankAccount,
  PostFundWallet,
  PostResolveBankAccountName,
  PostWalletTransferBank,
} from "api";

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

export const getWalletTransactionWithFilter = async (
  transaction_type_id: string
) => {
  const res = await appRequest.get(
    GetWalletTransactionsWithFilter.Route.replace(
      "transaction_type_id",
      transaction_type_id
    )
  );
  return res.data.data;
};
getWalletTransactionWithFilter.key = "getWalletTransactionWithFilter";
