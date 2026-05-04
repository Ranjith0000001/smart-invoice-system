import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchInvoicesRequest } from "./invoiceSlice";
import InvoiceList from "./InvoiceList";

const InvoicePage = () => {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchInvoicesRequest()); }, [dispatch]);
  return <InvoiceList />;
};

export default InvoicePage;