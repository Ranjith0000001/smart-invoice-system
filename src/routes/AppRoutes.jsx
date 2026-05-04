import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import InvoicePage from "../features/invoice/InvoicePage";
import InvoiceForm from "../features/invoice/InvoiceForm";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchInvoicesRequest } from "../features/invoice/invoiceSlice";

const AppContent = () => {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchInvoicesRequest()); }, [dispatch]);
  return (
    <Routes>
      {/* Payment feedback pages — no sidebar */}
      <Route path="/success" element={<Success />} />
      <Route path="/cancel"  element={<Cancel />} />

      {/* Main app — with sidebar Layout */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/"                element={<Dashboard />} />
              <Route path="/invoices"        element={<InvoicePage />} />
              <Route path="/invoices/create" element={<InvoiceForm />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
};

const AppRoutes = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default AppRoutes;