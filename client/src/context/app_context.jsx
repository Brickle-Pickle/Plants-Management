import { createContext, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// Create the context
const AppContext = createContext()

// Custom hook to use the context
export const useAppContext = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider')
    }
    return context
}

// Provider component
export const AppProvider = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()

    // Context value with navigate and location
    const contextValue = {
        navigate,
        location,
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext