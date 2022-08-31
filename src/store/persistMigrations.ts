import { createMigrate } from "redux-persist";
import { RootState } from "store/reducers";

/*
 * Latest version (V3) is simply the currently used redux RootState.
 */
type PersistedRootStateV3 = RootState;

/*
 * The entire `slice` reducer was added when going from V1 to V2, so omit it from the
 * V2 definition. This approach of building incrementally backwards also means that we
 * don't have to update all of the old state types each time we add a new migration.
 */
// type PersistedRootStateV1 = Omit<PersistedRootStateV2, "slice">;

/*
 * Each migration step will take one version as input and return the next version as output.
 * (The key `2` means that it is the step which migrates from V1 to V2.)
 */
const persistMigrations = {
  2: (state: PersistedRootStateV3): PersistedRootStateV3 => {
    return {
      ...state,
      auth: {
        ...state.auth,
        authenticated: false,
        user: {
          token: null,
          profile_id: null,
          user_id: null,
        },
      },
    };
  },
};

/*
 * A union type is created specifically to use below.
 */
type MigrationState = PersistedRootStateV3;

/*
 * The union type is used as the generic for `createMigrate`. The type must be explicitly
 * provided. Relying on type inference here would fail because it would assume {}.
 */

// @ts-ignore
export const persistMigrate = createMigrate<MigrationState>(persistMigrations, {
  debug: process.env.NODE_ENV !== "production",
});

/*
 * This is the current version and should match the latest version above.
 */
export const persistVersion = 2;
