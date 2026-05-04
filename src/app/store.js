import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./rootSaga";
import invoiceReducer from "../features/invoice/invoiceSlice";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    invoice: invoiceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;