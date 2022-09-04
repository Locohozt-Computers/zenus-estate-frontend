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
    }>;
  };
}

export class GetPaymentMethod {
  static Route = "/payment-method";

  static Res: {
    status: number;
    message: string;
    data: Array<{
      id: number;
      name: string;
    }>;
  };
}

export class PostBillPayment {
  static Route = "/bill-payment";

  static Body: {
    payment_method_id: number;
    amount: number; // kobo
    fee: number;
    final_amount: number;
    payment_type_id: number;
    reference: string;
    trxref: string;
  };

  static Res: {
    status: number;
    message: string;
    data: {
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
    };
  };
}

interface EmergencyTypesI {
  id: number;
  name: string;
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
// .concat(["add new", "add new", "add new"])

export class PostCreateEmergency {
  static Route = "/emergency";

  static Body: {
    emergency_type_id?: number;
    description: string;
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
