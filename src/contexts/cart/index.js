// CartContext.js
import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

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
        setCartItems((prevItems) =>
            prevItems.filter((item) => item.menuId !== menuId)
        )
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
