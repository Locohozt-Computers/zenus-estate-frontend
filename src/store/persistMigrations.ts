import { createMigrate } from "redux-persist";
import { RootState } from "store/reducers";

type PersistedRootStateV3 = RootState;

const emptyUser = {
  token: null,
  profile_id: null,
  user_id: null,
  first_name: "",
  last_name: "",
  email: "",
  phone_number: null,
};

const persistMigrations = {
  2: (state: PersistedRootStateV3): PersistedRootStateV3 => {
    return {
      ...state,
      auth: {
        ...state.auth,
        authenticated: false,
        user: emptyUser,
      },
    };
  },
  3: (state: PersistedRootStateV3): PersistedRootStateV3 => {
    return {
      ...state,
      client: {
        estates: [],
        properties: [],
        virtualAccounts: [],
        selectedEstate: null,
        selectedProperty: null,
        showEstatePicker: false,
      },
    };
  },
  4: (state: PersistedRootStateV3): PersistedRootStateV3 => {
    return {
      ...state,
      auth: {
        ...state.auth,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        pin_is_set: false,
      },
    };
  },
  5: (state: PersistedRootStateV3): PersistedRootStateV3 => {
    return {
      ...state,
      auth: {
        ...state.auth,
        user: {
          ...state.auth.user,
          first_name: "",
          last_name: "",
          email: "",
          phone_number: null,
        },
        wallet: {
          currency: "NGN",
        },
      },
    };
  },
};

type MigrationState = PersistedRootStateV3;

// @ts-ignore
export const persistMigrate = createMigrate<MigrationState>(persistMigrations, {
  debug: process.env.NODE_ENV !== "production",
});

export const persistVersion = 5;
