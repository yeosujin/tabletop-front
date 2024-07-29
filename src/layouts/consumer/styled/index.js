import { Container, styled } from '@mui/material'

export const ConsumerLayoutContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    width: 100%;
    row-gap: ${(props) => props.theme.spacing(3)};
`
