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
    const [isLoading, setIsLoading] = useState(false) // Global loading state
    const [error, setError] = useState(null) // Global error state

    // Navigation functions
    const navigateTo = (path) => {
        navigate(path)
        setIsMobileMenuOpen(false) // Close mobile menu on navigation
    }

    // Auth functions (simulated for now)
    const login = async (credentials) => {
        try {
            setIsLoading(true)
            setError(null)
            
            // #backend - will connect to /api/auth/login
            console.log('Login attempt:', credentials)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // Simulate successful login
            setIsAuthenticated(true)
            setUser({ 
                name: 'Usuario Demo',
                email: credentials.email 
            })
            
            // Navigate to dashboard after successful login
            navigate('/')
            
        } catch (error) {
            // #backend - will handle API errors
            setError('Error al iniciar sesión. Inténtalo de nuevo.')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (userData) => {
        try {
            setIsLoading(true)
            setError(null)
            
            // #backend - will connect to /api/auth/register
            console.log('Register attempt:', userData)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // Simulate successful registration
            setIsAuthenticated(true)
            setUser({ 
                name: 'Usuario Demo',
                email: userData.email 
            })
            
            // Navigate to dashboard after successful registration
            navigate('/')
            
        } catch (error) {
            // #backend - will handle API errors
            setError('Error al crear la cuenta. Inténtalo de nuevo.')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        // #backend - will clear tokens and call logout endpoint
        setIsAuthenticated(false)
        setUser(null)
        setError(null)
        navigate('/login')
    }

    // Clear error function
    const clearError = () => {
        setError(null)
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
        isLoading,
        setIsLoading,
        error,
        setError,
        clearError,
        
        // Auth functions
        login,
        register,
        logout
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext