import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material'
import { format } from 'date-fns'

const InfoStorePage = () => {
    const [storeDetails, setStoreDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { storeId } = useParams()

    console.log(storeDetails)

    useEffect(() => {
        const fetchStoreDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/stores/${storeId}/details`
                )
                if (!response.ok) {
                    throw new Error('Failed to fetch store details')
                }
                const data = await response.json()
                setStoreDetails(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchStoreDetails()
    }, [storeId])

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Typography color="error">{error}</Typography>
            </Box>
        )
    }

    const formatTime = (time) => {
        return time ? format(new Date(`2000-01-01T${time}`), 'HH:mm') : 'N/A'
    }

    const formatDate = (date) => {
        return date ? format(new Date(date), 'yyyy-MM-dd') : 'N/A'
    }

    const getHolidays = () => {
        if (!storeDetails.holidays || storeDetails.holidays.length === 0) {
            return '없음'
        }
        return storeDetails.holidays.join(', ')
    }

    console.log(storeDetails)

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {storeDetails.name}
                </Typography>
                <Card>
                    {storeDetails.s3Url ? (
                        <CardMedia
                            component="img"
                            height="200"
                            src={`https://tabletop-tabletop.s3.ap-northeast-2.amazonaws.com/tabletop/store_image/${storeDetails.s3Url}`}
                            alt={storeDetails.name}
                        />
                    ) : (
                        <Box
                            height="200"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            bgcolor="grey.300"
                        >
                            <Typography variant="body2" color="text.secondary">
                                이미지가 없습니다
                            </Typography>
                        </Box>
                    )}
                    <CardContent>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="가게 유형"
                                    secondary={
                                        storeDetails.storeType === 'ORDINARY'
                                            ? '상시'
                                            : '임시'
                                    }
                                />
                            </ListItem>
                            <Divider />
                            {storeDetails.storeType === 'ORDINARY' ? (
                                <ListItem>
                                    <ListItemText
                                        primary="사업자 등록 번호"
                                        secondary={
                                            storeDetails.corporateRegistrationNumber ||
                                            'N/A'
                                        }
                                    />
                                </ListItem>
                            ) : (
                                <>
                                    <ListItem>
                                        <ListItemText
                                            primary="개업일"
                                            secondary={formatDate(
                                                storeDetails.openDate
                                            )}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText
                                            primary="폐업일"
                                            secondary={formatDate(
                                                storeDetails.closeDate
                                            )}
                                        />
                                    </ListItem>
                                </>
                            )}
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary="가게 설명"
                                    secondary={
                                        storeDetails.description || 'N/A'
                                    }
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary="주소"
                                    secondary={storeDetails.address || 'N/A'}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary="영업 시간"
                                    secondary={`${formatTime(storeDetails.openTime)} - ${formatTime(storeDetails.closeTime)}`}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary="휴무일"
                                    secondary={getHolidays()}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary="판매자 이름"
                                    secondary={storeDetails.sellerName || 'N/A'}
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    )
}

export default InfoStorePage
