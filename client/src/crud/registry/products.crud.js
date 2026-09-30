import ProductsForm from '@/features/products/components/form/ProductsForm';
import useProductsColumns from '@/features/products/hooks/useProductsColumns';
import useProductsSchema from '@/features/products/schemas/useProductsSchema';
import { productService } from '@/features/products/services/products.service';
import { useProductsAllQuery } from '@/features/products/hooks/useProductsAllQuery';

const products = {
    useQuery: useProductsAllQuery,
    useColumns: useProductsColumns,
    useSchema: useProductsSchema,

    service: productService,
    form: ProductsForm,

    initialValues: {
        name: '',
        description: '',
        price: 0,
    },

    permissions: {
        admin: ['create', 'update', 'delete'],
    },

    transformers: {
        updateValues: (values) => {
            return {
                ...values,
                categoryId: values.category?.id,
                isActive: undefined,
                category: undefined,
            };
        },
    },
};

export default products;
