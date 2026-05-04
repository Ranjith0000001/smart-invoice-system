import { all } from "redux-saga/effects";
import invoiceSaga from "../features/invoice/invoiceSaga";

export default function* rootSaga() {
  yield all([invoiceSaga()]);
}