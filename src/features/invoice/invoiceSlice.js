import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [],
  loading: false,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    fetchInvoicesRequest: (state) => {
      state.loading = true;
    },
    fetchInvoicesSuccess: (state, action) => {
      state.loading = false;
      state.invoices = action.payload;
    },
    fetchInvoicesFailure: (state) => {
      state.loading = false;
    },

    createInvoiceRequest: (state, action) => {
      state.loading = true;
    },
    createInvoiceSuccess: (state, action) => {
      state.loading = false;
      state.invoices.push(action.payload);
    },
    createInvoiceFailure: (state) => {
      state.loading = false;
    },
  },
});

export const {
  fetchInvoicesRequest,
  fetchInvoicesSuccess,
  fetchInvoicesFailure,
  createInvoiceRequest,
  createInvoiceSuccess,
  createInvoiceFailure,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;