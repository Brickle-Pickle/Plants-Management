import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

// Configure axios defaults for credentials and base URL
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:5000' // Backend server URL

// Create axios instance with specific configuration for better control
const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

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
    
    // Reminders State Variables
    const [reminders, setReminders] = useState([]) // #backend - will be populated from API
    const [isLoadingReminders, setIsLoadingReminders] = useState(false)
    const [remindersError, setRemindersError] = useState(null)
    const [remindersFilter, setRemindersFilter] = useState('all') // 'all', 'pending', 'completed', 'overdue'
    const [remindersSortBy, setRemindersSortBy] = useState('date') // 'date', 'type', 'plant'
    const [selectedReminder, setSelectedReminder] = useState(null)
    
    // Reminder Modal State Variables
    const [isReminderAddModalOpen, setIsReminderAddModalOpen] = useState(false)
    const [isReminderEditModalOpen, setIsReminderEditModalOpen] = useState(false)
    const [isReminderDeleteModalOpen, setIsReminderDeleteModalOpen] = useState(false)
    
    // Grid View Settings
    const [gridViewMode, setGridViewMode] = useState('grid') // 'grid' or 'list'
    const [plantsFilter, setPlantsFilter] = useState('all') // 'all', 'healthy', 'needsWater', 'needsAttention', 'sick'
    const [plantsSortBy, setPlantsSortBy] = useState('name') // 'name', 'lastWatered', 'nextWatering', 'status'

    useEffect(() => {
        checkAuthStatus()
    }, [])

    // Configure axios with token when authentication state changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && isAuthenticated) {
            // Set default authorization header for all axios requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            // Remove authorization header if no token or not authenticated
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [isAuthenticated]);

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
        // Close reminder modals
        setIsReminderAddModalOpen(false)
        setIsReminderEditModalOpen(false)
        setIsReminderDeleteModalOpen(false)
        setSelectedReminder(null)
    }

    // Reminder Modal Functions
    const openReminderAddModal = () => {
        setIsReminderAddModalOpen(true)
    }

    const openReminderEditModal = (reminder) => {
        setSelectedReminder(reminder)
        setIsReminderEditModalOpen(true)
    }

    const openReminderDeleteModal = (reminder) => {
        setSelectedReminder(reminder)
        setIsReminderDeleteModalOpen(true)
    }

    const getUserName = () => {
        let name = user?.email?.split('@')[0]
        return name?.charAt(0).toUpperCase() + name?.slice(1)
    }

    const fetchPlants = async () => {
        try {
            console.log('=== FETCH PLANTS CALLED ===');
            console.log('User:', user);
            console.log('Is Authenticated:', isAuthenticated);
            console.log('Is Loading:', isLoading);
            
            setIsLoadingPlants(true)
            setPlantsError(null)
            
            const response = await axios.get('/api/plants/user-plants');
            console.log('Plants API Response:', response.data);
            
            // Backend returns plants directly in response.data, not response.data.plants
            setPlants(response.data || [])
            console.log('Plants set to state:', response.data || []);
        } catch (error) {
            console.error('Error fetching plants:', error);
            console.error('Error response:', error.response?.data);
            setPlantsError('Error al cargar las plantas')
            // Ensure plants remains an array even on error
            setPlants([])
        } finally {
            setIsLoadingPlants(false)
        }
    }

    const addPlant = async (plantData) => {
        try {
            setIsLoading(true)
            
            const response = await axios.post('/api/plants/create', plantData);
            
            // Generate new ID (in real app, this would come from backend)
            const newId = response.data._id
            
            // Create new plant object
            const newPlant = {
                id: newId,
                ...plantData,
                lastWatered: plantData.lastWatered ? new Date(plantData.lastWatered) : null,
                nextWatering: plantData.nextWatering ? new Date(plantData.nextWatering) : null
            }
            
            // Add plant to local state - ensure prevPlants is always an array
            setPlants(prevPlants => [...(prevPlants || []), newPlant])
            closeAllModals()
            
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Error al agregar la planta'
            setError(errorMessage)
            console.error('Error adding plant:', errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const deletePlant = async (plantId) => {
        try {
            setIsLoading(true)
            
            const response = await axios.delete(`/api/plants/${plantId}`);
            console.log('Delete API Response:', response.data);
            
            // Remove plant from local state - ensure prevPlants is always an array
            setPlants(prevPlants => (prevPlants || []).filter(plant => plant._id !== plantId))
            closeAllModals()
            
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Error al eliminar la planta'
            setError(errorMessage)
            console.error('Error deleting plant:', errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const updatePlant = async (plantId, updatedData) => {
        try {
            setIsLoading(true)
            
            const response = await axios.put(`/api/plants/${plantId}`, updatedData);
            console.log('Update API Response:', response.data);
            
            // Update plant in local state - ensure prevPlants is always an array
            setPlants(prevPlants => 
                (prevPlants || []).map(plant => 
                    plant.id === plantId 
                        ? { ...plant, ...updatedData }
                        : plant
                )
            )
            closeAllModals()
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Error al actualizar la planta'
            setError(errorMessage)
            console.error('Error updating plant:', errorMessage)
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
            
            const response = await axios.post('/api/auth/login', credentials);

            localStorage.setItem('token', response.data.token);
            
            // Set axios default header immediately after login
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            setIsAuthenticated(true);
            setUser(response.data.user); // Set the full user object including _id
            
            // Navigate to dashboard after successful login
            navigate('/')
            
            // Reload the web
            window.location.reload()
        } catch (error) {
            // Handle API errors properly
            const errorMessage = error.response?.data?.msg || 'Error al iniciar sesión. Inténtalo de nuevo.'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (userData) => {
        try {
            setIsLoading(true)
            setError(null)
            
            const response = await axios.post('/api/auth/register', userData);
            localStorage.setItem('token', response.data.token);
            
            // Set axios default header immediately after registration
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            
            setIsAuthenticated(true);
            setUser(response.data.user) // Set the full user object including _id
            
            // Navigate to dashboard after successful registration
            navigate('/')
            
        } catch (error) {
            // Handle API errors properly
            const errorMessage = error.response?.data?.msg || 'Error al crear la cuenta. Inténtalo de nuevo.'
            setError(errorMessage)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        // Clear token from localStorage
        localStorage.removeItem('token')
        
        // Clear axios default header
        delete axios.defaults.headers.common['Authorization']
        
        // Reset state
        setIsAuthenticated(false)
        setUser(null)
        setError(null)
        setPlants([])
        
        // Navigate to login
        navigate('/login')
    }

    // Clear error function
    const clearError = () => {
        setError(null)
        setPlantsError(null)
        setRemindersError(null)
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

    // Reminders Functions
    const fetchReminders = async () => {
        try {
            setIsLoadingReminders(true)
            setRemindersError(null)
            
            // #backend - will connect to /api/reminders
            console.log('Fetching reminders...')
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Simulate reminders data
            const mockReminders = [
                {
                    _id: '1',
                    plantId: 1,
                    userId: 'user1',
                    careType: 'watering',
                    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
                    isRecurring: true,
                    frequency: 7, // every 7 days
                    status: 'pending',
                    notificationSent: false,
                    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                },
                {
                    _id: '2',
                    plantId: 2,
                    userId: 'user1',
                    careType: 'watering',
                    scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // yesterday (overdue)
                    isRecurring: true,
                    frequency: 5, // every 5 days
                    status: 'overdue',
                    notificationSent: true,
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                },
                {
                    _id: '3',
                    plantId: 1,
                    userId: 'user1',
                    careType: 'fertilizing',
                    scheduledDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // in 15 days
                    isRecurring: true,
                    frequency: 30, // every 30 days
                    status: 'pending',
                    notificationSent: false,
                    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
                },
                {
                    _id: '4',
                    plantId: 3,
                    userId: 'user1',
                    careType: 'pruning',
                    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // in 3 days
                    isRecurring: false,
                    frequency: 0,
                    status: 'pending',
                    notificationSent: false,
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                    _id: '5',
                    plantId: 2,
                    userId: 'user1',
                    careType: 'fertilizing',
                    scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                    isRecurring: false,
                    frequency: 0,
                    status: 'completed',
                    notificationSent: true,
                    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
                }
            ]
            
            setReminders(mockReminders)
            
        } catch (error) {
            // #backend - will handle API errors
            setRemindersError('Error al cargar los recordatorios')
            console.error('Error fetching reminders:', error)
        } finally {
            setIsLoadingReminders(false)
        }
    }

    const addReminder = async (reminderData) => {
        try {
            setIsLoading(true)
            
            // #backend - will connect to /api/reminders POST
            console.log('Adding reminder:', reminderData)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800))
            
            // Generate new ID (in real app, this would come from backend)
            const newId = Math.max(...reminders.map(r => parseInt(r._id)), 0) + 1
            
            // Create new reminder object
            const newReminder = {
                _id: newId.toString(),
                ...reminderData,
                status: 'pending',
                notificationSent: false,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            
            // Add reminder to local state
            setReminders(prevReminders => [...prevReminders, newReminder])
            closeAllModals()
            
        } catch (error) {
            // #backend - will handle API errors
            setError('Error al agregar el recordatorio')
            console.error('Error adding reminder:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const updateReminder = async (reminderId, updatedData) => {
        try {
            setIsLoading(true)
            
            // #backend - will connect to /api/reminders/:id PUT
            console.log('Updating reminder:', reminderId, updatedData)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 600))
            
            // Update reminder in local state
            setReminders(prevReminders => 
                prevReminders.map(reminder => 
                    reminder._id === reminderId 
                        ? { ...reminder, ...updatedData, updatedAt: new Date() }
                        : reminder
                )
            )
            closeAllModals()
            
        } catch (error) {
            // #backend - will handle API errors
            setError('Error al actualizar el recordatorio')
            console.error('Error updating reminder:', error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const deleteReminder = async (reminderId) => {
        try {
            setIsLoading(true)
            
            // #backend - will connect to /api/reminders/:id DELETE
            console.log('Deleting reminder:', reminderId)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Remove reminder from local state
            setReminders(prevReminders => prevReminders.filter(reminder => reminder._id !== reminderId))
            closeAllModals()
            
        } catch (error) {
            // #backend - will handle API errors
            setError('Error al eliminar el recordatorio')
            console.error('Error deleting reminder:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const completeReminder = async (reminderId) => {
        try {
            setIsLoading(true)
            
            // #backend - will connect to /api/reminders/:id/complete PUT
            console.log('Completing reminder:', reminderId)
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 600))
            
            // Update reminder status to completed
            setReminders(prevReminders => 
                prevReminders.map(reminder => 
                    reminder._id === reminderId 
                        ? { ...reminder, status: 'completed', updatedAt: new Date() }
                        : reminder
                )
            )
            
        } catch (error) {
            // #backend - will handle API errors
            setError('Error al completar el recordatorio')
            console.error('Error completing reminder:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Check if user is logged in while loading the app
    const checkAuthStatus = async () => {
        try {
            console.log('=== CHECK AUTH STATUS ===');
            setIsLoading(true);
    
            // Get token from localStorage
            const token = localStorage.getItem('token');
            console.log('Token from localStorage:', token ? 'Token exists' : 'No token');
            
            if(!token) {
                console.log('No token found - setting unauthenticated');
                setIsAuthenticated(false);
                setUser(null);
                return;
            }
    
            // Set axios default header before making the request
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
            const response = await axios.get('/api/auth/profile');
            console.log('Auth profile response:', response.data);
    
            setUser(response.data); // Set the full user object including _id
            setIsAuthenticated(true);
            console.log('User authenticated successfully:', response.data);
            
        } catch (error) {
            console.error('Auth check failed:', error);
            console.error('Auth error response:', error.response?.data);
            // Clear invalid token
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    // Image upload function for Cloudinary
    const uploadImageToCloudinary = async (file) => {
        try {
            setIsLoading(true)
            
            const formData = new FormData()
            formData.append('file', file)
            
            // Fixed URL to match server route
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            return response.data.url
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error)
            setError('Error al subir la imagen')
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
        
        // Reminders State
        reminders,
        setReminders,
        isLoadingReminders,
        setIsLoadingReminders,
        remindersError,
        setRemindersError,
        remindersFilter,
        setRemindersFilter,
        remindersSortBy,
        setRemindersSortBy,
        selectedReminder,
        setSelectedReminder,
        
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
        
        // Reminder Modal State
        isReminderAddModalOpen,
        setIsReminderAddModalOpen,
        isReminderEditModalOpen,
        setIsReminderEditModalOpen,
        isReminderDeleteModalOpen,
        setIsReminderDeleteModalOpen,
        
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
        
        // Reminder Modal Functions
        openReminderAddModal,
        openReminderEditModal,
        openReminderDeleteModal,
        
        // Care History Functions
        fetchCareHistory,
        addCareRecord,
        updateCareRecord,
        
        // Reminders Functions
        fetchReminders,
        addReminder,
        updateReminder,
        deleteReminder,
        completeReminder,
        
        // Auth functions
        login,
        register,
        logout,

        // User functions
        getUserName,
        
        // Image upload function - Added this line
        uploadImageToCloudinary,
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
