import FormikField from '@/shared/components/form/FormikField';
import FormikForm from '@/shared/components/form/FormikForm';
import FormikAutocomplete from '@/shared/components/form/FormikAutocomplete';
import { useCategoriesQuery } from '@/features/categories/hooks/useCategoriesQuery';

const ProductsForm = (props) => {
    const { data: categoriesData = [] } = useCategoriesQuery();
    return (
        <FormikForm.Crud {...props}>
            <FormikField name="name" />

            <FormikAutocomplete name="categoryId" label="category" options={categoriesData} />

            <FormikField.Number name="price" numericProps={{ prefix: '$' }} />

            <FormikField name="description" rows={3} />
        </FormikForm.Crud>
    );
};

export default ProductsForm;
