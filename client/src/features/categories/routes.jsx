import MainLayout from '@/layouts/MainLayout';
import CategoriesPage from './pages/CategoriesPage';
import AuthGuard from '../auth/guards/AuthGuard';

export const categoryRoutes = [
    {
        element: <AuthGuard roles={['admin']} />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/categories',
                        element: <CategoriesPage />,
                    },
                ],
            },
        ],
    },
];
