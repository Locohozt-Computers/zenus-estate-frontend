import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EstateI, PropertyI, VirtualAccountI } from "api/types";
import { RootState } from "store/reducers/index";

export interface ClientState {
  estates: EstateI[];
  properties: PropertyI[];
  virtualAccounts: VirtualAccountI[];
  selectedEstate: EstateI | null;
  selectedProperty: PropertyI | null;
  showEstatePicker: boolean;
}

const initialState: ClientState = {
  estates: [],
  properties: [],
  virtualAccounts: [],
  selectedEstate: null,
  selectedProperty: null,
  showEstatePicker: false,
};

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setVirtualAccounts: (state, action: PayloadAction<VirtualAccountI[]>) => {
      state.virtualAccounts = action.payload;
    },
    setEstates: (state, action: PayloadAction<EstateI[]>) => {
      state.estates = action.payload;
      state.showEstatePicker = action.payload.length > 0;
    },
    openEstatePicker: (state) => {
      state.showEstatePicker = true;
    },
    selectEstate: (state, action: PayloadAction<EstateI>) => {
      state.selectedEstate = action.payload;
      state.showEstatePicker = false;
      state.selectedProperty = null;
      state.properties = [];
    },
    setProperties: (state, action: PayloadAction<PropertyI[]>) => {
      state.properties = action.payload;
    },
    selectProperty: (state, action: PayloadAction<PropertyI>) => {
      state.selectedProperty = action.payload;
    },
    clearClient: () => {
      return { ...initialState };
    },
  },
});

export const clientActions = { ...clientSlice.actions };

export const clientSelectors = {
  estates: (state: RootState) => state.client.estates,
  virtualAccounts: (state: RootState) => state.client.virtualAccounts,
  selectedEstate: (state: RootState) => state.client.selectedEstate,
  properties: (state: RootState) => state.client.properties,
  selectedProperty: (state: RootState) => state.client.selectedProperty,
  showEstatePicker: (state: RootState) => state.client.showEstatePicker,
};

export default clientSlice.reducer;
