import {
    ConsumerHeaderTitle,
    ConsumerProperty,
    ConsumerTableNo,
    ConsumerValue,
} from './styled'

const ConsumerHeader = ({ store, tableNo }) => {
    console.log(store)
    console.log(tableNo)
    return (
        <div>
            <ConsumerHeaderTitle>{store.name}</ConsumerHeaderTitle>
            <ConsumerTableNo>{tableNo}</ConsumerTableNo>

            <ConsumerProperty>사업자등록번호</ConsumerProperty>
            <ConsumerValue>{store.corporate_registration_number}</ConsumerValue>
        </div>
    )
}

export default ConsumerHeader
