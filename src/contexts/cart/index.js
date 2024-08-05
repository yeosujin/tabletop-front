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
                // 새 아이템을 추가할 때 이미지 URL도 함께 저장합니다
                return [...prevItems, { ...item, imageUrl: item.imageUrl }]
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

    // 이미지 URL을 업데이트하는 함수를 추가합니다
    const updateItemImage = (menuId, imageUrl) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.menuId === menuId ? { ...item, imageUrl } : item
            )
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
                updateItemImage,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
