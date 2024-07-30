import { Button } from '@mui/material'
import { KeyboardArrowLeft } from '@mui/icons-material'

const BackButton = ({ backFn }) => {
    return (
        <Button onClick={backFn}>
            <KeyboardArrowLeft />
        </Button>
    )
}

export default BackButton
