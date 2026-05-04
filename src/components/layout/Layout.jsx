import { useState } from "react";
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Divider, useTheme, useMediaQuery, Badge, Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 260;

const navItems = [
  { label: "Dashboard",      icon: <DashboardRoundedIcon />,        path: "/" },
  { label: "Invoices",       icon: <ReceiptLongRoundedIcon />,       path: "/invoices" },
  { label: "Create Invoice", icon: <AddCircleOutlineRoundedIcon />,  path: "/invoices/create" },
];

const DrawerContent = ({ location, navigate }) => (
  <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#0f172a" }}>
    {/* Logo */}
    <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box sx={{
        width: 42, height: 42, borderRadius: 2.5,
        background: "linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
      }}>
        <ReceiptLongRoundedIcon sx={{ color: "white", fontSize: 22 }} />
      </Box>
      <Box>
        <Typography sx={{ color: "#f1f5f9", fontWeight: 800, fontSize: 16, lineHeight: 1.2, letterSpacing: "-0.3px" }}>
          SmartInvoice
        </Typography>
        <Typography sx={{ color: "#475569", fontSize: 11, fontWeight: 500 }}>
          Payment System
        </Typography>
      </Box>
    </Box>

    <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2 }} />

    {/* Nav Label */}
    <Typography sx={{ px: 3, pt: 2.5, pb: 1, color: "#94a3b8", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
      Main Menu
    </Typography>

    {/* Nav Items */}
    <List sx={{ px: 1.5, flex: 1 }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2, py: 1.3, px: 1.5,
                bgcolor: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                border: isActive ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                "&:hover": { bgcolor: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)" },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon sx={{
                minWidth: 38,
                color: isActive ? "#818cf8" : "#94a3b8",
                "& svg": { fontSize: 20 },
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#ffffff" : "#cbd5e1",
                }}
              />
              {isActive && (
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#6366f1", ml: 1 }} />
              )}
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>

    <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2, mb: 2 }} />

    {/* User Card */}
    <Box sx={{ p: 2 }}>
      <Box sx={{
        display: "flex", alignItems: "center", gap: 1.5, p: 1.5,
        borderRadius: 2, bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <Avatar sx={{ width: 34, height: 34, background: "linear-gradient(135deg,#6366f1,#0ea5e9)", fontSize: 13, fontWeight: 700 }}>
          A
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600 }}>Admin User</Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            admin@invoice.com
          </Typography>
        </Box>
        <Tooltip title="Settings">
          <IconButton size="small" sx={{ color: "#475569", "&:hover": { color: "#6366f1" } }}>
            <SettingsRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  </Box>
);

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = navItems.find((i) => i.path === location.pathname)?.label || "Smart Invoice";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Permanent Sidebar — Desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH, flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH, boxSizing: "border-box", border: "none",
              bgcolor: "#0f172a", color: "#f1f5f9",
            },
          }}
        >
          <DrawerContent location={location} navigate={navigate} />
        </Drawer>
      )}

      {/* Temporary Drawer — Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH, border: "none",
            bgcolor: "#0f172a", color: "#f1f5f9",
          },
        }}
      >
        <DrawerContent location={location} navigate={navigate} />
      </Drawer>

      {/* Main Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "white",
            borderBottom: "1px solid",
            borderColor: "divider",
            zIndex: (t) => t.zIndex.drawer - 1,
          }}
        >
          <Toolbar sx={{ gap: 1 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} edge="start" sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ color: "text.primary", fontWeight: 700, flex: 1 }}>
              {currentPage}
            </Typography>
            <Tooltip title="Notifications">
              <IconButton sx={{ color: "text.secondary" }}>
                <Badge badgeContent={3} color="primary">
                  <NotificationsNoneRoundedIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar sx={{ width: 34, height: 34, background: "linear-gradient(135deg,#6366f1,#0ea5e9)", fontSize: 13, fontWeight: 700 }}>
              A
            </Avatar>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
