import Page from '@/shared/layout/Page';
import Menu from '../components/Menu';

const MenuPage = () => {
    const breadcrumbs = [
        {
            id: 'menu',
            label: 'menu.menu',
        },
    ];

    const components = [
        {
            id: 'menu',
            component: Menu,
        },
    ];

    return (
        <Page>
            <Page.Header title="menu.menu" breadcrumbs={breadcrumbs} />
            <Page.Content components={components} />
        </Page>
    );
};

export default MenuPage;
