import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvoicePage from "../features/invoice/InvoicePage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";

const AppRoutes = () => {
  return (
    <BrowserRouter>
<Routes>
  <Route path="/" element={<InvoicePage />} />
  <Route path="/success" element={<Success />} />
  <Route path="/cancel" element={<Cancel />} />
</Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;