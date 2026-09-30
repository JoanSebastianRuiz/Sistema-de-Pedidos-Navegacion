import { useState } from 'react';
import { useCartStore } from '@/store/cart.store';
import { ShoppingCart } from '@mui/icons-material';
import { Badge, Box, IconButton } from '@mui/material';
import FormDrawer from '../table/crud/FormDrawer';
import crudRegistry from '@/crud/crudRegistry';
import { useCrudMutations } from '@/hooks/crud/useCrudMutations';

const NavbarCart = () => {
    const { orderDetails = [], clearCart } = useCartStore();
    const { form, useSchema, transformers, service } = crudRegistry['orders'];

    const validationSchema = useSchema();
    const mutations = useCrudMutations(service, 'orders');
    const [open, setOpen] = useState(false);

    const totalItems = orderDetails.length;

    const onClick = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onAfterSubmit = () => {
        setOpen(false);
        clearCart();
    };

    const actions = {
        onClose,
        onAfterSubmit,
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: 1,
            }}
        >
            <IconButton color="inherit" onClick={onClick}>
                <Badge badgeContent={totalItems} color="success">
                    <ShoppingCart />
                </Badge>
            </IconButton>

            <FormDrawer
                state={{
                    open,
                }}
                form={form}
                titles={{
                    create: 'messages.create',
                }}
                initialValues={{ orderDetails }}
                namespace="orders"
                mutations={mutations}
                actions={actions}
                validationSchema={validationSchema}
                transformers={transformers}
            />
        </Box>
    );
};

export default NavbarCart;
