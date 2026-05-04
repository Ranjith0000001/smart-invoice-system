import { Button, CircularProgress } from "@mui/material";

const CustomButton = ({ children, loading, disabled, ...props }) => {
  return (
    <Button
      disabled={loading || disabled}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : props.startIcon}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;