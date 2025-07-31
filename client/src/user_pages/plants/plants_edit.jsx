import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/app_context'
import { 
    FaTimes, 
    FaLeaf, 
    FaMapMarkerAlt, 
    FaCalendarAlt, 
    FaStickyNote,
    FaImage,
    FaCheck,
    FaExclamationTriangle,
    FaHeartbeat,
    FaTint
} from 'react-icons/fa'
import content from './content/plants_edit.json'
import './styles/plants_edit.css'

const PlantsEdit = () => {
    const {
        isEditModalOpen,
        selectedPlant,
        isLoading,
        closeAllModals,
        updatePlant
    } = useAppContext()

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        location: '',
        status: '',
        lastWatered: '',
        nextWatering: '',
        notes: '',
        image: ''
    })

    // Validation state
    const [errors, setErrors] = useState({})
    const [isFormValid, setIsFormValid] = useState(false)

    // Initialize form data when modal opens or plant changes
    useEffect(() => {
        if (isEditModalOpen && selectedPlant) {
            setFormData({
                name: selectedPlant.name || '',
                species: selectedPlant.species || '',
                location: selectedPlant.location || '',
                status: selectedPlant.status || '',
                lastWatered: selectedPlant.lastWatered 
                    ? new Date(selectedPlant.lastWatered).toISOString().split('T')[0] 
                    : '',
                nextWatering: selectedPlant.nextWatering 
                    ? new Date(selectedPlant.nextWatering).toISOString().split('T')[0] 
                    : '',
                notes: selectedPlant.notes || '',
                image: selectedPlant.image || ''
            })
            setErrors({})
        }
    }, [isEditModalOpen, selectedPlant])

    // Validate form
    useEffect(() => {
        const newErrors = {}

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = content.messages.validation.nameRequired
        } else if (formData.name.trim().length < 2) {
            newErrors.name = content.messages.validation.nameMinLength
        }

        // Species validation
        if (formData.species.trim() && formData.species.trim().length < 2) {
            newErrors.species = content.messages.validation.speciesMinLength
        }

        // Location validation
        if (formData.location.trim() && formData.location.trim().length < 2) {
            newErrors.location = content.messages.validation.locationMinLength
        }

        // Date validations
        if (formData.lastWatered) {
            const lastWateredDate = new Date(formData.lastWatered)
            const today = new Date()
            today.setHours(23, 59, 59, 999) // End of today
            
            if (lastWateredDate > today) {
                newErrors.lastWatered = content.messages.validation.futureLastWatered
            }
        }

        if (formData.nextWatering) {
            const nextWateringDate = new Date(formData.nextWatering)
            const today = new Date()
            today.setHours(0, 0, 0, 0) // Start of today
            
            if (nextWateringDate < today) {
                newErrors.nextWatering = content.messages.validation.pastNextWatering
            }
        }

        setErrors(newErrors)
        setIsFormValid(Object.keys(newErrors).length === 0 && formData.name.trim())
    }, [formData])

    // Don't render if modal is not open or no plant is selected
    if (!isEditModalOpen || !selectedPlant) {
        return null
    }

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!isFormValid || isLoading) return

        try {
            const updatedData = {
                ...formData,
                lastWatered: formData.lastWatered ? new Date(formData.lastWatered) : null,
                nextWatering: formData.nextWatering ? new Date(formData.nextWatering) : null
            }

            try {
                await updatePlant(selectedPlant._id, updatedData)
            } catch (error) {
                console.error('Error updating plant:', error)
            }
        } catch (error) {
            console.error('Error updating plant:', error)
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

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'healthy':
                return <FaCheck />
            case 'needsWater':
                return <FaTint />
            case 'needsAttention':
                return <FaExclamationTriangle />
            case 'sick':
                return <FaHeartbeat />
            default:
                return <FaLeaf />
        }
    }

    return (
        <div className="plant_edit__backdrop" onClick={handleBackdropClick}>
            <div className="plant_edit">
                <div className="plant_edit__header">
                    <div className="plant_edit__header-content">
                        <h2 className="plant_edit__title">{content.title}</h2>
                        <p className="plant_edit__subtitle">{content.subtitle}</p>
                    </div>
                    <button 
                        className="plant_edit__close"
                        onClick={handleCancel}
                        aria-label="Cerrar modal"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form className="plant_edit__form" onSubmit={handleSubmit}>
                    <div className="plant_edit__content">
                        {/* Image Section */}
                        <div className="plant_edit__image-section">
                            <div className="plant_edit__image-container">
                                {formData.image ? (
                                    <img 
                                        src={formData.image} 
                                        alt={formData.name}
                                        className="plant_edit__image"
                                    />
                                ) : (
                                    <div className="plant_edit__image-placeholder">
                                        <FaImage />
                                        <span>{content.placeholders.noImage}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="plant_edit__field">
                                <label className="plant_edit__label">
                                    <FaImage />
                                    {content.form.image.label}
                                </label>
                                <input
                                    type="url"
                                    className="plant_edit__input"
                                    value={formData.image}
                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                    placeholder={content.form.image.placeholder}
                                />
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="plant_edit__fields">
                            {/* Name Field */}
                            <div className="plant_edit__field">
                                <label className="plant_edit__label plant_edit__label--required">
                                    <FaLeaf />
                                    {content.form.name.label}
                                </label>
                                <input
                                    type="text"
                                    className={`plant_edit__input ${errors.name ? 'plant_edit__input--error' : ''}`}
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder={content.form.name.placeholder}
                                    required
                                />
                                {errors.name && (
                                    <span className="plant_edit__error">{errors.name}</span>
                                )}
                            </div>

                            {/* Species Field */}
                            <div className="plant_edit__field">
                                <label className="plant_edit__label">
                                    <FaLeaf />
                                    {content.form.species.label}
                                </label>
                                <input
                                    type="text"
                                    className={`plant_edit__input ${errors.species ? 'plant_edit__input--error' : ''}`}
                                    value={formData.species}
                                    onChange={(e) => handleInputChange('species', e.target.value)}
                                    placeholder={content.form.species.placeholder}
                                />
                                {errors.species && (
                                    <span className="plant_edit__error">{errors.species}</span>
                                )}
                            </div>

                            {/* Location Field */}
                            <div className="plant_edit__field">
                                <label className="plant_edit__label">
                                    <FaMapMarkerAlt />
                                    {content.form.location.label}
                                </label>
                                <input
                                    type="text"
                                    className={`plant_edit__input ${errors.location ? 'plant_edit__input--error' : ''}`}
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder={content.form.location.placeholder}
                                />
                                {errors.location && (
                                    <span className="plant_edit__error">{errors.location}</span>
                                )}
                            </div>

                            {/* Status Field */}
                            <div className="plant_edit__field">
                                <label className="plant_edit__label">
                                    <FaHeartbeat />
                                    {content.form.status.label}
                                </label>
                                <div className="plant_edit__select-wrapper">
                                    <select
                                        className="plant_edit__select"
                                        value={formData.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                    >
                                        <option value="">{content.placeholders.selectStatus}</option>
                                        {Object.entries(content.form.status.options).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {formData.status && (
                                        <div className="plant_edit__status-icon">
                                            {getStatusIcon(formData.status)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Date Fields */}
                            <div className="plant_edit__date-fields">
                                <div className="plant_edit__field">
                                    <label className="plant_edit__label">
                                        <FaCalendarAlt />
                                        {content.form.lastWatered.label}
                                    </label>
                                    <input
                                        type="date"
                                        className={`plant_edit__input ${errors.lastWatered ? 'plant_edit__input--error' : ''}`}
                                        value={formData.lastWatered}
                                        onChange={(e) => handleInputChange('lastWatered', e.target.value)}
                                    />
                                    {errors.lastWatered && (
                                        <span className="plant_edit__error">{errors.lastWatered}</span>
                                    )}
                                </div>

                                <div className="plant_edit__field">
                                    <label className="plant_edit__label">
                                        <FaCalendarAlt />
                                        {content.form.nextWatering.label}
                                    </label>
                                    <input
                                        type="date"
                                        className={`plant_edit__input ${errors.nextWatering ? 'plant_edit__input--error' : ''}`}
                                        value={formData.nextWatering}
                                        onChange={(e) => handleInputChange('nextWatering', e.target.value)}
                                    />
                                    {errors.nextWatering && (
                                        <span className="plant_edit__error">{errors.nextWatering}</span>
                                    )}
                                </div>
                            </div>

                            {/* Notes Field */}
                            <div className="plant_edit__field">
                                <label className="plant_edit__label">
                                    <FaStickyNote />
                                    {content.form.notes.label}
                                </label>
                                <textarea
                                    className="plant_edit__textarea"
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    placeholder={content.form.notes.placeholder}
                                    rows="4"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="plant_edit__actions">
                        <button 
                            type="button"
                            className="plant_edit__button plant_edit__button--cancel"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            {content.buttons.cancel}
                        </button>
                        
                        <button 
                            type="submit"
                            className="plant_edit__button plant_edit__button--save"
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? content.buttons.saving : content.buttons.save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PlantsEdit