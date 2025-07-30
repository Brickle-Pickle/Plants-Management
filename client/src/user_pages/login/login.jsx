import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/app_context.jsx'
import { FaLeaf, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa'
import loginContent from './login.json'
import './login.css'

const Login = () => {
    const { login, navigate, isAuthenticated } = useAppContext()
    
    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    
    // UI state
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [currentQuote, setCurrentQuote] = useState('')

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate])

    // Generate random plant quote on component mount
    useEffect(() => {
        const getRandomQuote = () => {
            const quotes = loginContent.plantQuotes
            const randomIndex = Math.floor(Math.random() * quotes.length)
            return quotes[randomIndex]
        }
        
        setCurrentQuote(getRandomQuote())
        
        // Change quote every 8 seconds
        const interval = setInterval(() => {
            setCurrentQuote(getRandomQuote())
        }, 8000)
        
        return () => clearInterval(interval)
    }, [])

    // Form validation
    const validateForm = () => {
        const newErrors = {}
        
        // Email validation
        if (!formData.email) {
            newErrors.email = loginContent.form.validation.emailRequired
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = loginContent.form.validation.emailInvalid
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = loginContent.form.validation.passwordRequired
        } else if (formData.password.length < 6) {
            newErrors.password = loginContent.form.validation.passwordMinLength
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setIsLoading(true)
        
        try {
            await login(formData)
            // Success handled by context and redirect
        } catch (error) {
            setErrors({ general: loginContent.messages.error })
        } finally {
            setIsLoading(false)
        }
    }

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    // Navigation handlers
    const handleBackToHome = () => {
        navigate('/')
    }

    const handleGoToRegister = () => {
        navigate('/register')
    }

    return (
        <div className="login">
            <div className="login__container">
                {/* Back to home button */}
                <button 
                    className="login__back-btn"
                    onClick={handleBackToHome}
                    aria-label={loginContent.navigation.backToHome}
                >
                    <FaArrowLeft className="login__back-icon" />
                    <span>{loginContent.navigation.backToHome}</span>
                </button>

                {/* Main content */}
                <div className="login__content">
                    {/* Left side - Form */}
                    <div className="login__form-section">
                        <div className="login__header">
                            <div className="login__brand">
                                <FaLeaf className="login__brand-icon" />
                                <span className="login__brand-text">Plants Management</span>
                            </div>
                            
                            <h1 className="login__title">
                                {loginContent.pageInfo.title}
                            </h1>
                            <h2 className="login__subtitle">
                                {loginContent.pageInfo.subtitle}
                            </h2>
                            <p className="login__description">
                                {loginContent.pageInfo.description}
                            </p>
                        </div>

                        <form className="login__form" onSubmit={handleSubmit}>
                            {/* General error message */}
                            {errors.general && (
                                <div className="login__error-general">
                                    {errors.general}
                                </div>
                            )}

                            {/* Email field */}
                            <div className="login__field">
                                <label className="login__label" htmlFor="email">
                                    {loginContent.form.fields.email.label}
                                </label>
                                <div className="login__input-wrapper">
                                    <FaEnvelope className="login__input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`login__input ${errors.email ? 'login__input--error' : ''}`}
                                        placeholder={loginContent.form.fields.email.placeholder}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <span className="login__error">{errors.email}</span>
                                )}
                            </div>

                            {/* Password field */}
                            <div className="login__field">
                                <label className="login__label" htmlFor="password">
                                    {loginContent.form.fields.password.label}
                                </label>
                                <div className="login__input-wrapper">
                                    <FaLock className="login__input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        className={`login__input ${errors.password ? 'login__input--error' : ''}`}
                                        placeholder={loginContent.form.fields.password.placeholder}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="login__password-toggle"
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="login__error">{errors.password}</span>
                                )}
                            </div>

                            {/* Forgot password link */}
                            <button
                                type="button"
                                className="login__forgot-password"
                                onClick={() => {/* #backend - will implement forgot password */}}
                            >
                                {loginContent.form.buttons.forgotPassword}
                            </button>

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="login__submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="login__loading-spinner"></div>
                                        <span>{loginContent.messages.loading}</span>
                                    </>
                                ) : (
                                    <>
                                        <FaLeaf className="login__submit-icon" />
                                        <span>{loginContent.form.buttons.submit}</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Register link */}
                        <div className="login__register-link">
                            <span>{loginContent.navigation.noAccount}</span>
                            <button
                                className="login__register-btn"
                                onClick={handleGoToRegister}
                            >
                                {loginContent.navigation.registerLink}
                            </button>
                        </div>
                    </div>

                    {/* Right side - Decorative */}
                    <div className="login__decorative-section">
                        <div className="login__quote-container">
                            <FaLeaf className="login__quote-icon" />
                            <p className="login__quote-text">
                                "{currentQuote}"
                            </p>
                        </div>
                        
                        {/* Floating decorative elements */}
                        <div className="login__decoration">
                            <FaLeaf className="login__decoration-leaf login__decoration-leaf--1" />
                            <FaLeaf className="login__decoration-leaf login__decoration-leaf--2" />
                            <FaLeaf className="login__decoration-leaf login__decoration-leaf--3" />
                            <FaLeaf className="login__decoration-leaf login__decoration-leaf--4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login