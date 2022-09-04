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
  static Route = "/profile/:id";

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

export class GetAllEmergencies {
  static Route = "/emergency";

  static Res: {
    status: number;
    message: string;
    data: [];
  };
}

export class GetOustandingBalance {
  static Route = "/user-levy-type-balance/1";

  static Res: {
    status: number;
    message: string;
    data: [];
  };
}
