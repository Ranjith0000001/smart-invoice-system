import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const StatCard = ({ title, value, icon, color, bgColor, trend, trendLabel, subtitle }) => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", fontSize: 11 }}
            >
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 800, color: "text.primary", letterSpacing: "-1px" }}>
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 48, height: 48, borderRadius: 2.5,
              bgcolor: bgColor || `${color}20`,
              "& svg": { color: color || "primary.main", fontSize: 24 },
            }}
          >
            {icon}
          </Avatar>
        </Box>

        {subtitle && (
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            {subtitle}
          </Typography>
        )}

        {trend !== undefined && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {trend >= 0 ? (
              <TrendingUpIcon sx={{ fontSize: 16, color: "success.main" }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 16, color: "error.main" }} />
            )}
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: trend >= 0 ? "success.main" : "error.main" }}
            >
              {Math.abs(trend)}%
            </Typography>
            {trendLabel && (
              <Typography variant="caption" sx={{ color: "text.secondary", ml: 0.5 }}>
                {trendLabel}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
