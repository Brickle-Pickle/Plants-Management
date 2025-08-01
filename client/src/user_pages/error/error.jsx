import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/app_context.jsx'
import { FaLeaf, FaHome, FaArrowLeft, FaSeedling, FaBell, FaTachometerAlt } from 'react-icons/fa'
import errorContent from './error.json'
import './error.css'

const Error404 = () => {
    const { navigate } = useAppContext()
    
    // State for dynamic quote
    const [currentQuote, setCurrentQuote] = useState('')
    
    // Generate random plant quote on component mount
    useEffect(() => {
        const getRandomQuote = () => {
            const quotes = errorContent.plantQuotes
            const randomIndex = Math.floor(Math.random() * quotes.length)
            return quotes[randomIndex]
        }
        
        setCurrentQuote(getRandomQuote())
        
        // Change quote every 6 seconds
        const interval = setInterval(() => {
            setCurrentQuote(getRandomQuote())
        }, 6000)
        
        return () => clearInterval(interval)
    }, [])

    // Navigation handlers
    const handleBackToHome = () => {
        navigate('/')
    }

    const handleGoBack = () => {
        window.history.back()
    }

    const handleSuggestionClick = (route) => {
        navigate(route)
    }

    // Render floating leaves
    const renderFloatingLeaves = () => {
        const leafCount = errorContent.animation.leafCount
        const leaves = []
        
        for (let i = 0; i < leafCount; i++) {
            leaves.push(
                <FaLeaf 
                    key={i} 
                    className="error_404__leaf"
                    style={{
                        '--floating-duration': errorContent.animation.floatingDuration
                    }}
                />
            )
        }
        
        return leaves
    }

    // Get icon for suggestion
    const getSuggestionIcon = (route) => {
        switch (route) {
            case '/':
                return <FaTachometerAlt />
            case '/plants':
                return <FaSeedling />
            case '/reminders':
                return <FaBell />
            default:
                return <FaLeaf />
        }
    }

    return (
        <div className="error_404">
            {/* Floating leaves background animation */}
            <div className="error_404__floating-leaves">
                {renderFloatingLeaves()}
            </div>

            <div className="error_404__container">
                <div className="error_404__content">
                    {/* Main icon */}
                    <div className="error_404__icon-container">
                        <FaLeaf className="error_404__main-icon" />
                    </div>

                    {/* Title and description */}
                    <h1 className="error_404__title">
                        {errorContent.pageInfo.title}
                    </h1>
                    
                    <h2 className="error_404__subtitle">
                        {errorContent.pageInfo.subtitle}
                    </h2>
                    
                    <p className="error_404__description">
                        {errorContent.pageInfo.description}
                    </p>
                    
                    <p className="error_404__message">
                        {errorContent.pageInfo.message}
                    </p>

                    {/* Dynamic quote */}
                    <div className="error_404__quote">
                        "{currentQuote}"
                    </div>

                    {/* Action buttons */}
                    <div className="error_404__actions">
                        <button 
                            className="error_404__btn error_404__btn--primary"
                            onClick={handleBackToHome}
                            aria-label={errorContent.navigation.backToHome}
                        >
                            <FaHome />
                            <span>{errorContent.navigation.backToHome}</span>
                        </button>
                        
                        <button 
                            className="error_404__btn error_404__btn--secondary"
                            onClick={handleGoBack}
                            aria-label={errorContent.navigation.backToPrevious}
                        >
                            <FaArrowLeft />
                            <span>{errorContent.navigation.backToPrevious}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Error404