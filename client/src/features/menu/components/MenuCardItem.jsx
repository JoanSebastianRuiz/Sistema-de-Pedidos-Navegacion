import useLang from '@/hooks/i18n/useLang';

import { Add, Remove } from '@mui/icons-material';

import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    IconButton,
    Typography,
} from '@mui/material';
import { Grid } from '@mui/system';

const MenuCardItem = ({
    id,
    name,
    description,
    category,
    orderDetail,
    onAddItem,
    onRemoveItem,
}) => {
    const { t } = useLang('orders');

    return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={id}>
            <Card
                variant="outlined"
                sx={{
                    height: 200,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <CardHeader
                    title={
                        <Typography
                            fontWeight="bold"
                            variant="h6"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {name}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="caption" color="text.secondary">
                            {category?.name || 'Uncategorized'}
                        </Typography>
                    }
                    sx={{
                        pb: 1,
                    }}
                />

                <CardContent
                    sx={{
                        pt: 0,
                        flex: 1,
                        overflow: 'hidden',
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 4,
                            overflow: 'hidden',
                        }}
                    >
                        {description}
                    </Typography>
                </CardContent>

                <CardActions
                    sx={{
                        minHeight: 56,
                        px: 2,
                        justifyContent: 'flex-end',
                    }}
                >
                    {!orderDetail && (
                        <Button size="small" variant="contained" onClick={onAddItem}>
                            {t('messages.addToCart')}
                        </Button>
                    )}

                    {orderDetail && (
                        <Grid container spacing={1} alignItems="center">
                            <IconButton size="small" onClick={onRemoveItem}>
                                <Remove fontSize="small" />
                            </IconButton>

                            <Chip label={orderDetail.quantity} variant="outlined" size="small" />

                            <IconButton size="small" onClick={onAddItem}>
                                <Add fontSize="small" />
                            </IconButton>
                        </Grid>
                    )}
                </CardActions>
            </Card>
        </Grid>
    );
};

export default MenuCardItem;
