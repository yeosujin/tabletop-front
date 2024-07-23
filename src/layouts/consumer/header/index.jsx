import { styled } from '@mui/material'

const ConsumerHeader = ({ store, tableNo }) => {
    return (
        <HeaderContainer>
            <ConsumerHeaderTitle>{store.name}</ConsumerHeaderTitle>
            <ConsumerTableNo>테이블 번호: {tableNo}</ConsumerTableNo>
            <InfoContainer>
                <ConsumerProperty>사업자등록번호:</ConsumerProperty>
                <ConsumerValue>
                    {store.corporate_registration_number}
                </ConsumerValue>
            </InfoContainer>
            <InfoContainer>
                <ConsumerProperty>주소:</ConsumerProperty>
                <ConsumerValue>{store.address}</ConsumerValue>
            </InfoContainer>
            <InfoContainer>
                <ConsumerProperty>영업 시간:</ConsumerProperty>
                <ConsumerValue>
                    {store.open_time} - {store.close_time}
                </ConsumerValue>
            </InfoContainer>
        </HeaderContainer>
    )
}

const HeaderContainer = styled('div')`
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
`

const ConsumerHeaderTitle = styled('h1')`
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
`

const ConsumerTableNo = styled('p')`
    font-size: 18px;
    color: #666;
    margin-bottom: 15px;
`

const InfoContainer = styled('div')`
    display: flex;
    margin-bottom: 5px;
`

const ConsumerProperty = styled('span')`
    font-weight: bold;
    margin-right: 10px;
    color: #555;
`

const ConsumerValue = styled('span')`
    color: #333;
`
export default ConsumerHeader
