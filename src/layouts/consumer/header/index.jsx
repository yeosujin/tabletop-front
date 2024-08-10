import BackButton from '../../../components/button/back'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AppBar, Toolbar, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { InfoOutlined } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { getStoreInfo } from '../../../apis/seller/StoreAPI'

const ConsumerHeader = () => {
    const [storeName, setStoreName] = useState('-')
    const location = useLocation()
    const navigate = useNavigate()
    const { storeId } = useParams()

    useEffect(() => {
        const fetchStoreName = async () => {
            if (storeId) {
                try {
                    const response = await getStoreInfo(storeId)
                    setStoreName(response.name)
                    console.log("response ok : " + response.ok)
                    console.log("response : " + response)
                    // if (response.ok !== 200) {
                    //     throw new Error('Failed to fetch store details')
                    // }
                } catch (error) {
                    console.error('Error fetching store name:', error)
                }
            }
        }

        fetchStoreName()
    }, [storeId])

    const handleGoBack = () => {
        navigate(-1) // 브라우저 히스토리에서 한 단계 뒤로 이동
    }

    const getHeaderTitle = () => {
        const path = location.pathname.split('/').pop()
        switch (path) {
            case 'menu':
                return storeName // 메뉴 페이지일 때 가게 이름 반환
            case 'cart':
                return '장바구니'
            case 'payment':
                return '결제'
            case 'complete':
                return '대기'
            case 'details':
                return '가게 정보'
            default:
                return '-'
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
                {!isMenuPath && <BackButton backFn={handleGoBack} />}
                {isMenuPath && <div style={{ width: 48 }} />}
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
                {!isMenuPath && <div style={{ width: 48 }} />}
            </Toolbar>
        </AppBar>
    )
}

export default ConsumerHeader
