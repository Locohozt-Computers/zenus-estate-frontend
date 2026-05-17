import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appRequest } from "api/request";
import { RootState } from "store/reducers/index";

export interface ElectricitySettings {
  electricity_quota_enabled: boolean;
  electricity_quota_type: string;
  electricity_quota_amount: string;
  electricity_quota_days: number;
  electricity_tariff_rate: string;
}

export interface SettingsState {
  electricity: ElectricitySettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  electricity: null,
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await appRequest.get<{
        success: boolean;
        data: {
          electricity_quota_enabled: boolean;
          electricity_quota_type: string;
          electricity_quota_amount: string;
          electricity_quota_days: number;
          electricity_tariff_rate: string;
        };
      }>("/settings");
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch settings"
      );
    }
  }
);

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearSettings: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSettings.fulfilled,
        (state, action: PayloadAction<ElectricitySettings>) => {
          state.loading = false;
          state.electricity = action.payload;
        }
      )
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const settingsActions = { ...settingsSlice.actions };

export const settingsSelectors = {
  electricity: (state: RootState) => state.settings.electricity,
  isLoading: (state: RootState) => state.settings.loading,
  error: (state: RootState) => state.settings.error,
};

export default settingsSlice.reducer;
