import React, { useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import AppContext from '../../context/app_context.jsx'
import SetAddCareModalOpen from './modals/setAddCareModalOpen.jsx'
import content from './care_history.json'
import './care_history.css'
// React Icons imports
import { 
    IoArrowBackOutline,
    IoLeafOutline,
    IoLocationOutline,
    IoWaterOutline,
    IoNutritionOutline,
    IoCutOutline,
    IoFlowerOutline,
    IoTimeOutline,
    IoCheckmarkCircleOutline,
    IoEllipseOutline,
    IoCalendarOutline,
    IoDocumentTextOutline,
    IoFilterOutline,
    IoSwapVerticalOutline,
    IoAddOutline,
    IoSadOutline
} from 'react-icons/io5'

const CareHistory = () => {
    const { id: plantId } = useParams()
    const {
        // Navigation
        navigate,
        // Plants state
        plants,
        isLoadingPlants,
        plantsError,
        // Care records state
        careRecords,
        isLoadingCareHistory,
        careHistoryError,
        careHistoryFilter,
        setCareHistoryFilter,
        careHistorySortBy,
        setCareHistorySortBy,
        // Functions
        fetchPlants,
        fetchCareHistory,
        updateCareRecord,
        openAddCareModal,
        clearError
    } = useContext(AppContext) || {}

    // Find the current plant - Fix ID comparison to handle both _id and id
    const currentPlant = plants.find(plant => 
        plant._id?.toString() === plantId || plant.id?.toString() === plantId
    )

    // Load plants and care history when component mounts
    useEffect(() => {
        const loadData = async () => {
            // First ensure plants are loaded
            if (plants.length === 0 && !isLoadingPlants) {
                await fetchPlants()
            }
            
            // Then load care history for the specific plant
            if (plantId) {
                fetchCareHistory(plantId)
            }
        }
        
        loadData()
        
        // Clear any previous errors
        clearError()
        
        // Cleanup function
        return () => {
            clearError()
        }
    }, [plantId, plants.length])

    // Filter care records by plantId - Add null check for record.plantId
    const filteredCareRecords = useMemo(() => {
        return careRecords.filter(record => record.plantId?.toString() === plantId)
    }, [careRecords, plantId])

    // Filter and sort care records
    const filteredAndSortedRecords = useMemo(() => {
        let filtered = filteredCareRecords

        // Apply filter
        if (careHistoryFilter === 'completed') {
            filtered = filtered.filter(record => record.completed)
        } else if (careHistoryFilter === 'pending') {
            filtered = filtered.filter(record => !record.completed)
        }

        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            if (careHistorySortBy === 'date') {
                const dateA = new Date(a.completedAt || a.createdAt)
                const dateB = new Date(b.completedAt || b.createdAt)
                return dateB - dateA // Most recent first
            } else if (careHistorySortBy === 'type') {
                return a.careType.localeCompare(b.careType)
            }
            return 0
        })

        return sorted
    }, [filteredCareRecords, careHistoryFilter, careHistorySortBy])

    // Get care type icon and color
    const getCareTypeInfo = (careType) => {
        const typeMap = {
            watering: {
                icon: <IoWaterOutline />,
                className: 'care-type-watering'
            },
            fertilizing: {
                icon: <IoNutritionOutline />,
                className: 'care-type-fertilizing'
            },
            pruning: {
                icon: <IoCutOutline />,
                className: 'care-type-pruning'
            },
            repotting: {
                icon: <IoFlowerOutline />,
                className: 'care-type-repotting'
            }
        }
        
        return typeMap[careType] || {
            icon: <IoLeafOutline />,
            className: 'care-type-default'
        }
    }

    // Format date helper
    const formatDate = (date) => {
        if (!date) return content.placeholders.noDate
        
        const plantDate = new Date(date)
        const now = new Date()
        const diffTime = Math.abs(now - plantDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
        
        const formattedDate = plantDate.toLocaleDateString('es-ES', options)
        
        if (diffDays === 0) return `Hoy, ${formattedDate}`
        if (diffDays === 1) return plantDate > now ? `Mañana, ${formattedDate}` : `Ayer, ${formattedDate}`
        
        return formattedDate
    }

    // Handle mark as completed
    const handleMarkCompleted = async (recordId) => {
        try {
            await updateCareRecord(recordId, {
                completed: true,
                completedAt: new Date()
            })
        } catch (error) {
            console.error('Error marking care record as completed:', error)
        }
    }

    // Handle back navigation
    const handleBack = () => {
        navigate('/plants')
    }

    // Loading state - show loading if either plants or care history are loading
    if (isLoadingPlants || isLoadingCareHistory) {
        return (
            <div className="care-history">
                <div className="care-history-container">
                    <div className="loading-state">
                        <IoLeafOutline className="loading-icon" />
                        <p>{content.loading}</p>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (careHistoryError) {
        return (
            <div className="care-history">
                <div className="care-history-container">
                    <div className="error-state">
                        <IoSadOutline className="error-icon" />
                        <p>{careHistoryError}</p>
                        <button 
                            className="retry-button"
                            onClick={() => fetchCareHistory(plantId)}
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Plant not found
    if (!currentPlant) {
        return (
            <div className="care-history">
                <div className="care-history-container">
                    <div className="error-state">
                        <IoSadOutline className="error-icon" />
                        <p>Planta no encontrada</p>
                        <button 
                            className="retry-button"
                            onClick={handleBack}
                        >
                            {content.backButton}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="care-history-page">
            {/* Add Care Modal */}
            <SetAddCareModalOpen />
            
            <div className="care-history-container">
                {/* Header */}
                <div className="care-history-header">
                    <button 
                        className="back-button"
                        onClick={handleBack}
                        aria-label={content.backButton}
                    >
                        <IoArrowBackOutline />
                        <span className="not_responsive">{content.backButton}</span>
                    </button>
                    
                    <h1 className="page-title">
                        <IoLeafOutline /> {content.pageTitle}
                    </h1>
                </div>

                {/* Plant Info Card */}
                <div className="plant-info-card">
                    <div className="plant-info-content">
                        <div className="plant-image-container">
                            {/* Fix: Use 'photo' field instead of 'image' according to Plants model */}
                            {currentPlant.photo ? (
                                <img 
                                    src={currentPlant.photo} 
                                    alt={currentPlant.name}
                                    className="plant-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                    }}
                                />
                            ) : null}
                            <div 
                                className="no-image" 
                                style={{ display: currentPlant.photo ? 'none' : 'flex' }}
                            >
                                <IoLeafOutline />
                            </div>
                        </div>
                        
                        <div className="plant-details">
                            <h2 className="plant-name">{currentPlant.name}</h2>
                            {currentPlant.species && (
                                <p className="plant-species">{currentPlant.species}</p>
                            )}
                            <div className="plant-location">
                                <IoLocationOutline /> 
                                {currentPlant.location || 'No especificada'}
                            </div>
                            {/* Add additional plant info if available */}
                            {currentPlant.info?.status && (
                                <div className="plant-status">
                                    <span className={`status-badge status-${currentPlant.info.status}`}>
                                        {currentPlant.info.status === 'healthy' && 'Saludable'}
                                        {currentPlant.info.status === 'needsWater' && 'Necesita agua'}
                                        {currentPlant.info.status === 'needsAttention' && 'Necesita atención'}
                                        {currentPlant.info.status === 'sick' && 'Enferma'}
                                    </span>
                                </div>
                            )}
                            {/* Show last watering info if available */}
                            {currentPlant.info?.lastWatering && (
                                <div className="plant-last-watering">
                                    <IoWaterOutline />
                                    <span>Último riego: {formatDate(currentPlant.info.lastWatering)}</span>
                                </div>
                            )}
                            {/* Show next watering info if available */}
                            {currentPlant.info?.nextWatering && (
                                <div className="plant-next-watering">
                                    <IoTimeOutline />
                                    <span>Próximo riego: {formatDate(currentPlant.info.nextWatering)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="care-history-controls">
                    <div className="filters-section">
                        <div className="filter-group">
                            <IoFilterOutline className="filter-icon" />
                            <select 
                                value={careHistoryFilter} 
                                onChange={(e) => setCareHistoryFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">{content.filters.all}</option>
                                <option value="completed">{content.filters.completed}</option>
                                <option value="pending">{content.filters.pending}</option>
                            </select>
                        </div>
                        
                        <div className="filter-group">
                            <IoSwapVerticalOutline className="filter-icon" />
                            <select 
                                value={careHistorySortBy} 
                                onChange={(e) => setCareHistorySortBy(e.target.value)}
                                className="filter-select"
                            >
                                <option value="date">{content.filters.date}</option>
                                <option value="type">{content.filters.type}</option>
                            </select>
                        </div>
                    </div>
                    
                    <button 
                        className="add-care-button"
                        onClick={() => openAddCareModal()}
                    >
                        <IoAddOutline /> 
                        <span className="not_responsive">{content.actions.addCare}</span>
                    </button>
                </div>

                {/* Care History List */}
                <div className="care-history-content">
                    <h3 className="section-title">
                        {content.careHistory.title} ({filteredAndSortedRecords.length})
                    </h3>
                    
                    {filteredAndSortedRecords.length === 0 ? (
                        <div className="empty-state">
                            <IoSadOutline className="empty-icon" />
                            <p className="empty-message">{content.careHistory.empty}</p>
                            <p className="empty-suggestion">{content.careHistory.addFirst}</p>
                        </div>
                    ) : (
                        <div className="care-records-list">
                            {filteredAndSortedRecords.map((record) => {
                                const typeInfo = getCareTypeInfo(record.careType)
                                
                                return (
                                    <div key={record._id} className="care-record-card">
                                        <div className="care-record-header">
                                            <div className="care-type-info">
                                                <div className={`care-type-icon ${typeInfo.className}`}>
                                                    {typeInfo.icon}
                                                </div>
                                                <div className="care-type-details">
                                                    <h4 className="care-type-name">
                                                        {content.careTypes[record.careType]}
                                                    </h4>
                                                    <p className="care-description">
                                                        {record.description || content.placeholders.noDescription}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="care-status">
                                                {record.completed ? (
                                                    <div className="status-completed">
                                                        <IoCheckmarkCircleOutline />
                                                        <span>{content.careRecord.completed}</span>
                                                    </div>
                                                ) : (
                                                    <div className="status-pending">
                                                        <IoEllipseOutline />
                                                        <span>{content.careRecord.pending}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="care-record-body">
                                            {record.notes && (
                                                <div className="care-notes">
                                                    <IoDocumentTextOutline className="notes-icon" />
                                                    <p>{record.notes}</p>
                                                </div>
                                            )}
                                            
                                            <div className="care-dates">
                                                <div className="date-info">
                                                    <IoCalendarOutline className="date-icon" />
                                                    <div className="date-details">
                                                        <span className="date-label">
                                                            {record.completed ? content.careRecord.completedAt : content.careRecord.createdAt}
                                                        </span>
                                                        <span className="date-value">
                                                            {formatDate(record.completed ? record.completedAt : record.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {record.nextDueDate && (
                                                    <div className="date-info">
                                                        <IoTimeOutline className="date-icon" />
                                                        <div className="date-details">
                                                            <span className="date-label">
                                                                {content.careRecord.nextDue}
                                                            </span>
                                                            <span className="date-value">
                                                                {formatDate(record.nextDueDate)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {!record.completed && (
                                            <div className="care-record-actions">
                                                <button 
                                                    className="action-button btn-primary"
                                                    onClick={() => handleMarkCompleted(record._id)}
                                                >
                                                    <IoCheckmarkCircleOutline />
                                                    <span className="not_responsive">
                                                        {content.actions.markCompleted}
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CareHistory