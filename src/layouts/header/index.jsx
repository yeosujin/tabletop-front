import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../apis/auth/AuthAPI'

const SiteHeader = () => {
    const navigate = useNavigate()
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    const loginId = localStorage.getItem('id') // 로그인 아이디를 로컬스토리지에서 가져옴

    const handleProfileClick = () => {
        navigate(`/sellers/${loginId}/profile`)
    }

    const handleLogoutClick = async () => {
        try {
            const response = await logout(loginId)
            if (response === '로그아웃 되었습니다.') {
                localStorage.removeItem('id')
                localStorage.removeItem('tokenType')
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                alert(response)
                navigate('/login') // 로그아웃 후 로그인 페이지로 이동
            }
        } catch (err) {
            alert('로그아웃에 실패했습니다.')
            console.log(err)
        }
    }

    return (
        <header style={styles.header}>
            <div style={styles.logo}>자리부터잡아</div>
            {ACCESS_TOKEN && (
                <div>
                    <button style={styles.button} onClick={handleProfileClick}>
                        Profile
                    </button>
                    <button style={styles.button} onClick={handleLogoutClick}>
                        Log-out
                    </button>
                </div>
            )}
        </header>
    )
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.75rem',
        backgroundColor: '#f8f8f8',
    },
    logo: {
        fontSize: '32px',
        fontWeight: 'bold',
    },
    button: {
        marginLeft: '1rem',
        padding: '0.75rem 1.25rem',
        backgroundColor: '#ff9f1c', // 버튼 색상을 #ff9f1c
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1.2rem',
    },
}

export default SiteHeader
