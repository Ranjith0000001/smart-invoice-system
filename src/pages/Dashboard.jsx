import { useSelector } from "react-redux";
import { useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import StatCard from "../components/common/StatCard";

const Dashboard = () => {
  const { invoices } = useSelector((state) => state.invoice);

  const stats = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter((i) => i.status === "Paid");
    const draft = invoices.filter((i) => i.status === "Draft");
    const sent = invoices.filter((i) => i.status === "Sent");
    const failed = invoices.filter((i) => i.status === "Failed");
    const revenue = paid.reduce((s, i) => s + (i.total || 0), 0);
    const pending = [...draft, ...sent].reduce((s, i) => s + (i.total || 0), 0);
    
    return { total, paid: paid.length, draft: draft.length, sent: sent.length, failed: failed.length, revenue, pending };
  }, [invoices]);

  const statCards = [
    {
      title: "Total Invoices",
      value: stats.total,
      icon: <ReceiptLongRoundedIcon />,
      color: "#6366f1",
      bgColor: "rgba(99,102,241,0.1)",
      subtitle: "All time invoices",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.revenue.toFixed(2)}`,
      icon: <AttachMoneyRoundedIcon />,
      color: "#10b981",
      bgColor: "rgba(16,185,129,0.1)",
      subtitle: "From paid invoices",
    },
    {
      title: "Paid Invoices",
      value: stats.paid,
      icon: <CheckCircleRoundedIcon />,
      color: "#10b981",
      bgColor: "rgba(16,185,129,0.1)",
      subtitle: `₹${(invoices.filter(i => i.status === "Paid").reduce((s, i) => s + (i.total || 0), 0)).toFixed(2)} collected`,
    },
    {
      title: "Pending",
      value: stats.draft + stats.sent,
      icon: <PendingRoundedIcon />,
      color: "#f59e0b",
      bgColor: "rgba(245,158,11,0.1)",
      subtitle: `₹${stats.pending.toFixed(2)} outstanding`,
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: <CancelRoundedIcon />,
      color: "#ef4444",
      bgColor: "rgba(239,68,68,0.1)",
      subtitle: "Require attention",
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary" }}>
          Welcome back, Admin 👋
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Here's an overview of your invoice activity today.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={card.title}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
