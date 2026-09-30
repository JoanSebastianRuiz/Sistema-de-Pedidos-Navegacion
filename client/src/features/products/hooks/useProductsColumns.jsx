import useFormattedColumns from '@/hooks/table/useFormattedColumns';
import { useUpdateProductStatusMutation } from './mutations/useUpdateProductStatusMutation';
import useStatusColumn from '../../../hooks/table/columns/useStatusColumn';
import useTooltipColumn from '@/hooks/table/columns/useTooltipColumn';
import useMoneyColumn from '@/hooks/table/columns/useMoneyColumn';
import useObjectColumn from '@/hooks/table/columns/useObjectColumn';

const useProductsColumns = () => {
    const priceColumn = useMoneyColumn({ field: 'price' });
    const descriptionColumn = useTooltipColumn({ field: 'description' });
    const statusColumn = useStatusColumn({ useUpdateStatus: useUpdateProductStatusMutation });
    const categoryColumn = useObjectColumn({ field: 'category' });

    const columns = [
        statusColumn,
        { field: 'name' },
        categoryColumn,
        descriptionColumn,
        priceColumn,
    ];
    return useFormattedColumns({ columns, namespace: 'products' });
};

export default useProductsColumns;
