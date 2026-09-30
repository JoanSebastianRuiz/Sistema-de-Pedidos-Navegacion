import { authRoutes } from '@/features/auth/routes';
import { categoryRoutes } from '@/features/categories/routes';
import { menuRoutes } from '@/features/menu/routes';
import { orderRoutes } from '@/features/orders/routes';
import { productRoutes } from '@/features/products/routes';

const routes = [...authRoutes, ...orderRoutes, ...productRoutes, ...categoryRoutes, ...menuRoutes];

export default routes;
