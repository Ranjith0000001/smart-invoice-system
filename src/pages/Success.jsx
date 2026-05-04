import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      api.get(`/invoices/verify-payment/${sessionId}`)
        .then(() => setVerifying(false))
        .catch(() => setVerifying(false));
    } else {
      setVerifying(false);
    }
  }, [searchParams]);
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
        {verifying ? (
          <>
            <Box sx={{ py: 4 }}>
              <Typography variant="h6" color="text.secondary">Verifying payment...</Typography>
            </Box>
          </>
        ) : (
          <>
            {/* Success icon */}
            <Box
              sx={{
                width: 80, height: 80, borderRadius: "50%", mx: "auto", mb: 3,
                background: "linear-gradient(135deg, #10b981, #059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
                animation: "pop 0.5s ease",
                "@keyframes pop": {
                  "0%":   { transform: "scale(0.5)", opacity: 0 },
                  "70%":  { transform: "scale(1.1)" },
                  "100%": { transform: "scale(1)", opacity: 1 },
                },
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 44, color: "white" }} />
            </Box>

            <Typography variant="h5" fontWeight={800} sx={{ color: "text.primary", mb: 1 }}>
              Payment Successful! 🎉
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your payment has been processed successfully. Your invoice has been updated.
            </Typography>

            <Box
              sx={{
                bgcolor: "#f0fdf4", border: "1px solid #bbf7d0",
                borderRadius: 2, p: 2, mb: 3,
              }}
            >
              <Typography variant="caption" color="success.dark" fontWeight={600}>
                ✓ Invoice status updated to Paid
              </Typography>
            </Box>
          </>
        )}

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
          <Button
            variant="outlined"
            startIcon={<ReceiptLongRoundedIcon />}
            onClick={() => navigate("/invoices")}
            sx={{ borderRadius: 2, flex: 1 }}
          >
            View Invoices
          </Button>
          <Button
            variant="contained"
            startIcon={<DashboardRoundedIcon />}
            onClick={() => navigate("/")}
            sx={{ borderRadius: 2, flex: 1 }}
          >
            Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Success;