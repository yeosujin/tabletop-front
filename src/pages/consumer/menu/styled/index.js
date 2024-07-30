import { Box, SpeedDial, styled, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

export const ConsumerMenuList = styled(Box)`
    display: flex;
    row-gap: ${(props) => props.theme.spacing(1.5)};
    min-height: 100vh;
`

export const ConsumerMenuWrapper = styled(Box)`
    width: 100%;
    border-radius: ${(props) => props.theme.spacing(3)};
`

export const ConsumerMenuItem = styled(Grid)`
    background-color: lightgray;
    border-radius: ${(props) => props.theme.spacing(3)};
`

export const ConsumerMenuImage = styled(Box)`
    width: 100%;
    height: 96px;
    border-radius: ${(props) => props.theme.spacing(3)};
    overflow: hidden;

    & > img {
        width: 100%;
        height: 100%;
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

export const ConsumerMenuDialBox = styled(Box)`
    height: 320px;
    transform: translateZ(0px);
    flex-grow: 1;
`

export const ConsumerMenuCartIcon = styled(SpeedDial)`
    position: absolute;
    bottom: 16px;
    right: 16px;
`
