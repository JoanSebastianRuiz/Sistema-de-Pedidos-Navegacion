import MainLayout from '@/layouts/MainLayout';
import MenuPage from './pages/MenuPage';
import AuthGuard from '../auth/guards/AuthGuard';

export const menuRoutes = [
    {
        element: <AuthGuard roles={['client']} />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/menu',
                        element: <MenuPage />,
                    },
                ],
            },
        ],
    },
];
