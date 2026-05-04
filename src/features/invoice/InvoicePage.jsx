import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchInvoicesRequest } from "./invoiceSlice";
import InvoiceForm from "./InvoiceForm";
import InvoiceList from "./InvoiceList";

const InvoicePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInvoicesRequest());
  }, [dispatch]);

  return (
    <>
      <h2>Invoice Page</h2>
      <InvoiceForm />
      <InvoiceList />
    </>
  );
};

export default InvoicePage;