import { api } from '@/lib/axios/client';
import { createCrudService } from '@/shared/utils/createCrudService';
import { createUpdateStatusService } from '@/shared/utils/createUpdateStatusService';

const route = '/products';
const base = createCrudService(route);
const updateStatus = createUpdateStatusService(route);

const getAllProducts = async () => {
    const { data } = await api.get(`${route}/all`);
    return data;
};

export const productService = {
    ...base,
    updateStatus,
    getAllProducts,
};
