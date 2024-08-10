import React, { useState } from 'react'
import QRCode from 'react-qr-code'
import { useReactToPrint } from 'react-to-print'
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import PrintIcon from '@mui/icons-material/Print'
import InfoIcon from '@mui/icons-material/Info'
import { useParams } from 'react-router-dom'

const theme = createTheme()

const PrintablePage = React.forwardRef(({ qrValue }, ref) => (
    <div
        ref={ref}
        style={{
            width: '100mm',
            height: '100mm',
            padding: '5mm',
            boxSizing: 'border-box',
        }}
    >
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #ccc',
            }}
        >
            <QRCode
                value={`http://localhost:3000/consumer/1/menu?tableNumber=${qrValue}`}
                size={80}
            />
            <Typography
                variant="subtitle1"
                style={{ marginTop: '5mm', textAlign: 'center' }}
            >
                테이블 번호: {qrValue}
            </Typography>
        </div>
    </div>
))

const QrPage = () => {
    const [number, setNumber] = useState('')
    const [qrValue, setQrValue] = useState('')
    const componentRef = React.useRef()
    const { storeId } = useParams()

    const handleNumberChange = (e) => {
        setNumber(e.target.value)
    }

    const generateQR = () => {
        setQrValue(number)
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
      @page {
        size: 100mm 100mm;
        margin: 0;
      }
      @media print {
        html, body {
          width: 100mm;
          height: 100mm;
        }
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
    })

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm">
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        QR 코드 생성기
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="테이블 번호"
                            variant="outlined"
                            value={number}
                            onChange={handleNumberChange}
                            placeholder="번호를 입력하세요"
                        />
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={generateQR}
                        fullWidth
                    >
                        QR 코드 생성
                    </Button>
                    <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
                        {qrValue && (
                            <Grid
                                container
                                spacing={2}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item>
                                    <QRCode
                                        value={`http://${location.host}/consumer/${storeId}/menu?tableNumber=${qrValue}`}
                                        size={80}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6">
                                        테이블 번호: {qrValue}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Paper>
                    {qrValue && (
                        <>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<PrintIcon />}
                                onClick={handlePrint}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                인쇄
                            </Button>
                            <Alert
                                severity="info"
                                icon={<InfoIcon />}
                                sx={{ mt: 2 }}
                            >
                                <AlertTitle>인쇄 안내</AlertTitle>
                                <Typography variant="body2">
                                    1. 인쇄 설정에서 "실제 크기" 또는 "크기 조정
                                    없음" 옵션을 선택하세요.
                                </Typography>
                                <Typography variant="body2">
                                    2. 용지 크기를 100mm x 100mm로 설정하거나,
                                    A6 크기를 선택하세요.
                                </Typography>
                                <Typography variant="body2">
                                    3. 또는 A4 용지로 인쇄한 후 QR 코드를
                                    오려내어 테이블에 부착하셔도 됩니다.
                                </Typography>
                            </Alert>
                        </>
                    )}
                </Box>
            </Container>
            <div style={{ display: 'none' }}>
                <PrintablePage ref={componentRef} qrValue={qrValue} />
            </div>
        </ThemeProvider>
    )
}

export default QrPage
