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
    FaTint,
    FaUpload
} from 'react-icons/fa'
import content from './content/plants_add.json'
import './styles/plants_add.css'

const PlantsAdd = () => {
    const {
        isAddModalOpen,
        isLoading,
        closeAllModals,
        addPlant
    } = useAppContext()

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        location: '',
        status: 'healthy',
        lastWatered: '',
        nextWatering: '',
        notes: '',
        image: ''
    })

    // Validation state
    const [errors, setErrors] = useState({})
    const [isFormValid, setIsFormValid] = useState(false)

    // Reset form when modal opens
    useEffect(() => {
        if (isAddModalOpen) {
            setFormData({
                name: '',
                species: '',
                location: '',
                status: 'healthy',
                lastWatered: '',
                nextWatering: '',
                notes: '',
                image: ''
            })
            setErrors({})
        }
    }, [isAddModalOpen])

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

    // Don't render if modal is not open
    if (!isAddModalOpen) {
        return null
    }

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Handle image file upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // #backend - In real app, this would upload to server/cloud storage
            const reader = new FileReader()
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    image: event.target.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!isFormValid || isLoading) return

        try {
            await addPlant(formData)
        } catch (error) {
            console.error('Error adding plant:', error)
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
        <div className="plant_add__backdrop" onClick={handleBackdropClick}>
            <div className="plant_add">
                <div className="plant_add__header">
                    <div className="plant_add__header-content">
                        <h2 className="plant_add__title">{content.title}</h2>
                        <p className="plant_add__subtitle">{content.subtitle}</p>
                    </div>
                    <button 
                        className="plant_add__close"
                        onClick={handleCancel}
                        aria-label="Cerrar modal"
                    >
                        <FaTimes />
                    </button>
                </div>

                <form className="plant_add__form" onSubmit={handleSubmit}>
                    <div className="plant_add__content">
                        {/* Image Section */}
                        <div className="plant_add__image-section">
                            <div className="plant_add__image-container">
                                {formData.image ? (
                                    <img 
                                        src={formData.image} 
                                        alt={formData.name || content.placeholders.noImage}
                                        className="plant_add__image"
                                    />
                                ) : (
                                    <div className="plant_add__image-placeholder">
                                        <FaImage />
                                        <span>{content.placeholders.noImage}</span>
                                    </div>
                                )}
                            </div>

                            <div className="plant_add__image-upload">
                                <input
                                    type="file"
                                    id="plant-image-upload"
                                    className="plant_add__image-input"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <label 
                                    htmlFor="plant-image-upload" 
                                    className="plant_add__image-button"
                                >
                                    <FaUpload />
                                    {formData.image ? content.form.image.changeText : content.form.image.uploadText}
                                </label>

                                <input
                                    type="url"
                                    className="plant_add__image-url"
                                    placeholder={content.form.image.placeholder}
                                    value={formData.image}
                                    onChange={(e) => handleInputChange('image', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="plant_add__fields">
                            {/* Plant Name */}
                            <div className="plant_add__field">
                                <label className="plant_add__label">
                                    <FaLeaf />
                                    {content.form.name.label}
                                </label>
                                <input
                                    type="text"
                                    className="plant_add__input"
                                    placeholder={content.form.name.placeholder}
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                                {errors.name && (
                                    <span className="plant_add__error">{errors.name}</span>
                                )}
                            </div>

                            {/* Species */}
                            <div className="plant_add__field">
                                <label className="plant_add__label">
                                    <FaLeaf />
                                    {content.form.species.label}
                                </label>
                                <input
                                    type="text"
                                    className="plant_add__input"
                                    placeholder={content.form.species.placeholder}
                                    value={formData.species}
                                    onChange={(e) => handleInputChange('species', e.target.value)}
                                />
                                {errors.species && (
                                    <span className="plant_add__error">{errors.species}</span>
                                )}
                            </div>

                            {/* Location */}
                            <div className="plant_add__field">
                                <label className="plant_add__label">
                                    <FaMapMarkerAlt />
                                    {content.form.location.label}
                                </label>
                                <input
                                    type="text"
                                    className="plant_add__input"
                                    placeholder={content.form.location.placeholder}
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                />
                                {errors.location && (
                                    <span className="plant_add__error">{errors.location}</span>
                                )}
                            </div>

                            {/* Status */}
                            <div className="plant_add__field">
                                <label className="plant_add__label">
                                    {getStatusIcon(formData.status)}
                                    {content.form.status.label}
                                </label>
                                <select
                                    className="plant_add__select"
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
                            </div>

                            {/* Last Watered */}
                            <div className="plant_add__field">
                                <label className="plant_add__label">
                                    <FaCalendarAlt />
                                    {content.form.lastWatered.label}
                                </label>
                                <input
                                    type="date"
                                    className="plant_add__input"
                                    value={formData.lastWatered}
                                    onChange={(e) => handleInputChange('lastWatered', e.target.value)}
                                />
                                {errors.lastWatered && (
                                    <span className="plant_add__error">{errors.lastWatered}</span>
                                )}
                            </div>

                            {/* Next Watering */}
                            <div className="plant_add__field">
                                <label className="plant_add__label">
                                    <FaCalendarAlt />
                                    {content.form.nextWatering.label}
                                </label>
                                <input
                                    type="date"
                                    className="plant_add__input"
                                    value={formData.nextWatering}
                                    onChange={(e) => handleInputChange('nextWatering', e.target.value)}
                                />
                                {errors.nextWatering && (
                                    <span className="plant_add__error">{errors.nextWatering}</span>
                                )}
                            </div>

                            {/* Notes */}
                            <div className="plant_add__field">
                                <label className="plant_add__label">
                                    <FaStickyNote />
                                    {content.form.notes.label}
                                </label>
                                <textarea
                                    className="plant_add__textarea"
                                    placeholder={content.form.notes.placeholder}
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="plant_add__footer">
                        <button
                            type="button"
                            className="plant_add__button plant_add__button--cancel"
                            onClick={handleCancel}
                        >
                            {content.buttons.cancel}
                        </button>
                        <button
                            type="submit"
                            className="plant_add__button plant_add__button--primary"
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? (
                                <div className="plant_add__loading">
                                    <div className="plant_add__spinner"></div>
                                    {content.buttons.adding}
                                </div>
                            ) : (
                                content.buttons.add
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PlantsAdd