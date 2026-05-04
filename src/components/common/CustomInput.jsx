import { TextField } from "@mui/material";
import { forwardRef } from "react";

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField inputRef={ref} fullWidth margin="normal" size="small" {...props} />;
});

CustomInput.displayName = "CustomInput";

export default CustomInput;