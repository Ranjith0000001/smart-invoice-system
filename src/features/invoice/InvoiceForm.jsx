import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createInvoiceRequest } from "./invoiceSlice";
import { TextField, Button, Grid, Paper } from "@mui/material";
import { useMemo } from "react";

const InvoiceForm = () => {
  const dispatch = useDispatch();

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      customerName: "",
      items: [
        { name: "", quantity: 1, price: 0 }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const items = watch("items");

  // 🧮 Calculate totals
  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity * item.price || 0);
    }, 0);

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }, [items]);

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      subtotal,
      tax,
      total,
      status: "Draft"
    };

    dispatch(createInvoiceRequest(finalData));
  };

  return (
    <Paper sx={{ padding: 3, marginBottom: 4 }}>
      <h2>Create Invoice</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Customer */}
        <TextField
          label="Customer Name"
          fullWidth
          margin="normal"
          {...register("customerName", { required: true })}
        />

        {/* Items */}
        {fields.map((item, index) => (
          <Grid container spacing={2} key={item.id} sx={{ marginBottom: 1 }}>
            <Grid item xs={4}>
              <TextField
                label="Item Name"
                fullWidth
                {...register(`items.${index}.name`)}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Qty"
                type="number"
                fullWidth
                {...register(`items.${index}.quantity`, {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                {...register(`items.${index}.price`, {
                  valueAsNumber: true
                })}
              />
            </Grid>

            <Grid item xs={2}>
              <Button
                color="error"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        ))}

        {/* Add Item */}
        <Button
          variant="outlined"
          onClick={() => append({ name: "", quantity: 1, price: 0 })}
          sx={{ marginBottom: 2 }}
        >
          Add Item
        </Button>

        {/* Totals */}
        <div>
          <p>Subtotal: {subtotal.toFixed(2)}</p>
          <p>Tax (10%): {tax.toFixed(2)}</p>
          <h3>Total: {total.toFixed(2)}</h3>
        </div>

        <Button type="submit" variant="contained">
          Save Invoice
        </Button>
      </form>
    </Paper>
  );
};

export default InvoiceForm;