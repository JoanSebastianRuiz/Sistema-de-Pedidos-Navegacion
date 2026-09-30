import { queryKeys } from '@/lib/react-query/queryKeys';
import { useQuery } from '@tanstack/react-query';

import { productService } from '../services/products.service';

export const useProductsAllQuery = () => {
    return useQuery({
        queryKey: queryKeys.productsAll,
        queryFn: productService.getAllProducts,
    });
};
