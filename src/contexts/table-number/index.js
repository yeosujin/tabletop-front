import React, { createContext, useContext, useState } from 'react'

// Context 생성
const TableContext = createContext()

// Provider 컴포넌트 생성
export const TableProvider = ({ children }) => {
    const [tableNumber, setTableNumber] = useState(null)

    return (
        <TableContext.Provider value={{ tableNumber, setTableNumber }}>
            {children}
        </TableContext.Provider>
    )
}

// Custom Hook 생성
export const useTable = () => {
    const context = useContext(TableContext)
    if (context === undefined) {
        throw new Error('useTable must be used within a TableProvider')
    }
    return context
}
