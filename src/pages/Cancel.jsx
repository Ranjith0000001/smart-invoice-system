import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", bgcolor: "#f1f5f9", px: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 440, width: "100%", p: 5, borderRadius: 4,
          textAlign: "center", border: "1px solid #e2e8f0",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        {/* Cancel icon */}
        <Box
          sx={{
            width: 80, height: 80, borderRadius: "50%", mx: "auto", mb: 3,
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(239,68,68,0.35)",
            animation: "pop 0.5s ease",
            "@keyframes pop": {
              "0%":   { transform: "scale(0.5)", opacity: 0 },
              "70%":  { transform: "scale(1.1)" },
              "100%": { transform: "scale(1)", opacity: 1 },
            },
          }}
        >
          <CancelRoundedIcon sx={{ fontSize: 44, color: "white" }} />
        </Box>

        <Typography variant="h5" fontWeight={800} sx={{ color: "text.primary", mb: 1 }}>
          Payment Cancelled
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          You cancelled the payment. No charges were made to your account.
        </Typography>

        <Box
          sx={{
            bgcolor: "#fff7ed", border: "1px solid #fed7aa",
            borderRadius: 2, p: 2, mb: 3,
          }}
        >
          <Typography variant="caption" color="warning.dark" fontWeight={600}>
            ⚠ Invoice is still unpaid — you can retry anytime
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ReceiptLongRoundedIcon />}
            onClick={() => navigate("/invoices")}
            sx={{ borderRadius: 2, flex: 1 }}
          >
            View Invoices
          </Button>
          <Button
            variant="contained"
            startIcon={<ReplayRoundedIcon />}
            onClick={() => navigate("/invoices")}
            sx={{ borderRadius: 2, flex: 1 }}
          >
            Retry Payment
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Cancel;