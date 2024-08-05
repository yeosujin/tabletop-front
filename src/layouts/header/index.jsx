import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../apis/auth/AuthAPI'

const SiteHeader = () => {
    const navigate = useNavigate()
    const ACCESS_TOKEN = localStorage.getItem('accessToken')
    const loginId = localStorage.getItem('id')

    const handleProfileClick = () => {
        navigate(`/sellers/${loginId}/profile`)
    }

    const handleLogoutClick = async () => {
        try {
            const response = await logout(loginId)
            if (response === '정상적으로 로그아웃 되었습니다.') {
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
            <div style={styles.logo}>
                <Link style={styles.logoText} to={`/sellers/${loginId}/stores`}>
                    TableTop
                </Link>
            </div>
            {ACCESS_TOKEN && (
                <div>
                    <button style={styles.button} onClick={handleProfileClick}>
                        Profile
                    </button>
                    <button style={styles.button} onClick={handleLogoutClick}>
                        Logout
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
        
    },
    logoText: {
        fontFamily: 'Tenada',
        fontSize: '32px',
        color: 'black',
        textDecoration: 'none'
    },
    button: {
        marginLeft: '1rem',
        padding: '0.65rem 1.25rem',
        backgroundColor: '#ff9f1c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1.1rem',
    },
}

export default SiteHeader
