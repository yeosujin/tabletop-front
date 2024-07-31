import BackButton from '../../../components/button/back'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AppBar, Toolbar, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { InfoOutlined } from '@mui/icons-material'

const ConsumerHeader = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { storeId } = useParams() // URL에서 storeId를 가져옵니다.

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
            case 'details':
                return '가게 정보'
            default:
                return '-' // 기본값 설정
        }
    }

    const isMenuPath = location.pathname.endsWith('/menu')

    const handleInfoClick = () => {
        if (storeId) {
            navigate(`/consumer/${storeId}/details`) // 가게 정보 페이지로 이동
        } else {
            console.error('storeId가 없습니다.')
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
                {isMenuPath && (
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="info"
                        onClick={handleInfoClick}
                    >
                        <InfoOutlined />
                    </IconButton>
                )}
                {!isMenuPath && <div style={{ width: 48 }} />}{' '}
                {/* IconButton의 공간을 유지하기 위한 빈 div */}
            </Toolbar>
        </AppBar>
    )
}

export default ConsumerHeader
