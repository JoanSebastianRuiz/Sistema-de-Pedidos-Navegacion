import { queryKeys } from '@/lib/react-query/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categories.service';

export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: queryKeys.categories,
        queryFn: categoryService.getAll,
    });
};
