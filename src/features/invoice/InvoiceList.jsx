import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState } from "react";
import { Box, Typography, Avatar, Tooltip, IconButton } from "@mui/material";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import api from "../../services/api";
import StatusChip from "../../components/common/StatusChip";
import CustomButton from "../../components/common/CustomButton";
import { fetchInvoicesRequest } from "./invoiceSlice";
import { useNavigate } from "react-router-dom";

const InvoiceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoices, loading } = useSelector((state) => state.invoice);
  const [paying, setPaying] = useState(null);

  const handlePay = async (invoiceId) => {
    setPaying(invoiceId);
    try {
      const response = await api.post(`/invoices/${invoiceId}/pay`);
      const checkoutUrl = response.data?.url;
      if (!checkoutUrl) { alert("No checkout URL received"); return; }
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setPaying(null);
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColor = (name = "") => {
    const colors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "customerName",
        header: "Customer",
        size: 250,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: avatarColor(row.original.customerName), fontSize: 12, fontWeight: 700 }}>
              {getInitials(row.original.customerName)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>{row.original.customerName}</Typography>
              {row.original.customerEmail && (
                <Typography variant="caption" color="text.secondary">{row.original.customerEmail}</Typography>
              )}
            </Box>
          </Box>
        ),
      },
      {
        accessorKey: "_id",
        header: "Invoice ID",
        size: 150,
        Cell: ({ cell }) => (
          <Typography variant="caption" sx={{ fontFamily: "monospace", bgcolor: "#f1f5f9", px: 1, py: 0.5, borderRadius: 1, fontSize: 11 }}>
            #{cell.getValue()?.slice(-8) || "—"}
          </Typography>
        ),
      },
      {
        accessorKey: "items",
        header: "Items",
        size: 100,
        Cell: ({ cell }) => (
          <Typography variant="body2" color="text.secondary">
            {cell.getValue()?.length || 0} item{cell.getValue()?.length !== 1 ? "s" : ""}
          </Typography>
        ),
      },
      {
        accessorKey: "total",
        header: "Total",
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2" fontWeight={700} color="text.primary">
            ₹{(cell.getValue() || 0).toFixed(2)}
          </Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        Cell: ({ cell }) => <StatusChip status={cell.getValue()} />,
        filterVariant: 'select',
        filterSelectOptions: ['Draft', 'Sent', 'Paid', 'Failed'],
      },
      {
        id: "actions",
        header: "Action",
        size: 120,
        Cell: ({ row }) => (
          <CustomButton
            size="small"
            variant={row.original.status === "Paid" ? "outlined" : "contained"}
            disabled={row.original.status === "Paid"}
            loading={paying === row.original._id}
            onClick={() => handlePay(row.original._id)}
            startIcon={<PaymentRoundedIcon sx={{ fontSize: 16 }} />}
            color={row.original.status === "Failed" ? "error" : "primary"}
            sx={{ borderRadius: 1.5, fontSize: 12, minWidth: 90 }}
          >
            {row.original.status === "Paid" ? "Paid" : row.original.status === "Failed" ? "Retry" : "Pay Now"}
          </CustomButton>
        ),
      },
    ],
    [paying]
  );

  const table = useMaterialReactTable({
    columns,
    data: invoices || [],
    state: { isLoading: loading },
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    initialState: { 
      pagination: { pageSize: 10, pageIndex: 0 },
      showGlobalFilter: true,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      },
    },
    muiTopToolbarProps: {
      sx: {
        backgroundColor: "transparent",
        padding: "16px",
      }
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#f8fafc",
        fontWeight: 700,
        fontSize: 12,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
        <CustomButton
          variant="contained"
          startIcon={<AddCircleOutlineRoundedIcon />}
          onClick={() => navigate("/invoices/create")}
          sx={{ borderRadius: 2 }}
        >
          New Invoice
        </CustomButton>
        <Tooltip title="Refresh">
          <IconButton onClick={() => dispatch(fetchInvoicesRequest())} sx={{ border: "1px solid", borderColor: "divider" }}>
            <RefreshRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>All Invoices</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage your generated invoices and track their payment statuses seamlessly.
        </Typography>
      </Box>

      {/* MRT Table */}
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default InvoiceList;