import useFormattedColumns from '@/hooks/table/useFormattedColumns';

const useCategoriesColumns = () => {
    const columns = [{ field: 'name' }];
    return useFormattedColumns({ columns, namespace: 'categories' });
};

export default useCategoriesColumns;
