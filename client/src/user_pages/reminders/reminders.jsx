import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/app_context'
import { 
    FaBell, 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    FaCheck, 
    FaTint, 
    FaSeedling, 
    FaCut, 
    FaExchangeAlt,
    FaClock,
    FaCalendarAlt,
    FaExclamationTriangle,
    FaRedo
} from 'react-icons/fa'
import './reminders.css'
import remindersText from './reminders.json'

const Reminders = () => {
    const {
        // Reminders state
        reminders,
        isLoadingReminders,
        remindersError,
        remindersFilter,
        setRemindersFilter,
        remindersSortBy,
        setRemindersSortBy,
        selectedReminder,
        
        // Plants state
        plants,
        fetchPlants,
        
        // Modal state
        isReminderAddModalOpen,
        isReminderEditModalOpen,
        isReminderDeleteModalOpen,
        
        // Functions
        fetchReminders,
        addReminder,
        updateReminder,
        deleteReminder,
        completeReminder,
        openReminderAddModal,
        openReminderEditModal,
        openReminderDeleteModal,
        closeAllModals,
        
        // Global state
        isLoading
    } = useAppContext()

    // Local state for forms
    const [formData, setFormData] = useState({
        plantId: '',
        careType: '',
        scheduledDate: '',
        isRecurring: false,
        frequency: ''
    })

    // Load data on component mount
    useEffect(() => {
        fetchReminders()
        fetchPlants()
    }, [])

    // Get care type icon
    const getCareTypeIcon = (careType) => {
        switch (careType) {
            case 'watering':
                return <FaTint />
            case 'fertilizing':
                return <FaSeedling />
            case 'pruning':
                return <FaCut />
            case 'repotting':
                return <FaExchangeAlt />
            default:
                return <FaBell />
        }
    }

    // Get plant name by ID
    const getPlantName = (plantId) => {
        const plant = plants.find(p => p.id === plantId)
        return plant ? plant.name : 'Planta no encontrada'
    }

    // Format date for display
    const formatDate = (date) => {
        const now = new Date()
        const targetDate = new Date(date)
        const diffTime = targetDate - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) {
            return remindersText.labels.today
        } else if (diffDays === 1) {
            return remindersText.labels.tomorrow
        } else if (diffDays === -1) {
            return remindersText.labels.yesterday
        } else if (diffDays > 0) {
            return `${remindersText.labels.in} ${diffDays} ${remindersText.labels.daysUntil}`
        } else {
            return `${Math.abs(diffDays)} ${remindersText.labels.daysUntil} ${remindersText.labels.daysAgo}`
        }
    }

    // Get reminder status based on date
    const getReminderStatus = (reminder) => {
        if (reminder.status === 'completed') return 'completed'
        
        const now = new Date()
        const scheduledDate = new Date(reminder.scheduledDate)
        
        if (scheduledDate < now) return 'overdue'
        return 'pending'
    }

    // Filter and sort reminders
    const getFilteredAndSortedReminders = () => {
        let filtered = reminders

        // Apply filter
        if (remindersFilter !== 'all') {
            filtered = filtered.filter(reminder => {
                const status = getReminderStatus(reminder)
                return status === remindersFilter
            })
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (remindersSortBy) {
                case 'date':
                    return new Date(a.scheduledDate) - new Date(b.scheduledDate)
                case 'type':
                    return a.careType.localeCompare(b.careType)
                case 'plant':
                    const plantA = getPlantName(a.plantId)
                    const plantB = getPlantName(b.plantId)
                    return plantA.localeCompare(plantB)
                default:
                    return 0
            }
        })

        return filtered
    }

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const reminderData = {
                ...formData,
                plantId: parseInt(formData.plantId),
                scheduledDate: new Date(formData.scheduledDate),
                frequency: formData.isRecurring ? parseInt(formData.frequency) : 0,
                userId: 'user1' // #backend - will get from auth context
            }

            if (isReminderEditModalOpen) {
                await updateReminder(selectedReminder._id, reminderData)
            } else {
                await addReminder(reminderData)
            }

            // Reset form and close modal
            setFormData({
                plantId: '',
                careType: '',
                scheduledDate: '',
                isRecurring: false,
                frequency: ''
            })
            closeAllModals()
        } catch (error) {
            console.error('Error saving reminder:', error)
        }
    }

    // Handle reminder completion
    const handleCompleteReminder = async (reminderId) => {
        try {
            await completeReminder(reminderId)
        } catch (error) {
            console.error('Error completing reminder:', error)
        }
    }

    // Handle reminder deletion
    const handleDeleteReminder = async () => {
        try {
            await deleteReminder(selectedReminder._id)
            closeAllModals()
        } catch (error) {
            console.error('Error deleting reminder:', error)
        }
    }

    // Open edit modal with reminder data
    const handleEditClick = (reminder) => {
        setFormData({
            plantId: reminder.plantId.toString(),
            careType: reminder.careType,
            scheduledDate: new Date(reminder.scheduledDate).toISOString().split('T')[0],
            isRecurring: reminder.isRecurring,
            frequency: reminder.frequency.toString()
        })
        openReminderEditModal(reminder)
    }

    // Open add modal with clean form
    const handleAddClick = () => {
        setFormData({
            plantId: '',
            careType: '',
            scheduledDate: '',
            isRecurring: false,
            frequency: ''
        })
        openReminderAddModal()
    }

    const filteredReminders = getFilteredAndSortedReminders()

    return (
        <div className="reminders">
            {/* Header */}
            <div className="reminders__header">
                <h1 className="reminders__title">{remindersText.title}</h1>
                <p className="reminders__subtitle">{remindersText.subtitle}</p>
            </div>

            {/* Controls */}
            <div className="reminders__controls">
                <div className="reminders__filters">
                    <div className="reminders__filter-group">
                        <label className="reminders__filter-label">Estado:</label>
                        <select
                            className="reminders__select"
                            value={remindersFilter}
                            onChange={(e) => setRemindersFilter(e.target.value)}
                        >
                            <option value="all">{remindersText.filters.all}</option>
                            <option value="pending">{remindersText.filters.pending}</option>
                            <option value="completed">{remindersText.filters.completed}</option>
                            <option value="overdue">{remindersText.filters.overdue}</option>
                        </select>
                    </div>

                    <div className="reminders__filter-group">
                        <label className="reminders__filter-label">Ordenar por:</label>
                        <select
                            className="reminders__select"
                            value={remindersSortBy}
                            onChange={(e) => setRemindersSortBy(e.target.value)}
                        >
                            <option value="date">{remindersText.sortOptions.date}</option>
                            <option value="type">{remindersText.sortOptions.type}</option>
                            <option value="plant">{remindersText.sortOptions.plant}</option>
                        </select>
                    </div>
                </div>

                <button
                    className="reminders__add-button"
                    onClick={handleAddClick}
                >
                    <FaPlus />
                    {remindersText.buttons.addReminder}
                </button>
            </div>

            {/* Content */}
            <div className="reminders__content">
                {isLoadingReminders ? (
                    <div className="reminders__loading">
                        <div className="reminders__loading-spinner"></div>
                        <p className="reminders__loading-text">{remindersText.messages.loadingReminders}</p>
                    </div>
                ) : remindersError ? (
                    <div className="reminders__error">
                        <FaExclamationTriangle className="reminders__error-icon" />
                        <p className="reminders__error-text">{remindersText.messages.errorLoadingReminders}</p>
                    </div>
                ) : filteredReminders.length === 0 ? (
                    <div className="reminders__empty">
                        <FaBell className="reminders__empty-icon" />
                        <h3 className="reminders__empty-title">
                            {remindersFilter === 'all' 
                                ? remindersText.messages.noReminders 
                                : remindersText.messages.noRemindersFiltered
                            }
                        </h3>
                        <p className="reminders__empty-description">
                            {remindersFilter === 'all' && remindersText.messages.noRemindersDescription}
                        </p>
                    </div>
                ) : (
                    <div className="reminders__list">
                        {filteredReminders.map((reminder) => {
                            const status = getReminderStatus(reminder)
                            return (
                                <div 
                                    key={reminder._id} 
                                    className={`reminders__card reminders__card--${status}`}
                                >
                                    <div className="reminders__card-header">
                                        <div className="reminders__card-icon">
                                            {getCareTypeIcon(reminder.careType)}
                                        </div>
                                        <div className="reminders__card-info">
                                            <h3 className="reminders__card-title">
                                                {remindersText.careTypes[reminder.careType]}
                                            </h3>
                                            <p className="reminders__card-plant">
                                                {getPlantName(reminder.plantId)}
                                            </p>
                                        </div>
                                        <div className="reminders__card-status">
                                            <span className={`reminders__status-badge reminders__status-badge--${status}`}>
                                                {remindersText.status[status]}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="reminders__card-body">
                                        <div className="reminders__card-date">
                                            <FaCalendarAlt className="reminders__date-icon" />
                                            <span className="reminders__date-text">
                                                {formatDate(reminder.scheduledDate)}
                                            </span>
                                        </div>

                                        {reminder.isRecurring && (
                                            <div className="reminders__card-recurring">
                                                <FaRedo className="reminders__recurring-icon" />
                                                <span className="reminders__recurring-text">
                                                    Cada {reminder.frequency} días
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="reminders__card-actions">
                                        {status === 'pending' && (
                                            <button
                                                className="reminders__action-button reminders__action-button--complete"
                                                onClick={() => handleCompleteReminder(reminder._id)}
                                                title={remindersText.buttons.complete}
                                            >
                                                <FaCheck />
                                            </button>
                                        )}
                                        
                                        <button
                                            className="reminders__action-button reminders__action-button--edit"
                                            onClick={() => handleEditClick(reminder)}
                                            title={remindersText.buttons.edit}
                                        >
                                            <FaEdit />
                                        </button>
                                        
                                        <button
                                            className="reminders__action-button reminders__action-button--delete"
                                            onClick={() => openReminderDeleteModal(reminder)}
                                            title={remindersText.buttons.delete}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {(isReminderAddModalOpen || isReminderEditModalOpen) && (
                <div className="reminders__modal-overlay" onClick={closeAllModals}>
                    <div className="reminders__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="reminders__modal-header">
                            <h2 className="reminders__modal-title">
                                {isReminderEditModalOpen 
                                    ? remindersText.modals.edit.title 
                                    : remindersText.modals.add.title
                                }
                            </h2>
                            <p className="reminders__modal-description">
                                {isReminderEditModalOpen 
                                    ? remindersText.modals.edit.description 
                                    : remindersText.modals.add.description
                                }
                            </p>
                        </div>

                        <form className="reminders__form" onSubmit={handleSubmit}>
                            <div className="reminders__form-group">
                                <label className="reminders__form-label">
                                    {remindersText.labels.plant}
                                </label>
                                <select
                                    className="reminders__form-select"
                                    name="plantId"
                                    value={formData.plantId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">{remindersText.placeholders.selectPlant}</option>
                                    {plants.map(plant => (
                                        <option key={plant.id} value={plant.id}>
                                            {plant.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="reminders__form-group">
                                <label className="reminders__form-label">
                                    {remindersText.labels.careType}
                                </label>
                                <select
                                    className="reminders__form-select"
                                    name="careType"
                                    value={formData.careType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">{remindersText.placeholders.selectCareType}</option>
                                    <option value="watering">{remindersText.careTypes.watering}</option>
                                    <option value="fertilizing">{remindersText.careTypes.fertilizing}</option>
                                    <option value="pruning">{remindersText.careTypes.pruning}</option>
                                    <option value="repotting">{remindersText.careTypes.repotting}</option>
                                </select>
                            </div>

                            <div className="reminders__form-group">
                                <label className="reminders__form-label">
                                    {remindersText.labels.scheduledDate}
                                </label>
                                <input
                                    type="date"
                                    className="reminders__form-input"
                                    name="scheduledDate"
                                    value={formData.scheduledDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="reminders__form-group">
                                <label className="reminders__form-checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="reminders__form-checkbox"
                                        name="isRecurring"
                                        checked={formData.isRecurring}
                                        onChange={handleInputChange}
                                    />
                                    <span className="reminders__form-checkbox-text">
                                        {remindersText.labels.isRecurring}
                                    </span>
                                </label>
                            </div>

                            {formData.isRecurring && (
                                <div className="reminders__form-group">
                                    <label className="reminders__form-label">
                                        {remindersText.labels.frequency}
                                    </label>
                                    <input
                                        type="number"
                                        className="reminders__form-input"
                                        name="frequency"
                                        value={formData.frequency}
                                        onChange={handleInputChange}
                                        placeholder={remindersText.placeholders.enterFrequency}
                                        min="1"
                                        required={formData.isRecurring}
                                    />
                                </div>
                            )}

                            <div className="reminders__form-actions">
                                <button
                                    type="button"
                                    className="reminders__form-button reminders__form-button--cancel"
                                    onClick={closeAllModals}
                                >
                                    {remindersText.buttons.cancel}
                                </button>
                                <button
                                    type="submit"
                                    className="reminders__form-button reminders__form-button--save"
                                >
                                    {remindersText.buttons.save}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isReminderDeleteModalOpen && (
                <div className="reminders__modal-overlay" onClick={closeAllModals}>
                    <div className="reminders__modal reminders__modal--delete" onClick={(e) => e.stopPropagation()}>
                        <div className="reminders__modal-header">
                            <h2 className="reminders__modal-title">
                                {remindersText.modals.delete.title}
                            </h2>
                            <p className="reminders__modal-description">
                                {remindersText.modals.delete.description}
                            </p>
                            <p className="reminders__modal-warning">
                                {remindersText.modals.delete.warning}
                            </p>
                        </div>

                        <div className="reminders__form-actions">
                            <button
                                type="button"
                                className="reminders__form-button reminders__form-button--cancel"
                                onClick={closeAllModals}
                            >
                                {remindersText.buttons.cancel}
                            </button>
                            <button
                                type="button"
                                className="reminders__form-button reminders__form-button--delete"
                                onClick={handleDeleteReminder}
                            >
                                {remindersText.buttons.confirm}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Reminders