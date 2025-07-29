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

    // Plants Grid State Variables
    const [plants, setPlants] = useState([]) // #backend - will be populated from API
    const [isLoadingPlants, setIsLoadingPlants] = useState(false)
    const [plantsError, setPlantsError] = useState(null)
    
    // Modal State Variables for Plants Grid
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedPlant, setSelectedPlant] = useState(null)
    
    // Care History State Variables
    const [careRecords, setCareRecords] = useState([]) // #backend - will be populated from API
    const [isLoadingCareHistory, setIsLoadingCareHistory] = useState(false)
    const [careHistoryError, setCareHistoryError] = useState(null)
    const [careHistoryFilter, setCareHistoryFilter] = useState('all') // 'all', 'completed', 'pending'
    const [careHistorySortBy, setCareHistorySortBy] = useState('date') // 'date', 'type'
    
    // Grid View Settings
    const [gridViewMode, setGridViewMode] = useState('grid') // 'grid' or 'list'
    const [plantsFilter, setPlantsFilter] = useState('all') // 'all', 'healthy', 'needsWater', 'needsAttention', 'sick'
    const [plantsSortBy, setPlantsSortBy] = useState('name') // 'name', 'lastWatered', 'nextWatering', 'status'

    // Navigation functions
    const navigateTo = (path) => {
        navigate(path)
        setIsMobileMenuOpen(false) // Close mobile menu on navigation
    }

    // Plants Grid Functions
    const openViewModal = (plant) => {
        setSelectedPlant(plant)
        setIsViewModalOpen(true)
    }

    const openEditModal = (plant) => {
        setSelectedPlant(plant)
        setIsEditModalOpen(true)
    }

    const openDeleteModal = (plant) => {
        setSelectedPlant(plant)
        setIsDeleteModalOpen(true)
    }

    const openAddModal = () => {
        setIsAddModalOpen(true)
    }

    const closeAllModals = () => {
        setIsViewModalOpen(false)
        setIsEditModalOpen(false)
        setIsDeleteModalOpen(false)
        setIsAddModalOpen(false)
        setSelectedPlant(null)
    }

    // Plants CRUD Functions (simulated for now)
    const fetchPlants = async () => {
        try {
            setIsLoadingPlants(true)
            setPlantsError(null)
            
            // #backend - will connect to /api/plants
            console.log('Fetching plants...')
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Simulate plants data
            const mockPlants = [
                {
                    id: 1,
                    name: "Monstera Deliciosa",
                    species: "Monstera deliciosa",
                    image: "/monstera.png",
                    location: "Sala de estar",
                    status: "healthy",
                    lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                    nextWatering: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
                    notes: "Planta muy saludable, creciendo bien"
                },
                {
                    id: 2,
                    name: "Pothos Dorado",
                    species: "Epipremnum aureum",
                    image: "/pothos.png",
                    location: "Cocina",
                    status: "needsWater",
                    lastWatered: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                    nextWatering: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day overdue
                    notes: "Necesita riego urgente"
                },
                {
                    id: 3,
                    name: "Sansevieria",
                    species: "Sansevieria trifasciata",
                    image: "/sansevieria.png",
                    location: "Dormitorio",
                    status: "healthy",
                    lastWatered: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
                    nextWatering: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
                    notes: "Planta resistente, muy fácil de cuidar"
                }
            ]
            
            setPlants(mockPlants)
            
        } catch (error) {
            // #backend - will handle API errors
            setPlantsError('Error al cargar las plantas')
            console.error('Error fetching plants:', error)
        } finally {
            setIsLoadingPlants(false)
        }
    }

    const addPlant = async (plantData) => {
        try {
            setIsLoading(true)
            
            // #backend - will connect to /api/plants POST
            console.log('Adding plant:', plantData)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Generate new ID (in real app, this would come from backend)
            const newId = Math.max(...plants.map(p => p.id), 0) + 1
            
            // Create new plant object
            const newPlant = {
                id: newId,
                ...plantData,
                lastWatered: plantData.lastWatered ? new Date(plantData.lastWatered) : null,
                nextWatering: plantData.nextWatering ? new Date(plantData.nextWatering) : null
            }
            
            // Add plant to local state
            setPlants(prevPlants => [...prevPlants, newPlant])
            closeAllModals()
            
        } catch (error) {
            // #backend - will handle API errors
            setError('Error al agregar la planta')
            console.error('Error adding plant:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const deletePlant = async (plantId) => {
        try {
            setIsLoading(true)
            
            // #backend - will connect to /api/plants/:id DELETE
            console.log('Deleting plant:', plantId)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Remove plant from local state
            setPlants(prevPlants => prevPlants.filter(plant => plant.id !== plantId))
            closeAllModals()
            
        } catch (error) {
            // #backend - will handle API errors
            setError('Error al eliminar la planta')
            console.error('Error deleting plant:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const updatePlant = async (plantId, updatedData) => {
        try {
            setIsLoading(true)
            
            // #backend - will connect to /api/plants/:id PUT
            console.log('Updating plant:', plantId, updatedData)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800))
            
            // Update plant in local state
            setPlants(prevPlants => 
                prevPlants.map(plant => 
                    plant.id === plantId 
                        ? { ...plant, ...updatedData }
                        : plant
                )
            )
            closeAllModals()
            
        } catch (error) {
            // #backend - will handle API errors
            setError('Error al actualizar la planta')
            console.error('Error updating plant:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
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
        setPlantsError(null)
    }

    // Care History Functions
    const fetchCareHistory = async (plantId) => {
        try {
            setIsLoadingCareHistory(true)
            setCareHistoryError(null)
            
            // #backend - will connect to /api/plants/:id/care-history
            console.log('Fetching care history for plant:', plantId)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Simulate care records data
            const mockCareRecords = [
                {
                    _id: '1',
                    plantId: plantId,
                    userId: 'user1',
                    careType: 'watering',
                    description: 'Riego regular de la planta',
                    nextDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    completed: true,
                    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    notes: 'La planta se veía un poco seca',
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
                },
                {
                    _id: '2',
                    plantId: plantId,
                    userId: 'user1',
                    careType: 'fertilizing',
                    description: 'Fertilización mensual',
                    nextDueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                    completed: true,
                    completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                    notes: 'Aplicado fertilizante líquido',
                    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
                },
                {
                    _id: '3',
                    plantId: plantId,
                    userId: 'user1',
                    careType: 'pruning',
                    description: 'Poda de hojas secas',
                    nextDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                    completed: false,
                    completedAt: null,
                    notes: 'Revisar hojas amarillas en la parte inferior',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                }
            ]
            
            setCareRecords(mockCareRecords)
            
        } catch (error) {
            // #backend - will handle API errors
            setCareHistoryError('Error al cargar el historial de cuidados')
            console.error('Error fetching care history:', error)
        } finally {
            setIsLoadingCareHistory(false)
        }
    }

    const addCareRecord = async (careData) => {
        try {
            setIsLoading(true)
            
            // #backend - will connect to /api/care-records POST
            console.log('Adding care record:', careData)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800))
            
            // Generate new ID (in real app, this would come from backend)
            const newId = Math.max(...careRecords.map(c => parseInt(c._id)), 0) + 1
            
            // Create new care record object
            const newCareRecord = {
                _id: newId.toString(),
                ...careData,
                createdAt: new Date()
            }
            
            // Add care record to local state
            setCareRecords(prevRecords => [...prevRecords, newCareRecord])
            
        } catch (error) {
            // #backend - will handle API errors
            setError('Error al agregar el registro de cuidado')
            console.error('Error adding care record:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const updateCareRecord = async (recordId, updatedData) => {
        try {
            setIsLoading(true)
            
            // #backend - will connect to /api/care-records/:id PUT
            console.log('Updating care record:', recordId, updatedData)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 600))
            
            // Update care record in local state
            setCareRecords(prevRecords => 
                prevRecords.map(record => 
                    record._id === recordId 
                        ? { ...record, ...updatedData }
                        : record
                )
            )
            
        } catch (error) {
            // #backend - will handle API errors
            setError('Error al actualizar el registro de cuidado')
            console.error('Error updating care record:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
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
        
        // Plants Grid State
        plants,
        setPlants,
        isLoadingPlants,
        setIsLoadingPlants,
        plantsError,
        setPlantsError,
        
        // Care History State
        careRecords,
        setCareRecords,
        isLoadingCareHistory,
        setIsLoadingCareHistory,
        careHistoryError,
        setCareHistoryError,
        careHistoryFilter,
        setCareHistoryFilter,
        careHistorySortBy,
        setCareHistorySortBy,
        
        // Modal State
        isViewModalOpen,
        setIsViewModalOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        isAddModalOpen,
        setIsAddModalOpen,
        selectedPlant,
        setSelectedPlant,
        
        // Grid Settings
        gridViewMode,
        setGridViewMode,
        plantsFilter,
        setPlantsFilter,
        plantsSortBy,
        setPlantsSortBy,
        
        // Plants Functions
        fetchPlants,
        addPlant,
        deletePlant,
        updatePlant,
        openViewModal,
        openEditModal,
        openDeleteModal,
        openAddModal,
        closeAllModals,
        
        // Care History Functions
        fetchCareHistory,
        addCareRecord,
        updateCareRecord,
        
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