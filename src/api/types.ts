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
