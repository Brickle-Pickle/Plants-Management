import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/app_context.jsx'
import { FaLeaf, FaCalendarAlt, FaCamera, FaBell, FaHeart } from 'react-icons/fa'
import heroContent from './content/hero.json'
import bearImage from '../../assets/bear.png'
import './styles/hero.css'

const Hero = () => {
    const { navigate, user, isAuthenticated, getUserName } = useAppContext()
    const [currentQuote, setCurrentQuote] = useState('')

    // Generate random plant quote on component mount
    useEffect(() => {
        const getRandomQuote = () => {
            const quotes = heroContent.plantQuotes
            const randomIndex = Math.floor(Math.random() * quotes.length)
            return quotes[randomIndex]
        }
        
        setCurrentQuote(getRandomQuote())
        
        // Change quote every 10 seconds
        const interval = setInterval(() => {
            setCurrentQuote(getRandomQuote())
        }, 10000)
        
        return () => clearInterval(interval)
    }, [])

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/plants')
        } else {
            navigate('/register')
        }
    }

    const handleViewPlants = () => {
        // #backend - will fetch user's plants from API
        navigate('/plants')
    }

    return (
        <section className="dashboard_hero">
            <div className="dashboard_hero__container">
                {/* Content Section */}
                <div className="dashboard_hero__content">
                    <div className="dashboard_hero__quote">
                        <FaLeaf className="dashboard_hero__quote-icon" />
                        <p className="dashboard_hero__quote-text">
                            "{currentQuote}"
                        </p>
                    </div>

                    <div className="dashboard_hero__main">
                        <h1 className="dashboard_hero__title">
                            {heroContent.appInfo.title}
                        </h1>
                        <h2 className="dashboard_hero__subtitle">
                            {heroContent.appInfo.subtitle}
                        </h2>
                        <p className="dashboard_hero__description">
                            {heroContent.appInfo.description}
                        </p>

                        <div className="dashboard_hero__features">
                            {heroContent.appInfo.features.map((feature, index) => {
                                const icons = [FaBell, FaCalendarAlt, FaCamera, FaCalendarAlt, FaHeart]
                                const IconComponent = icons[index] || FaLeaf
                                
                                return (
                                    <div key={index} className="dashboard_hero__feature">
                                        <IconComponent className="dashboard_hero__feature-icon" />
                                        <span className="dashboard_hero__feature-text">
                                            {feature}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="dashboard_hero__actions">
                            <button
                                onClick={handleGetStarted}
                                className="dashboard_hero__btn dashboard_hero__btn--primary"
                                aria-label={heroContent.cta.primary}
                            >
                                <FaLeaf className="dashboard_hero__btn-icon" />
                                <span>{heroContent.cta.primary}</span>
                            </button>
                            
                            {isAuthenticated && (
                                <button
                                    onClick={handleViewPlants}
                                    className="dashboard_hero__btn dashboard_hero__btn--secondary"
                                    aria-label={heroContent.cta.secondary}
                                >
                                    <span>{heroContent.cta.secondary}</span>
                                </button>
                            )}
                        </div>

                        {isAuthenticated && user && (
                            <div className="dashboard_hero__welcome">
                                <p className="dashboard_hero__welcome-text">
                                    ¡Bienvenido de vuelta, <span className="dashboard_hero__username">{getUserName()}</span>!
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Image Section */}
                <div className="dashboard_hero__image">
                    <div className="dashboard_hero__image-container">
                        <img
                            src={bearImage}
                            alt="Mascota de Plants Management"
                            className="dashboard_hero__image-bear"
                        />
                        <div className="dashboard_hero__image-decoration">
                            <FaLeaf className="dashboard_hero__decoration-leaf dashboard_hero__decoration-leaf--1" />
                            <FaLeaf className="dashboard_hero__decoration-leaf dashboard_hero__decoration-leaf--2" />
                            <FaLeaf className="dashboard_hero__decoration-leaf dashboard_hero__decoration-leaf--3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero