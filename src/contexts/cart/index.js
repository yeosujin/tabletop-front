// CartContext.js
import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

const tempCartItems = [
    {
        menuId: 1,
        name: '빅맥',
        price: 5500,
        quantity: 2,
        image: 'https://example.com/bigmac.jpg',
    },
    {
        menuId: 3,
        name: '후렌치 후라이',
        price: 2000,
        quantity: 1,
        image: 'https://example.com/fries.jpg',
    },
    {
        menuId: 4,
        name: '코카콜라',
        price: 1500,
        quantity: 2,
        image: 'https://example.com/coke.jpg',
    },
    {
        menuId: 5,
        name: '맥너겟',
        price: 3000,
        quantity: 1,
        image: 'https://example.com/nuggets.jpg',
    },
    {
        menuId: 7,
        name: '아이스크림 콘',
        price: 900,
        quantity: 3,
        image: 'https://example.com/icecream.jpg',
    },
]

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])

    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.menuId === item.menuId)
            if (existingItem) {
                return prevItems.map((i) =>
                    i.menuId === item.menuId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            } else {
                return [...prevItems, { ...item, quantity: 1 }]
            }
        })
    }

    const removeFromCart = (menuId) => {
        setCartItems((prevItems) => {
            return prevItems.reduce((acc, item) => {
                if (item.menuId === menuId) {
                    if (item.quantity > 1) {
                        acc.push({ ...item, quantity: item.quantity - 1 })
                    }
                    // 수량이 1일 때는 아이템을 제거합니다 (acc에 추가하지 않음)
                } else {
                    acc.push(item)
                }
                return acc
            }, [])
        })
    }

    const clearCart = () => {
        setCartItems([])
    }

    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                calculateTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
