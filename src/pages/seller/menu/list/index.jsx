import React from 'react'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    IconButton,
    Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { styled } from '@mui/material/styles'

const MenuList = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
}))

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[4],
    },
}))

const CardMediaStyled = styled(CardMedia)({
    paddingTop: '56.25%', // 16:9 aspect ratio
})

const CardContentStyled = styled(CardContent)({
    flexGrow: 1,
})

const PriceTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: 'bold',
}))

const CardActionsStyled = styled(CardActions)({
    justifyContent: 'space-between',
    padding: '16px',
})

const EditButton = styled(Button)(({ theme }) => ({
    flexGrow: 1,
    marginRight: theme.spacing(1),
}))

const DeleteIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.error.main,
}))

const MenuListComponent = ({ menuItems, onEdit, onDelete, isDeleting }) => {
    return (
        <MenuList>
            {menuItems.map((item) => (
                <StyledCard key={item.id}>
                    <CardMediaStyled
                        image={
                            item.s3MenuUrl ||
                            'https://via.placeholder.com/300x200?text=No+Image'
                        }
                        title={item.name}
                    />
                    <CardContentStyled>
                        <Typography variant="h6" component="h3" gutterBottom>
                            {item.name}
                        </Typography>
                        <PriceTypography variant="subtitle1" gutterBottom>
                            {item.price.toLocaleString()}원
                        </PriceTypography>
                        <Typography variant="body2" color="text.secondary">
                            {item.description}
                        </Typography>
                    </CardContentStyled>
                    <CardActionsStyled>
                        <EditButton
                            variant="contained"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => onEdit(item)}
                        >
                            수정
                        </EditButton>
                        <DeleteIconButton
                            onClick={() => onDelete(item.id)}
                            disabled={isDeleting}
                            size="small"
                        >
                            <DeleteIcon />
                        </DeleteIconButton>
                    </CardActionsStyled>
                </StyledCard>
            ))}
        </MenuList>
    )
}

export default MenuListComponent
