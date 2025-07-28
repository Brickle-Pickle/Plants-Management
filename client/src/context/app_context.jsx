import { createContext, useContext, useState } from 'react'
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
    
    // Global state variables
    const [user, setUser] = useState(null) // #backend - will be populated from API
    const [isAuthenticated, setIsAuthenticated] = useState(false) // #backend - will be managed by auth system
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Navigation functions
    const navigateTo = (path) => {
        navigate(path)
        setIsMobileMenuOpen(false) // Close mobile menu on navigation
    }

    // Auth functions (simulated for now)
    const login = async (credentials) => {
        // #backend - will connect to /api/auth/login
        console.log('Login attempt:', credentials)
        setIsAuthenticated(true)
        setUser({ name: 'Usuario Demo' }) // Simulated user data
    }

    const logout = () => {
        // #backend - will clear tokens and call logout endpoint
        setIsAuthenticated(false)
        setUser(null)
        navigate('/login')
    }

    // Context value with navigate and location
    const contextValue = {
        // Navigation
        navigate: navigateTo,
        location,
        
        // Global state
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        
        // Auth functions
        login,
        logout
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext