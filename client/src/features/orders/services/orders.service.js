import { api } from '@/lib/axios/client';

export const orderService = {
    getAll: async () => {
        const { data } = await api.get('orders');
        return data;
    },
    create: async (payload) => {
        const { data } = await api.post('distributed/orders', payload);

        return data;
    },
    updateStatus: async ({ id, ...payload }) => {
        const { data } = await api.patch(`distributed/orders/${id}/status`, payload);
        return data;
    },
};
