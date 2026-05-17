export class PostSignupVerifyPhone {
  static Route = "/signup/verify-phone";

  static Body: {
    phone_number: string;
  };

  static Res: {
    success: boolean;
    message: string;
    data: {
      otp: string;
    };
  };
}

export class PostSignupVerifyOtp {
  static Route = "/signup/verify-otp";

  static Body: {
    phone_number: string;
    otp: string;
  };

  static Res: {
    success: boolean;
    message: string;
  };
}

export class PostSignupRegister {
  static Route = "/signup/register";

  static Body: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    password: string;
    password_confirmation: string;
  };

  static Res: {
    success: boolean;
    message: string;
    data: {
      user_id: number;
      email: string;
      phone_number: string;
      email_verified: boolean;
      auth: {
        token: string;
        token_type: string;
      };
      profile: {
        first_name: string;
        last_name: string;
        referral_code: string;
        referral_link: string;
      };
    };
  };
}

export interface VirtualAccountI {
  provider: string;
  account_number: string;
  account_name: string;
  bank_name: string;
}

export interface FundingProviderI {
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface FundingCalcI {
  requested_amount: string;
  total_amount_to_pay: string;
  charge_fee: string;
  providers: FundingProviderI[];
}

export class PostStartFundingWallet {
  static Route = "/start-funding-wallet";

  static Body: { amount: number };

  static Res: {
    message: string;
    data: FundingCalcI;
  };
}

export class PostGeneratePaymentLink {
  static Route = "/generate-payment-link";

  static Body: {
    amount: number;
    provider: string;
  };

  static Res: {
    message: string;
    data: {
      payment_url: string;
      reference: string;
      access_code: string;
      provider: string;
      amount: string;
    };
  };
}

export interface EstateI {
  id: number;
  name: string;
  domain: string;
  pivot: { user_id: number; tenant_id: number };
}

export interface PropertyI {
  id: number;
  house_no: string;
  house_status: { id: number; name: string };
  meters: { id: number; meter_number: string }[];
  relationship_type: string;
  is_primary: boolean;
}

export class GetProperties {
  static Route = "/properties";

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: PropertyI[];
  };
}

export class PostUserLogin {
  static Route = "/login";

  static Body: {
    email: string;
    password: string;
  };

  static Res: {
    status: number;
    message: string;
    data: {
      auth: {
        token: string;
      };
      profile: {
        id: number;
        user_id: number;
        first_name: string;
        last_name: string;
        middle_name: string | null;
        salutation: string | null;
        gender: string | null;
        image: string | null;
        referral_code: string | null;
        referral_link: string | null;
        biometric_enabled: boolean;
      };
      user: {
        id: number;
        email: string;
        phone_number: string | null;
        tenant_id: number;
      };
      wallet: {
        amount: string;
        currency: string;
      };
      pin_is_set: boolean;
      estates: EstateI[];
      virtual_accounts: VirtualAccountI[];
      "pending charges": string;
    };
  };
}

export class PostSetPin {
  static Route = "/auth/set-pin";

  static Body: {
    pin: number;
  };

  static Res: {
    status: string;
    message: string;
  };
}

export class PostChangePin {
  static Route = "/auth/change-pin";

  static Body: {
    current_pin: number;
    new_pin: number;
  };

  static Res: {
    status: string;
    message: string;
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

export class PutChangePassword {
  static Route = "/change-password";

  static Body: {
    old_password: string;
    new_password: string;
  };

  static Res: {
    status: string;
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

interface ProfileData {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  salutation: string | null;
  designation: string | null;
  gender: string | null;
  company_name: string | null;
  address: string | null;
  occupation: string | null;
  image: string | null;
  referral_code: string | null;
  referral_link: string | null;
  biometric_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export class GetLandlordProfile {
  static Route = "/landlord";

  static Res: {
    status: number;
    message: string;
    data: ProfileData;
  };
}

export interface BankAccountResI {
  id: number;
  user_id: number;
  bank_code: number;
  account_number: string;
  account_name?: string;
  status: number;
  branch_id: number;
  created_at: string;
  updated_at: string;
}

export class GetProfile {
  static Route = "/profile";

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: ProfileData & {
      walletBalance: string;
      bank?: BankAccountResI;
    };
  };
}

export class PutUpdateUserPhoneNumber {
  static Route = "/profile/update-mobile-number";

  static Body: {
    phone_no: string;
  };

  static Res: {
    status: number;
    message: string;
    data: ProfileData;
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

export class PostWalletTransferBank {
  static Route = "/wallet-transfer-bank";

  static Body: {
    amount: number;
  };

  static Res: {
    status: string;
    message: string;
    data: {
      amount: number;
      reference: string;
      trans_id: string;
      user_id: number;
      description: string;
      transaction_type_id: number;
      transaction_id: number;
      updated_at: string;
      created_at: string;
    };
  };
}

export class PostWalletPayment extends PostBillPayment {
  static Body: {
    payment_method_id: number;
    amount: number; // kobo
    payment_type_id: number;
  };
}

export type EmergencyCategory = "community" | "national" | "state";

export type EmergencyStatus = "active" | "resolved";

export interface CommunityEmergencyTypeI {
  id: number;
  name: string;
  description: string;
  allows_broadcast: boolean;
  requires_additional_info: boolean;
  icon: string;
  color: string;
}

export interface HotlineEmergencyTypeI {
  id: number;
  name: string;
  description: string;
  phone_number: string;
  icon: string;
  color: string;
}

export interface EmergencyTypeFullI {
  id: number;
  name: string;
  category: string;
  description: string;
  phone_number: string | null;
  allows_broadcast: boolean;
  requires_additional_info: boolean;
  icon: string;
  color: string;
  priority: number;
  status: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmergencyLocationI {
  latitude: number | string;
  longitude: number | string;
}

export interface EmergencyI {
  id: number;
  user_id: number;
  emergency_type_id: number;
  branch_id: number;
  description: string;
  additional_info: string | null;
  broadcast_to_community: boolean;
  status: EmergencyStatus;
  location: EmergencyLocationI | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  emergency_type: EmergencyTypeFullI;
  branch?: {
    id: number;
    name: string;
    active: number | boolean;
    created_at: string;
    updated_at: string;
  };
}

export class GetAllEmergencyTypes {
  static Route = "/emergency-types";

  static Res: {
    success: boolean;
    data: {
      community: CommunityEmergencyTypeI[];
      national: HotlineEmergencyTypeI[];
      state: HotlineEmergencyTypeI[];
    };
  };
}

export class PostCreateEmergency {
  static Route = "/emergencies";

  static Body: {
    emergency_type_id: number;
    description: string;
    broadcast_to_community?: boolean;
    additional_info?: string;
    location?: EmergencyLocationI;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: EmergencyI;
  };
}

export class PutUpdateEmergency {
  static Route = "/emergency/:id";

  static Body: {
    emergency_type_id?: number;
    description?: string;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: EmergencyI;
  };
}

export class DelEmergency {
  static Route = "/emergency/:id";

  static Res: {
    status: string;
    status_code: number;
    message: string;
  };
}

export class GetMyEmergencies {
  static Route = "/emergencies/my";

  static Params: {
    page?: number;
  };

  static Res: {
    success: boolean;
    data: PaginationI & {
      data: EmergencyI[];
    };
  };
}

export class PostResolveEmergency {
  static Route = "/emergencies/:id/resolve";

  static Res: {
    success: boolean;
    message: string;
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
    status_code: number;
    message: string;
    data: {
      properties: DashboardPropertyI[];
    };
  };
}

export interface BankRes {
  id: number;
  code: string;
  name: string;
  pay_with_bank: boolean;
  active: boolean;
  currency: string;
}

export class GetAllBanks {
  static Route = "/all-banks";

  static Res: {
    status: string;
    message: string;
    data: {
      data: Array<BankRes>;
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

export class GetCustomerTransactionByLevyType extends GetCustomerTransaction {
  static Route = "/customer-transactions/payment-type/:payment_type_id";

  static Params: Partial<{
    page: number;
  }>;
}

export interface TransactionI {
  id: number;
  user_id: number;
  description: string;
  amount: number;
  reference: string;
  trans_id: string;
  transaction_type_id: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  transaction_type: {
    id: number;
    name: TransactionTypeEnum;
  };
  transaction_source: {
    name: string;
    status: boolean;
  };
}

export class GetWalletTransactions {
  static Route = "/wallet-transactions";

  static Params: {
    trans_type?: TransactionTypeEnum;
    page?: number;
  };

  static Res: {
    data: {
      data: Array<TransactionI>;
    } & PaginationI;
  };
}

export class PostFundWallet {
  static Route = "/fund-wallet";

  static Body: {
    amount: number;
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

export class GetBankAccounts {
  static Route = "/bank-account";

  static Res: {
    status: string;
    message: string;
    data: Array<BankAccountResI>;
  };
}

export class PostAddBankAccount extends GetBankAccounts {
  static Body: {
    account_number: string;
    bank_code: string;
  };

  static Res: {
    status: string;
    message: string;
    data: Array<Omit<BankAccountResI, "account_name">>;
  };
}

export class PostResolveBankAccountName {
  static Route = "/resolve-bank-account-name";

  static Body: {
    account_number: string;
    bank_code: string;
  };

  static Res: {
    status: string;
    message: string;
    data: {
      account_name: string;
    };
  };
}

export class GetMarkAllNotificationAsRead {
  static Route = "/notifications-mark-as-read";

  static Res: {
    status: string;
    message: string;
  };
}

export class GetAllNotifications {
  static Route = "/notifications";

  static Res: {
    status: string;
    message: string;
    data: Array<{
      id: string;
      message: string;
      created_at: string;
      read_at: null;
    }>;
  };
}

export class PostReadNotification extends GetAllNotifications {
  static Body: {
    id: string;
  };

  static Res: {
    status: string;
    message: string;
    data: [];
  };
}

export interface DashboardTransactionI {
  id: number;
  customer_id: number;
  description: string;
  amount: number;
  fee: number;
  ref_no: string;
  receipt_no: string;
  levy_setup_id: number;
  transaction_status_id: number;
  transaction_type_id: number;
  paid: number;
  approved: number;
  value_date: string;
  reference: string;
  trans_id: string;
  created_at: string;
  updated_at: string;
  levy: {
    id: number;
    special_name: string;
    final_amount: number;
    fees: number;
  };
  payment_type: { id: number; name: string };
  transaction_status: { id: number; name: string };
  transaction_type: { id: number; name: TransactionTypeEnum };
}

export interface DashboardLevyI {
  levy_id: number;
  levy_name: string;
  balance: number;
  recent_transactions: DashboardTransactionI[];
}

export interface DashboardPropertyI {
  customer_id: number;
  house_no: string;
  house_status: string;
  unit_type: string;
  relationship_type: string;
  levies: DashboardLevyI[];
}

export class GetPropertyDashboard {
  static Route = "/dashboard";

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: {
      properties: DashboardPropertyI[];
    };
  };
}

export class GetSearchBlockOrName {
  static Route = "/search/:search_block_name";

  static Params: {
    search_block_name?: string;
  };

  static Res: {
    data: PaginationI & {
      data: Array<{
        id: number;
        signup_email: string;
        house_no: string;
        tenant_name: string;
        tenant_phone: string;
      }>;
    };
  };
}

export class GetVerifyWalletFunding {
  static Route = "/verify-wallet-funding";

  static Params: {
    trxref: string;
    reference: string;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: {
      payment_status: string;
      is_successful: boolean;
      wallet_credited: boolean;
      reference: string;
      amount: number;
    };
  };
}

export interface VisitRegistrationBody {
  name: string;
  phone: string;
  allowCompany?: boolean;
  company?: string | null;
  oneTimeVisit: "yes" | "no";
  startDate: string;
  endDate: string;
  startTime?: string | null;
  endTime?: string | null;
  recurring?: boolean;
  days?: string[] | null;
  dates?: string[] | null;
}

export interface VisitResponseData {
  id: number;
  token: string;
  card_url: string | null;
  status: string;
  visitor: {
    name: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string | null;
    type: string | null;
    total_people: number | null;
  };
  host: {
    name: string;
    phone: string | null;
    estate: string | null;
    property_unit: string | null;
  };
  schedule: {
    one_time: boolean;
    repeating: boolean;
    repeat_type: string | null;
    frequency: string | null;
    days_of_week: string[] | null;
    specific_dates: string[] | null;
    start_date: string;
    end_date: string;
    start_time: string | null;
    end_time: string | null;
    expected_date: string;
    expected_time: string | null;
  };
  access: {
    duration_hours: number | null;
    reuse_limit: number | null;
    times_used: number | null;
    uses_remaining: number;
  };
  notes: string | null;
  share_message: string;
  whatsapp_url: string;
  created_at: string;
  updated_at: string;
}

export class PostRegisterVisit {
  static Route = "/visits/register";

  static Body: VisitRegistrationBody;

  static Res: {
    message: string;
    data: VisitResponseData;
  };
}

export interface VisitHistoryItemI {
  id: number;
  token: string;
  card_url: string | null;
  status: string;
  visitor: {
    name: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string | null;
    type: string | null;
    total_people: number | null;
  };
  host: {
    name: string;
    phone: string | null;
    estate: string | null;
    property_unit: string | null;
  };
  schedule: {
    one_time: boolean;
    repeating: boolean;
    repeat_type: string | null;
    frequency: string | null;
    days_of_week: string[] | null;
    specific_dates: string[] | null;
    start_date: string;
    end_date: string;
    start_time: string | null;
    end_time: string | null;
    expected_date: string;
    expected_time: string | null;
  };
  access: {
    duration_hours: number | null;
    reuse_limit: number | null;
    times_used: number | null;
    uses_remaining: number;
  };
  notes: string | null;
  share_message: string;
  whatsapp_url: string;
  created_at: string;
  updated_at: string;
}

export type VisitHistoryStatus =
  | "Awaiting"
  | "Entry Approved"
  | "Exit Approved"
  | "Exit Denied"
  | "Active"
  | "Completed"
  | "Cancelled";

export type VisitHistoryScope = "upcoming" | "past" | "today";
export type VisitHistoryVisitType = "one_time" | "recurring";
export type VisitHistorySort = "recent" | "upcoming";

export interface VisitHistoryFilters {
  page?: number;
  per_page?: number;
  status?: VisitHistoryStatus | "";
  scope?: VisitHistoryScope | "";
  visit_type?: VisitHistoryVisitType | "";
  search?: string;
  date_from?: string;
  date_to?: string;
  sort?: VisitHistorySort;
}

export class GetVisitHistory {
  static Route = "/visits";

  static Params: VisitHistoryFilters;

  static Res: {
    success: boolean;
    data: VisitHistoryItemI[];
    meta: {
      current_page: number;
      per_page: number;
      last_page: number;
      total: number;
      from: number | null;
      to: number | null;
    };
    links: {
      next: string | null;
      prev: string | null;
    };
  };
}

export class PostCancelVisit {
  static Route = "/visits/:id/cancel";

  static Res: {
    message: string;
    success?: boolean;
  };
}

export class PostApproveExitVisit {
  static Route = "/visits/:id/approve-exit";

  static Res: {
    message: string;
    success?: boolean;
  };
}

export class PostDenyExitVisit {
  static Route = "/visits/:id/deny-exit";

  static Res: {
    message: string;
    success?: boolean;
  };
}

export interface BillPaymentLinkI {
  provider: string;
  name: string;
  logo: string;
  payment_url: string;
  reference: string;
  original_amount: string;
  fee: number;
  amount_charged: number;
}

export interface BillCustomerI {
  id: number;
  house_no: string;
  name: string;
}

export interface BillI {
  id: number;
  invoice_no: string;
  description: string;
  status: string;
  amount: string;
  paid_amount: string;
  balance_due: number;
  value_date: string;
  payment_due_date: string | null;
  customer: BillCustomerI;
  payment_links: BillPaymentLinkI[];
}

export class GetBills {
  static Route = "/bills";

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: BillI[];
  };
}

export class PostPayWithWalletBill {
  static Route = "/pay-with-wallet/bill";

  static Body: {
    invoice_no: string;
    pin: number;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
  };
}

export class PostDemandNoticePaymentLinksRegenerate {
  static Route = "/demand-notice/payment-links/regenerate";

  static Body: {
    invoice_id: number;
    customer_id: number;
    branch_id: number;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: BillPaymentLinkI[];
  };
}

export class GetVerifyDemandNoticePayment {
  static Route = "/verify-demand-notice-payment";

  static Params: {
    reference: string;
    tenant_id: string;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: {
      payment_status: string;
      is_successful: boolean;
      already_processed: boolean;
      reference: string;
      amount: string;
      invoice_no: string;
      invoice_status: string;
    };
  };
}

export class GetSalesItems {
  static Route = "/sales-items";

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: Record<string, string>;
  };
}

export interface QuotaUsageI {
  window: {
    from: string;
    to: string;
    days: number;
    granularity: string;
  };
  quota: {
    enabled: boolean;
    type: "money" | "kwh" | string;
    amount: string | number | null;
    tariff_rate: string | number | null;
    has_override: boolean;
  };
  usage: {
    kwh: { spent: number; remaining: number | null };
    money: { spent: number; remaining: number | null };
  };
  series: { bucket: string; kwh: number; money: number }[];
}

export class GetElectricityQuotaUsage {
  static Route = "/electricity/usage";

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: QuotaUsageI;
  };
}

export interface MeterI {
  id: number;
  meter_type: string;
  meter_number: string;
  pan: string;
  property: {
    id: number;
    house_no: string;
  };
  levy_setup: {
    id: number;
    name: string;
  };
  created_at: string;
}

export class GetMeter {
  static Route = "/meters/:id";

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: MeterI;
  };
}

export class PostMeterTispTokenBuyWithWallet {
  static Route = "/meters/:meterPan/tisp-token/buy-with-wallet";

  static Body: {
    amount: number;
    pin: number;
    levy_id: number;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data?: {
      token?: string;
      reference?: string;
    };
  };
}

export class PostElectricityPaymentLinksGenerate {
  static Route = "/electricity/payment-links/generate";

  static Body: {
    meter_id: number;
    amount: number;
    levy_id: number;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: BillPaymentLinkI[];
  };
}

export interface ElectricityPurchaseI {
  id: number;
  reference: string;
  amount: number;
  fee: number | null;
  amount_charged: number | null;
  payment_provider: string;
  payment_channel: string;
  status: string;
  token: string | null;
  transaction_id: string | null;
  meter: {
    id: number;
    pan: string;
    meter_type: string;
  };
  paid_at: string | null;
  vended_at: string | null;
  created_at: string;
}

export class GetElectricityPurchases {
  static Route = "/properties/:customer/electricity-purchases";

  static Params: {
    page?: number;
    per_page?: number;
    status?: string;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: {
      items: ElectricityPurchaseI[];
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
      from: number | null;
      to: number | null;
    };
  };
}

export class GetVerifyElectricityPayment {
  static Route = "/verify-electricity-payment";

  static Params: {
    reference: string;
    tenant_id: string;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: {
      payment_status: string;
      is_successful: boolean;
      already_processed: boolean;
      reference: string;
      amount: number;
      token: string | null;
      meter_pan: string;
      transaction_id: string | null;
    };
  };
}

// ============================================================
// Support Tickets ("Report Issue")
// ============================================================

export type SupportTicketStatus =
  | "open"
  | "replied"
  | "on_hold"
  | "resolved"
  | "closed";

export type SupportTicketPriority = "low" | "medium" | "high";

export type SupportTicketActivityType =
  | "created"
  | "status_changed"
  | "priority_changed"
  | "assigned"
  | "unassigned"
  | "commented"
  | "resolved"
  | "reopened"
  | "attachment_added";

export interface SupportIssueTypeI {
  id: number;
  name: string;
  description: string | null;
  color?: string | null;
  icon: string | null;
  default_priority: SupportTicketPriority;
  is_active: boolean;
}

export interface SupportTicketAssigneeI {
  role: string;
  type: string;
  id: number;
  name: string;
}

export interface SupportTicketAttachmentI {
  id: number;
  type: "image" | "document";
  url: string;
  thumbnail_url: string | null;
  file_name: string;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
  uploaded_by: { type: string; id: number };
  uploaded_at: string;
}

export interface SupportTicketCommentI {
  id: number;
  body: string;
  is_internal: boolean;
  author: { type: "admin" | "user"; id: number; name: string };
  images: SupportTicketAttachmentI[];
  documents: SupportTicketAttachmentI[];
  created_at: string;
}

export interface SupportTicketActivityI {
  id?: number;
  type?: SupportTicketActivityType;
  description: string;
  meta?: Record<string, unknown>;
  actor: { type: string; id: number };
  created_at: string;
}

export interface SupportTicketSummaryI {
  id: number;
  ticket_number: string;
  subject: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  issue_type: {
    id: number;
    name: string;
    color?: string | null;
    icon: string | null;
  };
  property: { id: number; house_no: string } | null;
  opened_at: string;
  first_responded_at: string | null;
  due_date: string | null;
  is_overdue: boolean;
  comments_count: number;
  assigned_to: SupportTicketAssigneeI[];
  thumbnail_url: string | null;
  last_activity_at: string;
}

export interface SupportTicketI extends SupportTicketSummaryI {
  description: string;
  resolution_details: string | null;
  reporter_email: string | null;
  reporter_phone: string | null;
  resolved_at: string | null;
  images: SupportTicketAttachmentI[];
  documents: SupportTicketAttachmentI[];
  comments: SupportTicketCommentI[];
  activities: SupportTicketActivityI[];
}

export class GetSupportIssueTypes {
  static Route = "/support/issue-types";

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: SupportIssueTypeI[];
  };
}

export class GetSupportTickets {
  static Route = "/support-tickets";

  static Params: {
    status?: SupportTicketStatus;
    priority?: SupportTicketPriority;
    issue_type_id?: number;
    search?: string;
    per_page?: number;
    page?: number;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: SupportTicketSummaryI[];
    meta: {
      current_page: number;
      per_page: number;
      last_page: number;
      total: number;
    };
  };
}

export class GetSupportTicket {
  static Route = "/support-tickets/:id";

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: SupportTicketI;
  };
}

export class PostSupportTicket {
  static Route = "/support-tickets";

  static Body: {
    subject: string;
    description: string;
    issue_type_id: number;
    priority?: SupportTicketPriority;
    customer_id?: number;
    images?: File[];
    attachments?: File[];
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: SupportTicketI;
  };
}

export class PostSupportTicketComment {
  static Route = "/support-tickets/:id/comments";

  static Body: {
    body?: string;
    images?: File[];
    attachments?: File[];
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: SupportTicketI;
  };
}

export class PostSupportTicketClose {
  static Route = "/support-tickets/:id/close";

  static Res: {
    status: string;
    status_code: number;
    message: string;
  };
}

export class PostSupportTicketReopen {
  static Route = "/support-tickets/:id/reopen";

  static Res: {
    status: string;
    status_code: number;
    message: string;
  };
}

export type PollVotingScope = "user" | "property";
export type PollSelectionType = "single" | "multi";
export type PollFilter = "active" | "upcoming" | "closed";

export interface PollOptionI {
  id: number;
  label: string;
  description: string | null;
  sort_order: number;
}

export interface PollI {
  id: number;
  title: string;
  description: string | null;
  voting_scope: PollVotingScope;
  selection_type: PollSelectionType;
  max_selections: number;
  status: string;
  starts_at: string;
  ends_at: string;
  published_at: string | null;
  is_open: boolean;
  has_ended: boolean;
  votes_count?: number;
  options: PollOptionI[];
}

export interface PollMyVoteI {
  has_voted: boolean;
  option_ids: number[];
  options: PollOptionI[];
}

export interface PollResultOptionI {
  id: number;
  label: string;
  description: string | null;
  votes: number;
  percentage: number;
}

export interface PollResultsI {
  options: PollResultOptionI[];
  total_votes: number;
  total_voters: number;
  eligible_voters: number;
  turnout_percentage: number;
}

export interface PollHistoryItemI {
  id: number;
  voted_at: string;
  poll: { id: number; title: string; has_ended: boolean };
  option: { id: number; label: string };
  property: { id: number; house_no: string } | null;
}

interface PaginationMetaI {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export class GetPolls {
  static Route = "/polls";

  static Params: {
    filter?: PollFilter;
    per_page?: number;
    page?: number;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: PaginationMetaI & {
      items: PollI[];
    };
  };
}

export class GetPoll {
  static Route = "/polls/:id";

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: {
      poll: PollI;
      my_vote: PollMyVoteI;
      results: PollResultsI | null;
    };
  };
}

export class PostPollVote {
  static Route = "/polls/:id/vote";

  static Body: {
    option_ids: number[];
    customer_id?: number;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: {
      already_voted: boolean;
      option_ids: number[];
      options: PollOptionI[];
    };
  };
}

export class GetPollResults {
  static Route = "/polls/:id/results";

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: PollResultsI;
  };
}

export class GetPollHistory {
  static Route = "/polls/history";

  static Params: {
    per_page?: number;
    page?: number;
  };

  static Res: {
    status: string;
    status_code: number;
    message: string;
    data: PaginationMetaI & {
      items: PollHistoryItemI[];
    };
  };
}
