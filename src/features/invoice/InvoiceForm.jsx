import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createInvoiceRequest } from "./invoiceSlice";
import {
  Box, Grid, Paper, Typography, IconButton,
  Divider, Alert, Chip, InputAdornment,
} from "@mui/material";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CustomInput from "../../components/common/CustomInput";
import CustomButton from "../../components/common/CustomButton";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const InvoiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.invoice);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      customerName: "",
      customerEmail: "",
      items: [{ name: "", quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  
  const watchedItems = useWatch({
    control,
    name: "items",
  }) || fields;

  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = watchedItems.reduce((sum, item) => sum + (Number(item?.quantity || 0) * Number(item?.price || 0) || 0), 0);
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
  }, [watchedItems]);

  const onSubmit = (data) => {
    const finalData = { ...data, subtotal, tax, total, status: "Draft" };
    dispatch(createInvoiceRequest(finalData));
    reset();
    setTimeout(() => navigate("/invoices"), 500);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary" }}>
          Create New Invoice
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Fill in the details below to generate an invoice.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Customer Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                <PersonOutlineRoundedIcon sx={{ color: "primary.main", fontSize: 20 }} />
                <Typography variant="h6" fontWeight={700}>Customer Details</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CustomInput
                    label="Customer Name"
                    error={!!errors.customerName}
                    helperText={errors.customerName ? "Customer name is required" : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                    {...register("customerName", { required: true })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomInput
                    label="Customer Email"
                    type="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                    {...register("customerEmail")}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Line Items */}
            <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", mt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <InventoryRoundedIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography variant="h6" fontWeight={700}>Line Items</Typography>
                  <Chip label={`${fields.length} item${fields.length !== 1 ? "s" : ""}`} size="small" color="primary" variant="outlined" />
                </Box>
                <CustomButton
                  size="small"
                  variant="outlined"
                  startIcon={<AddCircleOutlineRoundedIcon />}
                  onClick={() => append({ name: "", quantity: 1, price: 0 })}
                  sx={{ borderRadius: 2 }}
                >
                  Add Item
                </CustomButton>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {/* Column Headers */}
              <Grid container spacing={2} sx={{ mb: 1, px: 0.5 }}>
                <Grid item xs={5}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>
                    Item Name
                  </Typography>
                </Grid>
                <Grid item xs={2.5}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>
                    Qty
                  </Typography>
                </Grid>
                <Grid item xs={2.5}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>
                    Price (₹)
                  </Typography>
                </Grid>
                
              </Grid>

              {fields.map((field, index) => {
                const qty = Number(watchedItems[index]?.quantity) || 0;
                const price = Number(watchedItems[index]?.price) || 0;
                const amount = qty * price;
                return (
                  <Box
                    key={field.id}
                    sx={{
                      borderRadius: 2, border: "1px solid", borderColor: "divider",
                      p: 1.5, mb: 1.5, bgcolor: index % 2 === 0 ? "#fafbfc" : "white",
                      transition: "border-color 0.2s",
                      "&:hover": { borderColor: "primary.light" },
                    }}
                  >
                    <Grid container spacing={1.5} alignItems="center">
                      <Grid item xs={5}>
                        <CustomInput
                          placeholder="Item description"
                          {...register(`items.${index}.name`, { required: true })}
                          error={!!(errors.items?.[index]?.name)}
                          sx={{ "& .MuiOutlinedInput-root": { bgcolor: "white" } }}
                        />
                      </Grid>
                      <Grid item xs={2.5}>
                        <CustomInput
                          type="number"
                          inputProps={{ min: 1 }}
                          {...register(`items.${index}.quantity`, { valueAsNumber: true, min: 1 })}
                          sx={{ "& .MuiOutlinedInput-root": { bgcolor: "white" } }}
                        />
                      </Grid>
                      <Grid item xs={2.5}>
                        <CustomInput
                          type="number"
                          inputProps={{ min: 0, step: 0.01 }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><Typography variant="caption" sx={{ fontSize: 13 }}>₹</Typography></InputAdornment>,
                          }}
                          {...register(`items.${index}.price`, { valueAsNumber: true, min: 0 })}
                          sx={{ "& .MuiOutlinedInput-root": { bgcolor: "white" } }}
                        />
                      </Grid>
                      <Grid item xs={1.5}>
                        <Typography variant="body2" fontWeight={700} color="text.primary">
                          ₹{amount.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={0.5}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                          sx={{ "&:hover": { bgcolor: "error.50" } }}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}

              <CustomButton
                variant="outlined"
                fullWidth
                onClick={() => append({ name: "", quantity: 1, price: 0 })}
                startIcon={<AddCircleOutlineRoundedIcon />}
                sx={{
                  mt: 1, py: 1.5, borderRadius: 2, border: "1.5px dashed",
                  borderColor: "primary.light", color: "primary.main",
                  "&:hover": { bgcolor: "rgba(99,102,241,0.04)", borderColor: "primary.main" },
                }}
              >
                Add Another Item
              </CustomButton>
            </Paper>
          </Grid>

          {/* Summary Panel */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider",
                position: { md: "sticky" }, top: { md: 20 },
              }}
            >
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                Invoice Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body2" fontWeight={600}>₹{subtotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Tax (10%)</Typography>
                  <Typography variant="body2" fontWeight={600}>₹{tax.toFixed(2)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1" fontWeight={800}>Total</Typography>
                  <Typography variant="body1" fontWeight={800} color="primary.main" sx={{ fontSize: 20 }}>
                    ₹{total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Alert severity="info" sx={{ mt: 2.5, borderRadius: 2, fontSize: 12 }}>
                Invoice will be saved as <strong>Draft</strong> status initially.
              </Alert>

              <CustomButton
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                loading={loading}
                startIcon={<SaveRoundedIcon />}
                sx={{ mt: 3, py: 1.5, borderRadius: 2, fontSize: 14 }}
              >
                Save Invoice
              </CustomButton>
              <CustomButton
                variant="outlined"
                fullWidth
                sx={{ mt: 1.5, borderRadius: 2 }}
                onClick={() => navigate("/invoices")}
              >
                Cancel
              </CustomButton>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default InvoiceForm;