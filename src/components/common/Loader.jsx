import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = ({ text = "Loading...", minHeight = "200px" }) => {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight,
        width: "100%"
      }}
    >
      <CircularProgress size={32} thickness={5} sx={{ mb: 2, color: "primary.main" }} />
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {text}
      </Typography>
    </Box>
  );
};

export default Loader;