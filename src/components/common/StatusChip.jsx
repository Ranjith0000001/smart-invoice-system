import { Chip } from "@mui/material";

const statusConfig = {
  Paid:    { color: "success", label: "Paid" },
  Failed:  { color: "error",   label: "Failed" },
  Sent:    { color: "info",    label: "Sent" },
  Draft:   { color: "warning", label: "Draft" },
  Pending: { color: "warning", label: "Pending" },
};

const StatusChip = ({ status, size = "small" }) => {
  const config = statusConfig[status] || { color: "default", label: status };
  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      variant="filled"
      sx={{ fontWeight: 700, borderRadius: "6px", fontSize: 11 }}
    />
  );
};

export default StatusChip;
