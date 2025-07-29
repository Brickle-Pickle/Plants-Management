import { useAppContext } from '../../context/app_context'
import content from './content/plants_delete.json'
import './styles/plants_delete.css'

const PlantsDelete = () => {
    const {
        isDeleteModalOpen,
        selectedPlant,
        isLoading,
        closeAllModals,
        deletePlant
    } = useAppContext()

    // Don't render if modal is not open or no plant is selected
    if (!isDeleteModalOpen || !selectedPlant) {
        return null
    }

    // Handle delete confirmation
    const handleDelete = async () => {
        try {
            await deletePlant(selectedPlant.id)
            // Modal will be closed automatically by deletePlant function
        } catch (error) {
            console.error('Error deleting plant:', error)
        }
    }

    // Handle cancel
    const handleCancel = () => {
        closeAllModals()
    }

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeAllModals()
        }
    }

    // Format date for display
    const formatDate = (date) => {
        if (!date) return 'No registrado'
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="plant_delete__backdrop" onClick={handleBackdropClick}>
            <div className="plant_delete">
                <div className="plant_delete__header">
                    <h2 className="plant_delete__title">{content.title}</h2>
                    <button 
                        className="plant_delete__close"
                        onClick={handleCancel}
                        aria-label="Cerrar modal"
                    >
                        ×
                    </button>
                </div>

                <div className="plant_delete__content">
                    <div className="plant_delete__warning">
                        <div className="plant_delete__warning-icon">
                            ⚠️
                        </div>
                        <div className="plant_delete__warning-text">
                            <p className="plant_delete__subtitle">{content.subtitle}</p>
                            <p className="plant_delete__warning-message">{content.warning}</p>
                        </div>
                    </div>

                    <div className="plant_delete__plant-info">
                        <div className="plant_delete__plant-image">
                            {selectedPlant.image ? (
                                <img 
                                    src={selectedPlant.image} 
                                    alt={selectedPlant.name}
                                    className="plant_delete__image"
                                />
                            ) : (
                                <div className="plant_delete__image-placeholder">
                                    🌱
                                </div>
                            )}
                        </div>

                        <div className="plant_delete__plant-details">
                            <div className="plant_delete__detail">
                                <span className="plant_delete__detail-label">
                                    {content.plantInfo.name}
                                </span>
                                <span className="plant_delete__detail-value">
                                    {selectedPlant.name}
                                </span>
                            </div>

                            <div className="plant_delete__detail">
                                <span className="plant_delete__detail-label">
                                    {content.plantInfo.species}
                                </span>
                                <span className="plant_delete__detail-value">
                                    {selectedPlant.species || 'No especificada'}
                                </span>
                            </div>

                            <div className="plant_delete__detail">
                                <span className="plant_delete__detail-label">
                                    {content.plantInfo.location}
                                </span>
                                <span className="plant_delete__detail-value">
                                    {selectedPlant.location || 'No especificada'}
                                </span>
                            </div>

                            <div className="plant_delete__detail">
                                <span className="plant_delete__detail-label">
                                    {content.plantInfo.lastWatered}
                                </span>
                                <span className="plant_delete__detail-value">
                                    {formatDate(selectedPlant.lastWatered)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="plant_delete__actions">
                    <button 
                        className="plant_delete__button plant_delete__button--cancel"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        {content.buttons.cancel}
                    </button>
                    
                    <button 
                        className="plant_delete__button plant_delete__button--delete"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? content.buttons.deleting : content.buttons.delete}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PlantsDelete