// CartContext.js
import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])

    const addToCart = (item, incrementBy = item.quantity) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.menuId === item.menuId)
            if (existingItem) {
                return prevItems.map((i) =>
                    i.menuId === item.menuId
                        ? { ...i, quantity: i.quantity + incrementBy }
                        : i
                )
            } else {
                return [...prevItems, item]
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
