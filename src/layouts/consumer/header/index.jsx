import Grid from '@mui/material/Unstable_Grid2'
import { ConsumerHeaderBox, ConsumerHeaderTitle } from './styled'
import { InfoOutlined } from '@mui/icons-material'
import { IconButton } from '@mui/material'

const ConsumerHeader = ({ store, tableNo }) => {
    return (
        <Grid container sx={{ flexDirection: 'column' }}>
            <Grid>
                <ConsumerHeaderBox>
                    <ConsumerHeaderTitle>{store.name}</ConsumerHeaderTitle>
                    <IconButton>
                        <InfoOutlined />
                    </IconButton>
                </ConsumerHeaderBox>
            </Grid>
            <Grid>{/* menu */}</Grid>
            <Grid>{/* footer */}</Grid>
        </Grid>
    )
}

export default ConsumerHeader
