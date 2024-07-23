import { Box, styled, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

export const ConsumerHeaderBox = styled(Box)`
    height: 96px;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const ConsumerHeaderTitle = styled(Typography)`
    font-weight: bold;
    letter-spacing: -0.1rem;
`

export const ConsumerMenuList = styled(Box)`
    display: flex;
    column-gap: ${(props) => props.theme.spacing(3)};
`

export const ConsumerMenuItem = styled(Grid)``

export const ConsumerMenuImage = styled(Box)`
    width: 100%;

    & > img {
        width: 100%;
        height: 96px;
        object-fit: cover;
    }
`

export const ConsumerMenuContent = styled(Box)`
    padding-left: ${(props) => props.theme.spacing(2)};
    display: flex;
    flex-direction: column;
`

export const ConsumerMenuContentTitle = styled(Typography)`
    display: -webkit-box;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
    overflow: hidden;
`

export const ConsumerMenuContentDescription = styled(ConsumerMenuContentTitle)`
    color: gray;
    -webkit-line-clamp: 2;
`
