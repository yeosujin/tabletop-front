import { Box, styled, Typography } from '@mui/material'

export const ConsumerHeaderBox = styled(Box)`
    height: 96px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
`

export const ConsumerHeaderSubBox = styled(Box)`
    display: flex;
    align-items: center;
`

export const ConsumerHeaderTitle = styled(Typography)`
    font-weight: bold;
    letter-spacing: -0.1rem;
    flex-grow: 3;
`

export const ConsumerHeaderTableNo = styled(Typography)`
    display: inline-block;
`

export const ConsumerHeaderCaption = styled(Typography)`
    color: black;
`
