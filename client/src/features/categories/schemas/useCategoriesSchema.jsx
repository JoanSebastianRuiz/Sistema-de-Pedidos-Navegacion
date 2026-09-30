import useLang from '@/hooks/i18n/useLang';
import * as yup from 'yup';

const useCategoriesSchema = () => {
    const { t } = useLang();

    return yup.object({
        name: yup
            .string()
            .required(t('validations.required'))
            .max(120, t('validations.maxLength', { max: 120 })),
    });
};

export default useCategoriesSchema;
