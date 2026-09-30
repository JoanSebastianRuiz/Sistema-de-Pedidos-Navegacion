import { IconButton, Paper, Stack, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { FieldArray, useFormikContext } from 'formik';
import FormikField from '@/shared/components/form/FormikField';
import { Grid } from '@mui/system';
import useLang from '@/hooks/i18n/useLang';
import { useCartStore } from '@/store/cart.store';
import { useEffect } from 'react';

const Item = ({ index, remove }) => {
    const { values, setFieldValue } = useFormikContext();

    const item = values.orderDetails[index];

    const onQuantityChange = (values) => {
        const value =
            values.value === '' ? '' : Number(values.value) > 0 ? Number(values.value) : 1;
        setFieldValue(`orderDetails.${index}.quantity`, value);
        console.log('item', item);
        const subtotal = item.price * value;
        setFieldValue(`orderDetails.${index}.subtotal`, subtotal);
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                pt: 2,
                px: 2,
                width: '100%',
            }}
        >
            <Grid
                container
                spacing={1}
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ sm: 'center' }}
            >
                <FormikField
                    name={`orderDetails.${index}.name`}
                    label="product"
                    size="small"
                    readOnly
                    containerSize={{ xs: 12 }}
                />

                <FormikField.Number
                    name={`orderDetails.${index}.quantity`}
                    label="quantity"
                    size="small"
                    containerSize={{ xs: 12, sm: 4 }}
                    numericProps={{
                        onValueChange: onQuantityChange,
                    }}
                />

                <FormikField.Number
                    name={`orderDetails.${index}.subtotal`}
                    label="subtotal"
                    prefix="$"
                    size="small"
                    containerSize={{ xs: 12, sm: 6 }}
                    disabled
                />

                <Grid
                    size={{ xs: 12, sm: 2 }}
                    sx={{ pb: { xs: 0, sm: 3 }, display: 'flex', justifyContent: 'center' }}
                >
                    <IconButton color="error" onClick={() => remove(index)}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Paper>
    );
};

const OrderDetailsForm = () => {
    const { t } = useLang('orders');
    const { setOrderDetails } = useCartStore();
    const { values, errors } = useFormikContext();

    const total = values.orderDetails.reduce((acc, item) => acc + (item.subtotal || 0), 0);

    useEffect(() => {
        setOrderDetails(values.orderDetails);
    }, [values.orderDetails]);

    return (
        <FieldArray name="orderDetails">
            {({ remove }) => (
                <Stack spacing={2} sx={{ width: '100%' }}>
                    {(!values.orderDetails || values.orderDetails.length === 0) &&
                        !errors.orderDetails && (
                            <Typography variant="body2" color="textSecondary">
                                {t('messages.emptyCart')}
                            </Typography>
                        )}

                    {errors.orderDetails && typeof errors.orderDetails === 'string' && (
                        <Typography variant="body2" color="error">
                            {errors.orderDetails}
                        </Typography>
                    )}

                    {values.orderDetails?.map((_, index) => (
                        <Item key={index} index={index} remove={remove} />
                    ))}

                    {values.orderDetails?.length > 0 && (
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={1}
                        >
                            <Typography variant="subtitle1">Total:</Typography>

                            <Typography variant="subtitle1" fontWeight="bold">
                                ${total.toLocaleString()}
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            )}
        </FieldArray>
    );
};

export default OrderDetailsForm;
