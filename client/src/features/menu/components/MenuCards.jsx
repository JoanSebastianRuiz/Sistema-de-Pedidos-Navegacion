import { useCartStore } from '@/store/cart.store';

import { Grid } from '@mui/system';

import { keyBy } from 'lodash';

import MenuCardItem from './MenuCardItem';
import RemoveProductCommand from '../commands/RemoveProductCommand';
import AddProductCommand from '../commands/AddProductCommand';

const MenuCards = ({ products }) => {
    const { orderDetails = [], setItem } = useCartStore();

    const orderDetailsByProductId = keyBy(orderDetails, 'productId');

    const handleAddItem = (product) => () => {
        const currentQuantity = orderDetailsByProductId[product.id]?.quantity || 0;

        const command = new AddProductCommand(setItem, product, currentQuantity);

        command.execute();
    };

    const handleRemoveItem = (product) => () => {
        const currentQuantity = orderDetailsByProductId[product.id]?.quantity || 0;

        const command = new RemoveProductCommand(setItem, product, currentQuantity);

        command.execute();
    };

    return (
        <Grid container spacing={2}>
            {products?.map((product) => (
                <MenuCardItem
                    key={product.id}
                    {...product}
                    onAddItem={handleAddItem(product)}
                    onRemoveItem={handleRemoveItem(product)}
                    orderDetail={orderDetailsByProductId[product.id]}
                />
            ))}
        </Grid>
    );
};

export default MenuCards;
