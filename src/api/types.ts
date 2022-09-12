export class PostUserLogin {
  static Route = "/login";

  static Body: {
    email: string;
    password: string;
  };

  static Res: {
    status: string;
    message: string;
    data: {
      auth: {
        token: string;
      };
      profile: {
        profile_id: number;
        user_id: number;
      };
    };
  };
}

export class PostResetPassword {
  static Route = "/auth/password/reset";

  static Body: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
  };
}

export class PostForgotPassword {
  static Route = "/password/email";

  static Body: {
    email: string;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
  };
}

export class GetLandlordProfile {
  static Route = "/landlord";

  static Res: {
    status: number;
    message: string;
    data: {
      id: number;
      user_id: number;
      signup_email: string;
      house_no: string;
      landlord_name: string;
      tenant_name: string;
      address: string;
      occupation: string;
      office_address: string;
      landlord_phone: string;
      tenant_phone: string;
      landlord_email: string;
      tenant_email: string;
      house_status_id: number;
      tenancy_type_id: number;
      charge_svc: boolean;
      created_at: string;
      updated_at: string;
    };
  };
}

export class GetProfile {
  static Route = "/profile";

  static Res: {
    status: number;
    message: string;
    data: {
      id: number;
      user_id: number;
      signup_email: string;
      house_no: string;
      landlord_name: string;
      tenant_name: string;
      address: string;
      occupation: string;
      office_address: string;
      landlord_phone: string;
      tenant_phone: string;
      landlord_email: string;
      tenant_email: string;
      house_status_id: number;
      tenancy_type_id: number;
      charge_svc: boolean;
      created_at: string;
      updated_at: string;
      walletBalance: number;
    };
  };
}

export class GetAllPaymentType {
  static Route = "/levy-type";

  static Res: {
    status: number;
    message: string;
    data: Array<{
      id: number;
      special_name: string;
      income_gl_code_id: number;
      invoice_amount: number;
      user_levy_outstanding_balance: number;
      fees: number;
      final_amount: number;
    }>;
  };
}

export enum PaymentOptionNameEnum {
  Wallet = "Wallet",
  Card = "Card",
}

export class GetPaymentMethod {
  static Route = "/payment-method";

  static Res: {
    status: number;
    message: string;
    data: Array<{
      id: number;
      name: PaymentOptionNameEnum;
    }>;
  };
}

export interface PaymentSuccessResponse {
  payment_type_id: number;
  amount: number;
  fee: number;
  final_amount: number;
  levy_setup_id: number;
  user_id: number;
  description: string;
  ref_no: number;
  receipt_no: string;
  branch_id: number;
  paid: boolean;
  reference: string;
  trans_id: string;
  chart_of_account_id: number;
  updated_at: string;
  created_at: string;
  id: number;
}

export class PostBillPayment {
  static Route = "/bill-payment";

  static Body: {
    payment_method_id: number;
    amount: number; // kobo
    payment_type_id: number;
  } & Partial<{
    fee: number;
    final_amount: number;
    reference: string;
    trxref: string;
  }>;

  static Res: {
    status: number;
    message: string;
    data: PaymentSuccessResponse;
  };
}

export class PostWalletPayment extends PostBillPayment {
  static Body: {
    payment_method_id: number;
    amount: number; // kobo
    payment_type_id: number;
  };
}

export enum EmergencyTypesStatusEnum {
  Add = "Add New",
  Fire = "Fire Alarm",
  Flood = "Flood Alarm",
}

export interface EmergencyTypesI {
  id: number;
  name: EmergencyTypesStatusEnum;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export class GetAllEmergencies {
  static Route = "/emergency";

  static Res: {
    status: number;
    message: string;
    data: {
      id: number;
      user_id: number;
      emergency_type_id: number;
      branch_id: number;
      description: string;
      created_at: string;
      updated_at: string;
      emergency_type: EmergencyTypesI;
    }[];
  };
}

export class PostCreateEmergency {
  static Route = "/emergency";

  static Body: {
    emergency_type_id?: number;
    description?: string;
  };

  static Res: {
    status: number;
    message: string;
    data: {
      emergency_type_id: number;
      description: string;
      user_id: number;
      branch_id: number;
      updated_at: string;
      created_at: string;
      id: number;
      emergency_type: {
        id: number;
        name: string;
        status: boolean;
        created_at: string;
        updated_at: string;
      };
    };
  };
}

export class PutUpdateEmergency extends PostCreateEmergency {
  static Route = "/emergency/:id";
}

export class DelEmergency {
  static Route = "/emergency/:id";

  static Res: {
    status: number;
    message: string;
  };
}

export class GetAllEmergenciesTypes {
  static Route = "/emergency-types";

  static Res: {
    status: number;
    message: string;
    data: EmergencyTypesI[];
  };
}

export class GetOutstandingBalance {
  static Route = "/user-levy-type-balance/:id";

  static Res: {
    status: number;
    message: string;
    data: { user_levy_outstanding_balance: string };
  };
}

export interface PayStackResponseI {
  message: string;
  redirecturl: string;
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

export enum TransactionTypeEnum {
  Credit = "c",
  Debit = "d",
}

export interface PaymentHistoryI {
  id: number;
  user_id: number;
  description: string;
  amount: number;
  fee: number;
  ref_no: string;
  receipt_no: string;
  chart_of_account_id: number;
  levy_setup_id: number;
  payment_type_id: number;
  bank_id: string | null;
  branch_id: number;
  transaction_status_id: number;
  transaction_type_id: number;
  paid: boolean;
  approved: boolean;
  payment_by: null;
  value_date: string;
  reference: string;
  trans_id: string;
  created_at: string;
  updated_at: string;
  levy: {
    id: number;
    special_name: string;
    user_levy_outstanding_balance: number;
  };
  payment_type: {
    id: number;
    name: string;
  };
  transaction_status: {
    id: number;
    name: string;
  };
  bank: null;
  transaction_type: {
    id: number;
    name: TransactionTypeEnum;
  };
}

export interface BalancesI {
  id: number;
  special_name: string;
  user_levy_outstanding_balance: number;
}

interface PaginationI {
  current_page: number;
  first_page_url: string;
  from: string;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null | string;
  to: number;
  total: number;
}

export class GetDashboard {
  static Route = "/user-dashboard";

  static Res: {
    status: string;
    message: string;
    data: {
      balances: Array<BalancesI>;
      payment_history: Array<PaymentHistoryI>;
    };
  };
}

export class GetComplaintCategory {
  static Route = "/complaint-category";

  static Res: {
    status: string;
    message: string;
    data: Array<{
      id: number;
      name: string;
      status: boolean;
      created_at: string;
      updated_at: string;
    }>;
  };
}

export class PostMakeComplaint {
  static Route = "/complaint";

  static Body: {
    complaint_category_id: number;
    description: string;
  };

  static Res: {
    status: string;
    message: string;
    data: Array<{
      id: number;
      name: string;
      status: boolean;
      created_at: string;
      updated_at: string;
    }>;
  };
}

export class GetCustomerTransaction {
  static Route = "/customer-transactions";

  static Res: {
    status: string;
    message: string;
    data: {
      current_page: number;
      data: Array<PaymentHistoryI>;
    } & PaginationI;
  };
}

export class GetWalletTransactions {
  static Route = "/wallet-transactions";

  static Res: {
    data: {
      data: Array<{
        id: number;
        user_id: number;
        description: string;
        amount: number;
        reference: string;
        trans_id: string;
        transaction_type_id: 1;
        status: boolean;
        created_at: string;
        updated_at: string;
        transaction_type: {
          id: number;
          name: TransactionTypeEnum;
        };
      }>;
    } & PaginationI;
  };
}

export class PostFundWallet {
  static Route = "/fund-wallet";

  static Body: {
    amount: 6000;
    reference: string;
    trans_id: string;
  };

  static Res: {
    status: string;
    message: string;
    data: {
      amount: number;
      reference: string;
      trans_id: string;
      status: boolean;
      user_id: number;
      description: string;
      transaction_type_id: number;
      updated_at: string;
      created_at: string;
      id: number;
    };
  };
}
