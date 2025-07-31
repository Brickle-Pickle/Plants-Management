import { useEffect, useMemo } from 'react'
import { useAppContext } from '../../context/app_context'
import content from './content/plants_grid.json'
import './styles/plants_grid.css'

const PlantsGrid = () => {
    const {
        plants,
        isLoading,
        user,
        isLoadingPlants,
        plantsError,
        plantsFilter,
        setPlantsFilter,
        plantsSortBy,
        setPlantsSortBy,
        fetchPlants,
        openViewModal,
        openEditModal,
        openDeleteModal,
        openAddModal,
        isAuthenticated
    } = useAppContext()

    // Fetch plants on component mount
    useEffect(() => {
        console.log('=== PLANTS GRID useEffect ===');
        console.log('isLoading:', isLoading);
        console.log('isAuthenticated:', isAuthenticated);
        console.log('user:', user);
        console.log('user._id:', user?._id);
        
        if (!isLoading && isAuthenticated && user?._id) {
            console.log('Conditions met - calling fetchPlants');
            fetchPlants()
        } else {
            console.log('Conditions not met:', {
                isLoading,
                isAuthenticated,
                hasUserId: !!user?._id
            });
        }
    }, [isLoading, isAuthenticated, user?._id]) // Changed dependency to user?._id instead of user

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
        // Ensure plants is an array before processing
        if (!plants || !Array.isArray(plants)) {
            return []
        }
        
        let filtered = plants

        // Apply filter - adjust for backend structure
        if (plantsFilter !== 'all') {
            filtered = plants.filter(plant => {
                const status = plant.info?.status || plant.status;
                return status === plantsFilter;
            })
        }

        // Apply sorting - adjust for backend structure
        filtered.sort((a, b) => {
            switch (plantsSortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'lastWatered':
                    const aLastWatered = a.info?.lastWatering || a.lastWatered;
                    const bLastWatered = b.info?.lastWatering || b.lastWatered;
                    if (!aLastWatered || !bLastWatered) return 0;
                    return new Date(bLastWatered) - new Date(aLastWatered)
                case 'nextWatering':
                    const aNextWatering = a.info?.nextWatering || a.nextWatering;
                    const bNextWatering = b.info?.nextWatering || b.nextWatering;
                    if (!aNextWatering || !bNextWatering) return 0;
                    return new Date(aNextWatering) - new Date(bNextWatering)
                case 'status':
                    const aStatus = a.info?.status || a.status || '';
                    const bStatus = b.info?.status || b.status || '';
                    return aStatus.localeCompare(bStatus)
                default:
                    return 0
            }
        })

        return filtered
    }, [plants, plantsFilter, plantsSortBy])

    const handleAddPlant = () => {
        openAddModal();
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
    if (!plants || plants.length === 0) {
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
                    <div key={plant._id || plant.id} className="plants_grid__card">
                        {/* Plant Image */}
                        <div className="plants_grid__card_image">
                            {plant.photo ? (
                                <img 
                                    src={plant.photo} 
                                    alt={plant.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span></span>
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
                                <span className={`plants_grid__card_status plants_grid__card_status--${getStatusClass(plant.info?.status || plant.status)}`}>
                                    {getStatusText(plant.info?.status || plant.status)}
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
                                        {plant.info?.lastWatering ? formatDate(new Date(plant.info.lastWatering)) : 'No registrado'}
                                    </span>
                                </div>
                                
                                <div className="plants_grid__card_info_item">
                                    <span className="plants_grid__card_info_label">
                                        {content.plantCard.nextWatering}
                                    </span>
                                    <span className="plants_grid__card_info_value">
                                        {plant.info?.nextWatering ? formatDate(new Date(plant.info.nextWatering)) : 'No programado'}
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