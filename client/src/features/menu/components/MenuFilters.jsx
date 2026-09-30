import { useSearchParams } from 'react-router-dom';

import { useCategoriesQuery } from '@/features/categories/hooks/useCategoriesQuery';

import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import useLang from '@/hooks/i18n/useLang';
import { Search } from '@mui/icons-material';
import { Grid } from '@mui/system';

const MenuFilters = () => {
    const { t } = useLang();
    const { data: categoriesData = [] } = useCategoriesQuery();
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') ?? '';
    const categoryId = searchParams.get('categoryId') ?? '';

    const handleSearchChange = (event) => {
        const params = new URLSearchParams(searchParams);

        const value = event.target.value;

        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }

        params.set('page', '1');

        setSearchParams(params);
    };

    const handleCategoryChange = (event) => {
        const params = new URLSearchParams(searchParams);

        const value = event.target.value;

        if (value) {
            params.set('categoryId', value);
        } else {
            params.delete('categoryId');
        }

        params.set('page', '1');

        setSearchParams(params);
    };

    return (
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                <TextField
                    fullWidth
                    placeholder={`${t('searchProduct')}...`}
                    value={search}
                    onChange={handleSearchChange}
                    slotProps={{
                        input: {
                            startAdornment: <Search sx={{ mr: 1 }} />,
                        },
                    }}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                    <InputLabel id="category-filter-label">{t('category')}</InputLabel>

                    <Select
                        labelId="category-filter-label"
                        value={categoryId}
                        label={t('category')}
                        onChange={handleCategoryChange}
                    >
                        <MenuItem value="">{t('all')}</MenuItem>

                        {categoriesData.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default MenuFilters;
