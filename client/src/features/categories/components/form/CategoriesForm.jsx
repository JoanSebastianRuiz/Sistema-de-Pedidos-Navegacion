import FormikField from '@/shared/components/form/FormikField';
import FormikForm from '@/shared/components/form/FormikForm';

const CategoriesForm = (props) => {
    return (
        <FormikForm.Crud {...props}>
            <FormikField name="name" />
        </FormikForm.Crud>
    );
};

export default CategoriesForm;
