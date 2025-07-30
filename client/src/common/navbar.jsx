import { useState, useEffect } from 'react'
import { useAppContext } from '../context/app_context.jsx'
import { 
    FaLeaf, 
    FaBell, 
    FaUser, 
    FaBars, 
    FaTimes,
    FaSignInAlt,
    FaUserPlus,
    FaSignOutAlt
} from 'react-icons/fa'
import navbarContent from './content/navbar.json'
import './styles/navbar.css'

const Navbar = () => {
    const { 
        navigate, 
        location, 
        isAuthenticated, 
        user, 
        logout,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        getUserName
    } = useAppContext()
    
    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location.pathname, setIsMobileMenuOpen])

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('.navbar')) {
                setIsMobileMenuOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [isMobileMenuOpen, setIsMobileMenuOpen])

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isMobileMenuOpen, setIsMobileMenuOpen])

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const handleNavigation = (path) => {
        navigate(path)
    }

    const handleLogout = () => {
        logout()
    }

    const isActivePath = (path) => {
        return location.pathname === path
    }

    const navigationItems = [
        {
            path: '/plants',
            label: navbarContent.navigation.plants,
            icon: FaLeaf
        },
        {
            path: '/reminders',
            label: navbarContent.navigation.reminders,
            icon: FaBell
        }
    ]

    return (
        <nav className="navbar">
            <div className="navbar__container">
                {/* Brand Section */}
                <button 
                    className="navbar__brand"
                    onClick={() => handleNavigation('/')}
                    aria-label="Ir al inicio"
                >
                    <img 
                        src="/logo.png" 
                        alt={navbarContent.brand.alt}
                        className="navbar__logo"
                    />
                    <span className="navbar__title">
                        {navbarContent.brand.title}
                    </span>
                </button>

                {/* Desktop Navigation */}
                <div className="navbar__nav">
                    <ul className="navbar__nav-links">
                        {navigationItems.map((item) => {
                            const IconComponent = item.icon
                            return (
                                <li key={item.path} className="navbar__nav-item">
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`navbar__nav-link ${
                                            isActivePath(item.path) ? 'navbar__nav-link--active' : ''
                                        }`}
                                        aria-label={item.label}
                                    >
                                        <IconComponent className="navbar__nav-icon" />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Auth Section */}
                    <div className="navbar__auth">
                        {isAuthenticated ? (
                            <>
                                <div className="navbar__user">
                                    <div className="navbar__user-avatar">
                                        <FaUser />
                                    </div>
                                    <span>{getUserName() || 'Usuario'}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="navbar__auth-btn navbar__auth-btn--logout"
                                    aria-label="Cerrar sesión"
                                >
                                    <FaSignOutAlt />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleNavigation('/login')}
                                    className="navbar__auth-btn navbar__auth-btn--login"
                                    aria-label={navbarContent.auth.login}
                                >
                                    <FaSignInAlt />
                                    <span>{navbarContent.auth.login}</span>
                                </button>
                                <button
                                    onClick={() => handleNavigation('/register')}
                                    className="navbar__auth-btn navbar__auth-btn--register"
                                    aria-label={navbarContent.auth.register}
                                >
                                    <FaUserPlus />
                                    <span>{navbarContent.auth.register}</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="navbar__mobile-toggle"
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? navbarContent.menu.close : navbarContent.menu.toggle}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`navbar__mobile-menu ${isMobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`}>
                <div className="navbar__mobile-content">
                    {/* Mobile Navigation Links */}
                    <ul className="navbar__mobile-links">
                        {navigationItems.map((item) => {
                            const IconComponent = item.icon
                            return (
                                <li key={item.path}>
                                    <button
                                        onClick={() => handleNavigation(item.path)}
                                        className={`navbar__mobile-link ${
                                            isActivePath(item.path) ? 'navbar__mobile-link--active' : ''
                                        }`}
                                        aria-label={item.label}
                                    >
                                        <IconComponent />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Mobile Auth Section */}
                    <div className="navbar__mobile-auth">
                        {isAuthenticated ? (
                            <>
                                <div className="navbar__user">
                                    <div className="navbar__user-avatar">
                                        <FaUser />
                                    </div>
                                    <span>{user?.name || 'Usuario'}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="navbar__auth-btn navbar__auth-btn--logout"
                                    aria-label="Cerrar sesión"
                                >
                                    <FaSignOutAlt />
                                    <span>Cerrar Sesión</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleNavigation('/login')}
                                    className="navbar__auth-btn navbar__auth-btn--login"
                                    aria-label={navbarContent.auth.login}
                                >
                                    <FaSignInAlt />
                                    <span>{navbarContent.auth.login}</span>
                                </button>
                                <button
                                    onClick={() => handleNavigation('/register')}
                                    className="navbar__auth-btn navbar__auth-btn--register"
                                    aria-label={navbarContent.auth.register}
                                >
                                    <FaUserPlus />
                                    <span>{navbarContent.auth.register}</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar