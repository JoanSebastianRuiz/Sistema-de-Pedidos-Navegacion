import { queryKeys } from '@/lib/react-query/queryKeys';
import { useQuery } from '@tanstack/react-query';

import { productService } from '../services/products.service';

export const useProductsQuery = ({ page, pageSize, search, categoryId } = {}) => {
    return useQuery({
        queryKey: [...queryKeys.products, { page, pageSize, search, categoryId }],
        queryFn: () => productService.getAll({ params: { page, pageSize, search, categoryId } }),
    });
};
