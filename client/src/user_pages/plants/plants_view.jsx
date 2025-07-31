import React, { useContext } from 'react'
import AppContext from '../../context/app_context.jsx'
import content from './content/plants_view.json'
import './styles/plants_view.css'
// React Icons imports
import { 
    IoClose, 
    IoLeafOutline, 
    IoLocationOutline, 
    IoWaterOutline, 
    IoTimeOutline, 
    IoDocumentTextOutline,
    IoStatsChartOutline,
    IoCreateOutline,
    IoEyeOutline,
    IoTrashOutline,
    IoCheckmarkCircleOutline,
    IoWarningOutline,
    IoAlertCircleOutline
} from 'react-icons/io5'

const PlantsView = () => {
    const {
        isViewModalOpen,
        selectedPlant,
        closeAllModals,
        navigate,
        openEditModal,
        openDeleteModal
    } = useContext(AppContext)

    if (!isViewModalOpen || !selectedPlant) {
        return null
    }

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            closeAllModals()
        }
    }

    const handleCareHistory = () => {
        // Navigate to care history page
        navigate(`/care-history/${selectedPlant._id}`)
        closeAllModals()
    }

    const formatDate = (date) => {
        if (!date) return 'No disponible'
        
        const plantDate = new Date(date)
        const now = new Date()
        const diffTime = Math.abs(now - plantDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }
        
        const formattedDate = plantDate.toLocaleDateString('es-ES', options)
        
        // Check if it's the next watering date for special formatting
        if (date === selectedPlant.info?.nextWatering) {
            if (diffDays === 0) return `Hoy (${formattedDate})`
            if (diffDays === 1) return plantDate > now ? `Mañana (${formattedDate})` : `Ayer (${formattedDate})`
            return plantDate > now ? `En ${diffDays} días (${formattedDate})` : `Hace ${diffDays} días (${formattedDate})`
        }
        
        return formattedDate
    }

    const getStatusInfo = (status) => {
        const statusMap = {
            healthy: {
                text: content.status.healthy,
                className: 'status-healthy',
                icon: <IoCheckmarkCircleOutline />
            },
            needsWater: {
                text: content.status.needsWater,
                className: 'status-needsWater',
                icon: <IoWaterOutline />
            },
            needsAttention: {
                text: content.status.needsAttention,
                className: 'status-needsAttention',
                icon: <IoWarningOutline />
            },
            sick: {
                text: content.status.sick,
                className: 'status-sick',
                icon: <IoAlertCircleOutline />
            }
        }
        
        return statusMap[status] || statusMap.healthy
    }

    // Access nested properties from the backend model structure
    const plantPhoto = selectedPlant.photo
    const plantStatus = selectedPlant.info?.status || 'healthy'
    const plantLastWatering = selectedPlant.info?.lastWatering
    const plantNextWatering = selectedPlant.info?.nextWatering
    const plantNotes = selectedPlant.info?.notes

    const statusInfo = getStatusInfo(plantStatus)

    return (
        <div className="plant_view" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        <IoLeafOutline /> {content.modal.title}
                    </h2>
                    <button 
                        className="close-button" 
                        onClick={closeAllModals}
                        aria-label={content.modal.close}
                    >
                        <IoClose />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Plant Image Section */}
                    <div className="plant-image-section">
                        {plantPhoto ? (
                            <img 
                                src={plantPhoto} 
                                alt={selectedPlant.name}
                                className="plant-image"
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                }}
                            />
                        ) : null}
                        <div 
                            className="no-image" 
                            style={{ display: plantPhoto ? 'none' : 'flex' }}
                        >
                            <IoLeafOutline /> {content.placeholders.noImage}
                        </div>
                    </div>

                    {/* Plant Name and Species */}
                    <h3 className="plant-name">{selectedPlant.name}</h3>
                    {selectedPlant.species && (
                        <p className="plant-species">{selectedPlant.species}</p>
                    )}

                    {/* Plant Information Grid */}
                    <div className="plant-info-grid">
                        <div className="info-card">
                            <div className="info-label">
                                <IoLocationOutline /> {content.plantInfo.location}
                            </div>
                            <div className="info-value">
                                {selectedPlant.location || 'No especificada'}
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-label">
                                {statusInfo.icon} {content.plantInfo.status}
                            </div>
                            <div className="info-value">
                                <span className={`status-badge ${statusInfo.className}`}>
                                    {statusInfo.text}
                                </span>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-label">
                                <IoWaterOutline /> {content.plantInfo.lastWatered}
                            </div>
                            <div className="info-value">
                                {formatDate(plantLastWatering)}
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-label">
                                <IoTimeOutline /> {content.plantInfo.nextWatering}
                            </div>
                            <div className="info-value">
                                {formatDate(plantNextWatering)}
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="notes-section">
                        <div className="notes-title">
                            <IoDocumentTextOutline /> {content.plantInfo.notes}
                        </div>
                        <div className="notes-content">
                            {plantNotes ? (
                                plantNotes
                            ) : (
                                <span className="no-notes">
                                    {content.placeholders.noNotes}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="modal-actions">
                        <button 
                            className="action-button btn-primary"
                            onClick={handleCareHistory}
                        >
                            <IoStatsChartOutline /> {content.modal.careHistory}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlantsView