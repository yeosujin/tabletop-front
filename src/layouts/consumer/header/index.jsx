import BackButton from '../../../components/button/back'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { InfoOutlined } from '@mui/icons-material'

const ConsumerHeader = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(-1) // 브라우저 히스토리에서 한 단계 뒤로 이동
    }

    const getHeaderTitle = () => {
        const path = location.pathname.split('/').pop()
        switch (path) {
            case 'menu':
                return '메뉴'
            case 'cart':
                return '장바구니'
            case 'payment':
                return '결제'
            case 'complete':
                return '대기'
            default:
                return '-' // 기본값 설정
        }
    }

    return (
        <AppBar
            position="static"
            color="transparent"
            elevation={0}
            sx={{
                backgroundColor: '#ff9f1c',
            }}
        >
            <Toolbar>
                <BackButton backFn={handleGoBack} />
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, textAlign: 'center' }}
                >
                    {getHeaderTitle()}
                </Typography>
                <IconButton edge="end" color="inherit" aria-label="info">
                    <InfoOutlined />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default ConsumerHeader
