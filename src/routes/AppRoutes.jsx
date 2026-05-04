import { BrowserRouter, Routes, Route } from "react-router-dom";
import InvoicePage from "../features/invoice/InvoicePage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InvoicePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;