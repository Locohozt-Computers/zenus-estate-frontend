import { RootState } from "./reducers";

export const migrations = {
  0: (prevState: RootState) => ({
    ...prevState,
  }),
};
