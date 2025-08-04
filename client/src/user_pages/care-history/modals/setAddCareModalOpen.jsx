import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AppContext from '../../../context/app_context.jsx'
import content from './setAddCareModalOpen.json'
import './setAddCareModalOpen.css'
// React Icons imports
import { 
    IoCloseOutline,
    IoLeafOutline,
    IoWaterOutline,
    IoNutritionOutline,
    IoCutOutline,
    IoFlowerOutline,
    IoCheckmarkCircleOutline,
    IoAlertCircleOutline
} from 'react-icons/io5'

const SetAddCareModalOpen = () => {
    const { id: plantId } = useParams()
    const {
        isAddCareModalOpen,
        setIsAddCareModalOpen,
        closeAllModals,
        addCareRecord,
        isLoading,
        plants
    } = useContext(AppContext) || {}

    // Form state
    const [formData, setFormData] = useState({
        careType: '',
        description: '',
        notes: '',
        frequency: 'none',
        completed: false
    })

    // Validation state
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Find current plant
    const currentPlant = plants?.find(plant => 
        plant._id?.toString() === plantId || plant.id?.toString() === plantId
    )

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isAddCareModalOpen) {
            setFormData({
                careType: '',
                description: '',
                notes: '',
                frequency: 'none',
                completed: false
            })
            setErrors({})
            setIsSubmitting(false)
        }
    }, [isAddCareModalOpen])

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }))
        }
    }

    // Validate form
    const validateForm = () => {
        const newErrors = {}

        // Care type validation
        if (!formData.careType) {
            newErrors.careType = content.validation.careTypeRequired
        }

        // Description validation
        if (!formData.description.trim()) {
            newErrors.description = content.validation.descriptionRequired
        } else if (formData.description.trim().length < 3) {
            newErrors.description = content.validation.descriptionMinLength
        } else if (formData.description.trim().length > 200) {
            newErrors.description = content.validation.descriptionMaxLength
        }

        // Notes validation (optional but with max length)
        if (formData.notes.trim().length > 500) {
            newErrors.notes = content.validation.notesMaxLength
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            // Prepare care record data
            const careRecordData = {
                plantId: plantId,
                careType: formData.careType,
                description: formData.description.trim(),
                notes: formData.notes.trim() || undefined,
                frequency: formData.frequency !== 'none' ? formData.frequency : undefined,
                completed: formData.completed,
                completedAt: formData.completed ? new Date() : undefined
            }

            await addCareRecord(careRecordData)
            
            // Close modal on success
            closeAllModals()
            
        } catch (error) {
            console.error('Error creating care record:', error)
            // Error handling is managed by the context
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle modal close
    const handleClose = () => {
        if (!isSubmitting) {
            closeAllModals()
        }
    }

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose()
        }
    }

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isAddCareModalOpen) {
                handleClose()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isAddCareModalOpen, isSubmitting])

    // Get care type info for display
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

    // Don't render if modal is not open
    if (!isAddCareModalOpen) {
        return null
    }

    return (
        <div className="add_care_modal" onClick={handleBackdropClick}>
            <div className="modal-content" role="dialog" aria-labelledby="modal-title" aria-modal="true">
                {/* Modal Header */}
                <div className="modal-header">
                    <h2 id="modal-title" className="modal-title">
                        <IoLeafOutline className="title-icon" />
                        {content.modal.title}
                    </h2>
                    <p className="modal-subtitle">
                        {content.modal.subtitle}
                        {currentPlant && ` para ${currentPlant.name}`}
                    </p>
                    <button 
                        className="close-button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        aria-label={content.modal.close}
                    >
                        <IoCloseOutline />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Care Type Selection */}
                    <div className="form-group">
                        <label className="form-label required">
                            {content.form.careType.label}
                        </label>
                        <div className="care-type-grid">
                            {Object.entries(content.careTypes).map(([type, label]) => {
                                const typeInfo = getCareTypeInfo(type)
                                return (
                                    <div
                                        key={type}
                                        className={`care-type-option ${formData.careType === type ? 'selected' : ''}`}
                                        onClick={() => handleInputChange('careType', type)}
                                    >
                                        <div className="care-type-icon">
                                            {typeInfo.icon}
                                        </div>
                                        <p className="care-type-name">{label}</p>
                                    </div>
                                )
                            })}
                        </div>
                        {errors.careType && (
                            <div className="form-error">
                                <IoAlertCircleOutline className="error-icon" />
                                {errors.careType}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label required">
                            {content.form.description.label}
                        </label>
                        <textarea
                            className="form-textarea"
                            placeholder={content.form.description.placeholder}
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            disabled={isSubmitting}
                            maxLength={200}
                        />
                        {errors.description && (
                            <div className="form-error">
                                <IoAlertCircleOutline className="error-icon" />
                                {errors.description}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="form-group">
                        <label className="form-label">
                            {content.form.notes.label}
                        </label>
                        <textarea
                            className="form-textarea"
                            placeholder={content.form.notes.placeholder}
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            disabled={isSubmitting}
                            maxLength={500}
                        />
                        {errors.notes && (
                            <div className="form-error">
                                <IoAlertCircleOutline className="error-icon" />
                                {errors.notes}
                            </div>
                        )}
                    </div>

                    {/* Frequency */}
                    <div className="form-group">
                        <label className="form-label">
                            {content.form.frequency.label}
                        </label>
                        <select
                            className="form-select"
                            value={formData.frequency}
                            onChange={(e) => handleInputChange('frequency', e.target.value)}
                            disabled={isSubmitting}
                        >
                            {Object.entries(content.form.frequency.options).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Completed Checkbox */}
                    <div className="form-group">
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="completed"
                                className="checkbox-input"
                                checked={formData.completed}
                                onChange={(e) => handleInputChange('completed', e.target.checked)}
                                disabled={isSubmitting}
                            />
                            <label htmlFor="completed" className="checkbox-label">
                                {content.form.completed.label}
                            </label>
                            <p className="checkbox-description">
                                {content.form.completed.description}
                            </p>
                        </div>
                    </div>
                </form>

                {/* Modal Footer */}
                <div className="modal-footer">
                    <button
                        type="button"
                        className="action-button btn-secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        {content.actions.cancel}
                    </button>
                    <button
                        type="submit"
                        className="action-button btn-primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.careType || !formData.description.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="loading-spinner" />
                                {content.actions.saving}
                            </>
                        ) : (
                            <>
                                <IoCheckmarkCircleOutline />
                                {content.actions.save}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SetAddCareModalOpen