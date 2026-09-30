import { Pagination, Typography } from '@mui/material';
import { Grid } from '@mui/system';
import { useSearchParams } from 'react-router-dom';

import MenuCards from './MenuCards';
import MenuFilters from './MenuFilters';
import { useProductsQuery } from '@/features/products/hooks/useProductsQuery';
import useLang from '@/hooks/i18n/useLang';
import Loading from '@/shared/components/Loading';

const Menu = () => {
    const { t } = useLang();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get('page') ?? 1);
    const search = searchParams.get('search') ?? '';
    const categoryId = searchParams.get('categoryId') ?? '';

    const { data, isLoading } = useProductsQuery({
        page,
        pageSize: 12,
        search,
        categoryId,
    });

    const products = data?.items ?? [];
    const totalPages = data?.totalPages ?? 1;

    const handlePageChange = (_, value) => {
        const params = new URLSearchParams(searchParams);

        params.set('page', String(value));

        setSearchParams(params);
    };

    return (
        <Grid container spacing={2} direction="column">
            <MenuFilters />

            <MenuCards products={products} />

            {isLoading && <Loading />}

            {products.length === 0 && !isLoading && (
                <Typography variant="body1" align="center">
                    {t('noProductsFound')}
                </Typography>
            )}

            {products.length > 0 && (
                <Grid container justifyContent="center">
                    <Pagination count={totalPages} page={page} onChange={handlePageChange} />
                </Grid>
            )}
        </Grid>
    );
};

export default Menu;
