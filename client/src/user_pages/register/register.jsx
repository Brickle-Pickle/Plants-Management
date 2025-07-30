import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/app_context.jsx'
import { FaLeaf, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft, FaCheck, FaUserPlus } from 'react-icons/fa'
import registerContent from './register.json'
import './register.css'

const Register = () => {
    const { register, navigate, isAuthenticated } = useAppContext()
    
    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })
    
    // UI state
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [currentQuote, setCurrentQuote] = useState('')
    const [currentBenefit, setCurrentBenefit] = useState(0)

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, navigate])

    // Generate random plant quote on component mount
    useEffect(() => {
        const getRandomQuote = () => {
            const quotes = registerContent.plantQuotes
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

    // Cycle through benefits
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBenefit(prev => (prev + 1) % registerContent.benefits.length)
        }, 3000)
        
        return () => clearInterval(interval)
    }, [])

    // Password strength validation
    const validatePasswordStrength = (password) => {
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumbers = /\d/.test(password)
        const hasMinLength = password.length >= 8
        
        return hasUpperCase && hasLowerCase && hasNumbers && hasMinLength
    }

    // Form validation
    const validateForm = () => {
        const newErrors = {}
        
        // Email validation
        if (!formData.email) {
            newErrors.email = registerContent.form.validation.emailRequired
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = registerContent.form.validation.emailInvalid
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = registerContent.form.validation.passwordRequired
        } else if (formData.password.length < 8) {
            newErrors.password = registerContent.form.validation.passwordMinLength
        } else if (!validatePasswordStrength(formData.password)) {
            newErrors.password = registerContent.form.validation.passwordWeak
        }
        
        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = registerContent.form.validation.confirmPasswordRequired
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = registerContent.form.validation.passwordsNotMatch
        }
        
        // Terms validation
        if (!acceptTerms) {
            newErrors.terms = registerContent.form.validation.termsRequired
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
            await register(formData)
            // Success handled by context and redirect
        } catch (error) {
            // #backend - will handle API errors
            setErrors({ general: registerContent.messages.error })
        } finally {
            setIsLoading(false)
        }
    }

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    // Navigation handlers
    const handleBackToHome = () => {
        navigate('/')
    }

    const handleGoToLogin = () => {
        navigate('/login')
    }

    return (
        <div className="register">
            <div className="register__container">
                {/* Back to home button */}
                <button 
                    className="register__back-btn"
                    onClick={handleBackToHome}
                    aria-label={registerContent.navigation.backToHome}
                >
                    <FaArrowLeft className="register__back-icon" />
                    <span>{registerContent.navigation.backToHome}</span>
                </button>

                {/* Main content */}
                <div className="register__content">
                    {/* Left side - Form */}
                    <div className="register__form-section">
                        <div className="register__header">
                            <div className="register__brand">
                                <FaLeaf className="register__brand-icon" />
                                <span className="register__brand-text">Plants Management</span>
                            </div>
                            
                            <h1 className="register__title">
                                {registerContent.pageInfo.title}
                            </h1>
                            <h2 className="register__subtitle">
                                {registerContent.pageInfo.subtitle}
                            </h2>
                            <p className="register__description">
                                {registerContent.pageInfo.description}
                            </p>
                        </div>

                        <form className="register__form" onSubmit={handleSubmit}>
                            {/* General error message */}
                            {errors.general && (
                                <div className="register__error-general">
                                    {errors.general}
                                </div>
                            )}

                            {/* Email field */}
                            <div className="register__field">
                                <label className="register__label" htmlFor="email">
                                    {registerContent.form.fields.email.label}
                                </label>
                                <div className="register__input-wrapper">
                                    <FaEnvelope className="register__input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`register__input ${errors.email ? 'register__input--error' : ''}`}
                                        placeholder={registerContent.form.fields.email.placeholder}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && (
                                    <span className="register__error">{errors.email}</span>
                                )}
                            </div>

                            {/* Password field */}
                            <div className="register__field">
                                <label className="register__label" htmlFor="password">
                                    {registerContent.form.fields.password.label}
                                </label>
                                <div className="register__input-wrapper">
                                    <FaLock className="register__input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        className={`register__input ${errors.password ? 'register__input--error' : ''}`}
                                        placeholder={registerContent.form.fields.password.placeholder}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="register__password-toggle"
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="register__error">{errors.password}</span>
                                )}
                            </div>

                            {/* Confirm Password field */}
                            <div className="register__field">
                                <label className="register__label" htmlFor="confirmPassword">
                                    {registerContent.form.fields.confirmPassword.label}
                                </label>
                                <div className="register__input-wrapper">
                                    <FaLock className="register__input-icon" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className={`register__input ${errors.confirmPassword ? 'register__input--error' : ''}`}
                                        placeholder={registerContent.form.fields.confirmPassword.placeholder}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="register__password-toggle"
                                        onClick={toggleConfirmPasswordVisibility}
                                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <span className="register__error">{errors.confirmPassword}</span>
                                )}
                            </div>

                            {/* Terms and conditions */}
                            <div className="register__field register__field--checkbox">
                                <label className="register__checkbox-label">
                                    <input
                                        type="checkbox"
                                        className="register__checkbox"
                                        checked={acceptTerms}
                                        onChange={(e) => setAcceptTerms(e.target.checked)}
                                        disabled={isLoading}
                                    />
                                    <span className="register__checkbox-custom">
                                        {acceptTerms && <FaCheck className="register__checkbox-icon" />}
                                    </span>
                                    <span className="register__checkbox-text">
                                        {registerContent.form.buttons.termsAndConditions}
                                    </span>
                                </label>
                                {errors.terms && (
                                    <span className="register__error">{errors.terms}</span>
                                )}
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                className="register__submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="register__loading-spinner"></div>
                                        <span>{registerContent.messages.loading}</span>
                                    </>
                                ) : (
                                    <>
                                        <FaUserPlus className="register__submit-icon" />
                                        <span>{registerContent.form.buttons.submit}</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login link */}
                        <div className="register__login-link">
                            <span>{registerContent.navigation.hasAccount}</span>
                            <button
                                className="register__login-btn"
                                onClick={handleGoToLogin}
                            >
                                {registerContent.navigation.loginLink}
                            </button>
                        </div>
                    </div>

                    {/* Right side - Decorative */}
                    <div className="register__decorative-section">
                        <div className="register__quote-container">
                            <FaLeaf className="register__quote-icon" />
                            <p className="register__quote-text">
                                "{currentQuote}"
                            </p>
                        </div>
                        
                        {/* Benefits section */}
                        <div className="register__benefits">
                            <h3 className="register__benefits-title">¿Por qué unirte?</h3>
                            <div className="register__benefits-list">
                                {registerContent.benefits.map((benefit, index) => (
                                    <div 
                                        key={index}
                                        className={`register__benefit ${index === currentBenefit ? 'register__benefit--active' : ''}`}
                                    >
                                        <FaCheck className="register__benefit-icon" />
                                        <span>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Floating decorative elements */}
                        <div className="register__decoration">
                            <FaLeaf className="register__decoration-leaf register__decoration-leaf--1" />
                            <FaLeaf className="register__decoration-leaf register__decoration-leaf--2" />
                            <FaLeaf className="register__decoration-leaf register__decoration-leaf--3" />
                            <FaLeaf className="register__decoration-leaf register__decoration-leaf--4" />
                            <FaLeaf className="register__decoration-leaf register__decoration-leaf--5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register