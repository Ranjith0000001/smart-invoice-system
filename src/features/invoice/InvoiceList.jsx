import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState } from "react";
import { Box, Typography, Avatar, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import api from "../../services/api";
import StatusChip from "../../components/common/StatusChip";
import CustomButton from "../../components/common/CustomButton";
import { fetchInvoicesRequest } from "./invoiceSlice";
import { useNavigate } from "react-router-dom";

const InvoiceList = () => {
  const navigate = useNavigate();
  const { invoices, loading } = useSelector((state) => state.invoice);
  const [paying, setPaying] = useState(null);
  const [viewItems, setViewItems] = useState(null);

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

  // Generate PDF Invoice document using jsPDF and jspdf-autotable
  const handleGeneratePdf = (invoice) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("INVOICE", 14, 22);

    // Details
    doc.setFontSize(12);
    doc.text(`Invoice ID: #${invoice._id?.slice(-8) || "N/A"}`, 14, 32);
    doc.text(`Customer Name: ${invoice.customerName}`, 14, 40);
    doc.text(`Status: ${invoice.status}`, 14, 56);

    // Line Items Table
    const tableData = invoice.items?.map((item) => [
      item.name,
      item.quantity,
      `INR ${item.price.toFixed(2)}`,
      `INR ${(item.quantity * item.price).toFixed(2)}`,
    ]) || [];

    autoTable(doc, {
      startY: 64,
      head: [["Item Description", "Quantity", "Price", "Amount"]],
      body: tableData,
      foot: [
        ["", "", "Subtotal", `INR ${invoice.subtotal?.toFixed(2) || "0.00"}`],
        ["", "", "Tax (10%)", `INR ${invoice.tax?.toFixed(2) || "0.00"}`],
        ["", "", "Total", `INR ${invoice.total?.toFixed(2) || "0.00"}`]
      ],
      headStyles: { fillColor: [99, 102, 241] }, // Match primary color
    });

    // Save PDF
    doc.save(`Invoice_${invoice._id?.slice(-8) || "Draft"}.pdf`);
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
        Cell: ({ cell }) => {
          const items = cell.getValue() || [];
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </Typography>
              {items.length > 0 && (
                <IconButton size="small" onClick={() => setViewItems(items)} sx={{ p: 0.5 }}>
                  <InfoOutlinedIcon sx={{ fontSize: 18, color: "text.secondary", "&:hover": { color: "primary.main" } }} />
                </IconButton>
              )}
            </Box>
          );
        },
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
        size: 180, // Increased size slightly to fit icons
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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

            {/* Action Icon: Generate PDF Invoice */}
            <Tooltip title="Download PDF">
              <IconButton size="small" onClick={() => handleGeneratePdf(row.original)} color="primary">
                <PictureAsPdfRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
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

      {/* Items Details Modal */}
      <Dialog open={Boolean(viewItems)} onClose={() => setViewItems(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700 }}>
          Item Details
          <IconButton onClick={() => setViewItems(null)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Product</b></TableCell>
                <TableCell><b>Quantity</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell><b>Amount</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {viewItems?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.price.toFixed(2)}</TableCell>
                  <TableCell>₹{(item.quantity * item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default InvoiceList;