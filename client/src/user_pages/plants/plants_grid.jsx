import { useEffect, useMemo } from 'react'
import { useAppContext } from '../../context/app_context'
import content from './content/plants_grid.json'
import './styles/plants_grid.css'

const PlantsGrid = () => {
    const {
        plants,
        isLoadingPlants,
        plantsError,
        plantsFilter,
        setPlantsFilter,
        plantsSortBy,
        setPlantsSortBy,
        fetchPlants,
        openViewModal,
        openEditModal,
        openDeleteModal
    } = useAppContext()

    // Fetch plants on component mount
    useEffect(() => {
        fetchPlants()
    }, [])

    // Helper function to format dates
    const formatDate = (date) => {
        const now = new Date()
        const diffTime = date - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) {
            return content.plantCard.today
        } else if (diffDays < 0) {
            return content.plantCard.daysAgo.replace('{{days}}', Math.abs(diffDays))
        } else {
            return content.plantCard.inDays.replace('{{days}}', diffDays)
        }
    }

    // Helper function to get status display text
    const getStatusText = (status) => {
        return content.status[status] || status
    }

    // Helper function to get status CSS class
    const getStatusClass = (status) => {
        const statusMap = {
            healthy: 'healthy',
            needsWater: 'needsWater',
            needsAttention: 'needsAttention',
            sick: 'sick'
        }
        return statusMap[status] || 'healthy'
    }

    // Filter and sort plants
    const filteredAndSortedPlants = useMemo(() => {
        let filtered = plants

        // Apply filter
        if (plantsFilter !== 'all') {
            filtered = plants.filter(plant => plant.status === plantsFilter)
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (plantsSortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'lastWatered':
                    return new Date(b.lastWatered) - new Date(a.lastWatered)
                case 'nextWatering':
                    return new Date(a.nextWatering) - new Date(b.nextWatering)
                case 'status':
                    return a.status.localeCompare(b.status)
                default:
                    return 0
            }
        })

        return filtered
    }, [plants, plantsFilter, plantsSortBy])

    // Handle add new plant (placeholder for future modal)
    const handleAddPlant = () => {
        // #backend - will open add plant modal when implemented
        console.log('Add new plant clicked')
    }

    // Render loading state
    if (isLoadingPlants) {
        return (
            <div className="plants_grid">
                <div className="plants_grid__loading">
                    {content.loading}
                </div>
            </div>
        )
    }

    // Render error state
    if (plantsError) {
        return (
            <div className="plants_grid">
                <div className="plants_grid__error">
                    {plantsError}
                </div>
            </div>
        )
    }

    // Render empty state
    if (plants.length === 0) {
        return (
            <div className="plants_grid">
                <div className="plants_grid__empty">
                    <h2 className="plants_grid__empty_title">
                        {content.emptyState.title}
                    </h2>
                    <p className="plants_grid__empty_description">
                        {content.emptyState.description}
                    </p>
                    <button 
                        className="plants_grid__empty_button"
                        onClick={handleAddPlant}
                    >
                        {content.emptyState.buttonText}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="plants_grid">
            {/* Header Section */}
            <div className="plants_grid__header">
                <div>
                    <h1 className="plants_grid__title">{content.title}</h1>
                    <p className="plants_grid__subtitle">{content.subtitle}</p>
                </div>
                
                <div className="plants_grid__controls">
                    {/* Filter Dropdown */}
                    <select 
                        className="plants_grid__filter_select"
                        value={plantsFilter}
                        onChange={(e) => setPlantsFilter(e.target.value)}
                    >
                        <option value="all">Todas las plantas</option>
                        <option value="healthy">Saludables</option>
                        <option value="needsWater">Necesitan agua</option>
                        <option value="needsAttention">Necesitan atención</option>
                        <option value="sick">Enfermas</option>
                    </select>

                    {/* Sort Dropdown */}
                    <select 
                        className="plants_grid__filter_select"
                        value={plantsSortBy}
                        onChange={(e) => setPlantsSortBy(e.target.value)}
                    >
                        <option value="name">Ordenar por nombre</option>
                        <option value="lastWatered">Último riego</option>
                        <option value="nextWatering">Próximo riego</option>
                        <option value="status">Estado</option>
                    </select>

                    {/* Add Plant Button */}
                    <button 
                        className="plants_grid__add_button"
                        onClick={handleAddPlant}
                    >
                        <span>+</span>
                        {content.buttons.addNew}
                    </button>
                </div>
            </div>

            {/* Plants Grid */}
            <div className="plants_grid__container">
                {filteredAndSortedPlants.map((plant) => (
                    <div key={plant.id} className="plants_grid__card">
                        {/* Plant Image */}
                        <div className="plants_grid__card_image">
                            {plant.image ? (
                                <img 
                                    src={plant.image} 
                                    alt={plant.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span>🌱</span>
                            )}
                        </div>

                        {/* Card Content */}
                        <div className="plants_grid__card_content">
                            {/* Header with name and status */}
                            <div className="plants_grid__card_header">
                                <div>
                                    <h3 className="plants_grid__card_name">{plant.name}</h3>
                                    <p className="plants_grid__card_species">{plant.species}</p>
                                </div>
                                <span className={`plants_grid__card_status plants_grid__card_status--${getStatusClass(plant.status)}`}>
                                    {getStatusText(plant.status)}
                                </span>
                            </div>

                            {/* Plant Information */}
                            <div className="plants_grid__card_info">
                                <div className="plants_grid__card_info_item">
                                    <span className="plants_grid__card_info_label">
                                        {content.plantCard.location}
                                    </span>
                                    <span className="plants_grid__card_info_value">
                                        {plant.location}
                                    </span>
                                </div>
                                
                                <div className="plants_grid__card_info_item">
                                    <span className="plants_grid__card_info_label">
                                        {content.plantCard.lastWatered}
                                    </span>
                                    <span className="plants_grid__card_info_value">
                                        {formatDate(new Date(plant.lastWatered))}
                                    </span>
                                </div>
                                
                                <div className="plants_grid__card_info_item">
                                    <span className="plants_grid__card_info_label">
                                        {content.plantCard.nextWatering}
                                    </span>
                                    <span className="plants_grid__card_info_value">
                                        {formatDate(new Date(plant.nextWatering))}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="plants_grid__card_actions">
                                <button 
                                    className="plants_grid__card_button plants_grid__card_button--view"
                                    onClick={() => openViewModal(plant)}
                                >
                                    {content.buttons.view}
                                </button>
                                
                                <button 
                                    className="plants_grid__card_button plants_grid__card_button--edit"
                                    onClick={() => openEditModal(plant)}
                                >
                                    {content.buttons.edit}
                                </button>
                                
                                <button 
                                    className="plants_grid__card_button plants_grid__card_button--delete"
                                    onClick={() => openDeleteModal(plant)}
                                >
                                    {content.buttons.delete}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlantsGrid