import useLang from '@/hooks/i18n/useLang';
import * as yup from 'yup';

const useOrdersSchema = () => {
    const { t } = useLang();
    return yup
        .object({
            orderDetails: yup.array().of(
                yup.object({
                    productId: yup.number().required(t('required')),
                    quantity: yup
                        .number()
                        .typeError(t('validations.number'))
                        .required(t('validations.required'))
                        .min(1, t('validations.invalid')),
                })
            ),
        })
        .test(function (values) {
            const { orderDetails } = values;

            if (!orderDetails || orderDetails.length === 0) {
                return this.createError({
                    path: 'orderDetails',
                    message: t('validations.emptyProducts'),
                });
            }

            const productIds = orderDetails.map((item) => item.productId);

            if (productIds.some((id) => id === undefined || id === null || id === '')) {
                return this.createError({
                    path: 'orderDetails',
                    message: t('validations.someInvalidProductId'),
                });
            }

            const hasDuplicates = new Set(productIds).size !== productIds.length;

            if (hasDuplicates) {
                return this.createError({
                    path: 'orderDetails',
                    message: t('validations.duplicateProducts'),
                });
            }
            return true;
        });
};

export default useOrdersSchema;
