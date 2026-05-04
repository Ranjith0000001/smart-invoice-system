import { useSelector } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import { useMemo, useState } from "react";
import { Chip, Box, MenuItem, Select, Button } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import api from "../../services/api";
import { STRIPE_PUBLIC_KEY } from "../../config/stripe";

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

console.log("dscsdfc", stripePromise)

const getStatusColor = (status) => {
  switch (status) {
    case "Paid":
      return "success";
    case "Failed":
      return "error";
    case "Sent":
      return "info";
    default:
      return "warning";
  }
};

const InvoiceList = () => {
  const { invoices, loading } = useSelector((state) => state.invoice);
  const [filter, setFilter] = useState("All");

  // 🔍 Filter
  const filteredData =
    filter === "All"
      ? invoices
      : invoices.filter((inv) => inv.status === filter);

 const handlePay = async (invoiceId) => {
  try {
    const response = await api.post(`/invoices/${invoiceId}/pay`);

    const checkoutUrl = response.data?.url;

    if (!checkoutUrl) {
      alert("No checkout URL received");
      return;
    }

    window.location.href = checkoutUrl;
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Payment failed");
  }
};
  // 📊 Columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "customerName",
        header: "Customer",
      },
      {
        accessorKey: "total",
        header: "Total",
        Cell: ({ cell }) => `₹${cell.getValue()}`,
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Chip label={cell.getValue()} color={getStatusColor(cell.getValue())} />
        ),
      },
      {
        header: "Actions",
        Cell: ({ row }) => (
          <Button
            variant="contained"
            disabled={row.original.status === "Paid"}
            onClick={() => handlePay(row.original._id)}
          >
            Pay
          </Button>
        ),
      },
    ],
    []
  );

  if (loading) return <p>Loading...</p>;

  return (
    <Box>
      <h2>Invoice List</h2>

      {/* Filter */}
      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2, minWidth: 200 }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Draft">Draft</MenuItem>
        <MenuItem value="Sent">Sent</MenuItem>
        <MenuItem value="Paid">Paid</MenuItem>
        <MenuItem value="Failed">Failed</MenuItem>
      </Select>

      {/* Table */}
      <MaterialReactTable
        columns={columns}
        data={filteredData}
        enableSorting
        enablePagination
      />
    </Box>
  );
};

export default InvoiceList;