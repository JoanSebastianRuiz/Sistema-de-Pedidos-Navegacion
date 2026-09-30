import { Category, Fastfood, MenuBook, Receipt } from '@mui/icons-material';
import { useMemo } from 'react';
import { useAuthStore } from '@/store/auth.store';

const useSidebarItems = () => {
    const { user } = useAuthStore();
    const role = user?.role;

    const items = useMemo(
        () => [
            {
                id: 'menu',
                label: 'menu',
                icon: <MenuBook />,
                path: '/menu',
                roles: ['client'],
            },
            {
                id: 'orders',
                label: 'orders',
                icon: <Receipt />,
                path: '/orders',
            },
            {
                id: 'categories',
                label: 'categories',
                icon: <Category />,
                path: '/categories',
                roles: ['admin'],
            },
            {
                id: 'products',
                label: 'products',
                icon: <Fastfood />,
                path: '/products',
                roles: ['admin'],
            },
        ],
        []
    );

    const filterItems = (items) => {
        return items
            .filter((item) => !item.roles || item.roles.includes(role))
            .map((item) => ({
                ...item,
                children: item.children ? filterItems(item.children) : undefined,
            }));
    };

    return useMemo(() => filterItems(items), [items, role]);
};

export default useSidebarItems;
