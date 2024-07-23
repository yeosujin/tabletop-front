import {
    ConsumerHeaderBox,
    ConsumerHeaderCaption,
    ConsumerHeaderSubBox,
    ConsumerHeaderTableNo,
    ConsumerHeaderTitle,
} from './styled'
import { InfoOutlined } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import BackButton from '../../../components/button/back'

const ConsumerHeader = ({ store, tableNo }) => {
    const navigation = useNavigate()

    const onClickGotoInfoStore = () => {
        navigation('info-store')
    }

    const SiteType = useCallback(() => {
        const type = window.location.pathname.split('/').pop()

        switch (type) {
            case 'menu':
                return (
                    <>
                        <ConsumerHeaderSubBox>
                            <IconButton onClick={onClickGotoInfoStore}>
                                <InfoOutlined />
                            </IconButton>
                            <ConsumerHeaderTableNo variant="subtitle1">
                                Table No.{tableNo}
                            </ConsumerHeaderTableNo>
                        </ConsumerHeaderSubBox>
                        <ConsumerHeaderTitle variant="h4">
                            {store.name}
                        </ConsumerHeaderTitle>
                        <ConsumerHeaderCaption variant="caption">
                            What do you want to order today?
                        </ConsumerHeaderCaption>
                    </>
                )
            case 'info-store':
                return (
                    <>
                        <ConsumerHeaderSubBox>
                            <IconButton onClick={onClickGotoInfoStore}>
                                <BackButton backFn={() => navigation(-1)} />
                            </IconButton>
                        </ConsumerHeaderSubBox>
                        <ConsumerHeaderTitle variant="h4">
                            Store Information
                        </ConsumerHeaderTitle>
                        <ConsumerHeaderCaption variant="caption">
                            What do you want to know?
                        </ConsumerHeaderCaption>
                    </>
                )
        }
    }, [window.location.pathname])

    return (
        <ConsumerHeaderBox>
            <SiteType />
        </ConsumerHeaderBox>
    )
}

export default ConsumerHeader
