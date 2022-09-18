import appRequest, {
  GetBankAccounts,
  PostAddBankAccount,
  PostFundWallet,
} from "api";
import axios from "axios";

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

export const resolveBank = async (params: {
  account_number: string;
  bank_code: string;
}) => {
  const res = await axios.get<{
    status: boolean;
    message: string;
    data: {
      account_number: string;
      account_name: string;
      bank_id: string;
    };
  }>("https://api.paystack.co/bank/resolve", {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_KEY}`,
    },
    params,
  });
  return res.data.data;
};

export const addBank = async (data: typeof PostAddBankAccount.Body) => {
  const res = await appRequest.post(PostAddBankAccount.Route, data);
  return res.data.data;
};
