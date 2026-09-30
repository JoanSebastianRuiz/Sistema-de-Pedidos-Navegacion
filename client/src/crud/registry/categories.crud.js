import { useCategoriesQuery } from '@/features/categories/hooks/useCategoriesQuery';
import useCategoriesColumns from '@/features/categories/hooks/useCategoriesColumns';
import useCategoriesSchema from '@/features/categories/schemas/useCategoriesSchema';
import { categoryService } from '@/features/categories/services/categories.service';
import CategoriesForm from '@/features/categories/components/form/CategoriesForm';

const categories = {
    useQuery: useCategoriesQuery,
    useColumns: useCategoriesColumns,
    useSchema: useCategoriesSchema,

    service: categoryService,
    form: CategoriesForm,

    initialValues: {
        name: '',
    },

    permissions: {
        admin: ['create', 'update', 'delete'],
    },

    transformers: {},
};

export default categories;
