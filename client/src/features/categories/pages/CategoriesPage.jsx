import Page from '@/shared/layout/Page';
import CategoriesTable from '../components/table/CategoriesTable';

const CategoriesPage = () => {
    const breadcrumbs = [
        {
            id: 'categories',
            label: 'menu.categories',
        },
    ];

    const components = [
        {
            id: 'categoriesTable',
            component: CategoriesTable,
        },
    ];

    return (
        <Page>
            <Page.Header title="menu.categories" breadcrumbs={breadcrumbs} />
            <Page.Content components={components} />
        </Page>
    );
};

export default CategoriesPage;
