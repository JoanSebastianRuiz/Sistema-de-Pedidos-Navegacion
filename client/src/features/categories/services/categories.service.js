import { createCrudService } from '@/shared/utils/createCrudService';

const route = '/categories';
const base = createCrudService(route);

export const categoryService = {
    ...base,
};
