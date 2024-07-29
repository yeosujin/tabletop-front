// CartPage.js
import React, { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCart } from '../../../contexts/cart'
import { useTable } from '../../../contexts/table-number'

const CartPage = () => {
    const { cartItems, addToCart, removeFromCart, calculateTotal } = useCart()
    const navigate = useNavigate()
    const { storeId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const { setTableNumber } = useTable()
    const generateRandomItems = () => {
        const menuItems = [
            { menuId: 1, name: '햄버거', price: 5000 },
            { menuId: 2, name: '피자', price: 12000 },
            { menuId: 3, name: '파스타', price: 8000 },
            { menuId: 4, name: '샐러드', price: 6000 },
            { menuId: 5, name: '아이스크림', price: 3000 },
        ]

        const numberOfItems = Math.floor(Math.random() * 3) + 1

        for (let i = 0; i < numberOfItems; i++) {
            const randomMenuItem =
                menuItems[Math.floor(Math.random() * menuItems.length)]
            addToCart(randomMenuItem)
        }
    }

    useEffect(() => {
        setTableNumber(searchParams.get('tableNumber'))
        console.log(searchParams.get('tableNumber'))
    }, [])

    return (
        <div>
            <h1>장바구니</h1>
            <button onClick={generateRandomItems}>무작위 항목 추가</button>
            <ul>
                {cartItems.map((item) => (
                    <li key={item.menuId}>
                        {item.name}: {item.quantity}개, 가격:{' '}
                        {item.price * item.quantity}원
                        <button onClick={() => addToCart(item)}>+</button>
                        <button onClick={() => removeFromCart(item.menuId)}>
                            -
                        </button>
                    </li>
                ))}
            </ul>
            <p>총 금액: {calculateTotal()}원</p>
            <button onClick={() => navigate(`/consumer/${storeId}/payment`)}>
                결제하기
            </button>
        </div>
    )
}

export default CartPage
