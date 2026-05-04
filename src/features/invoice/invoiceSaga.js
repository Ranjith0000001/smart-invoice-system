import { call, put, takeLatest } from "redux-saga/effects";
import api from "../../services/api";
import {
  fetchInvoicesRequest,
  fetchInvoicesSuccess,
  fetchInvoicesFailure,
  createInvoiceRequest,
  createInvoiceSuccess,
  createInvoiceFailure,
} from "./invoiceSlice";

function* fetchInvoices() {
  try {
    const response = yield call(api.get, "/invoices");
    yield put(fetchInvoicesSuccess(response.data));
  } catch (err) {
    yield put(fetchInvoicesFailure());
  }
}

function* createInvoice(action) {
  try {
    const response = yield call(api.post, "/invoices", action.payload);
    yield put(createInvoiceSuccess(response.data));
  } catch (err) {
    yield put(createInvoiceFailure());
  }
}

export default function* invoiceSaga() {
  yield takeLatest(fetchInvoicesRequest.type, fetchInvoices);
  yield takeLatest(createInvoiceRequest.type, createInvoice);
}