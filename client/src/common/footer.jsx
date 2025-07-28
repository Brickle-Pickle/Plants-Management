import { useAppContext } from '../context/app_context.jsx'
import { 
    FaLeaf, 
    FaGithub, 
    FaGlobe,
    FaHeart
} from 'react-icons/fa'
import footerContent from './content/footer.json'
import './styles/footer.css'

const Footer = () => {
    const { navigate, location } = useAppContext()

    const handleNavigation = (path) => {
        navigate(path)
    }

    const handleExternalLink = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    const isActivePath = (path) => {
        return location.pathname === path
    }

    // Icon mapping for dynamic icon rendering
    const iconMap = {
        FaGithub: FaGithub,
        FaGlobe: FaGlobe
    }

    return (
        <footer className="footer">
            <div className="footer__container">
                {/* Brand Section */}
                <div className="footer__section footer__brand">
                    <div className="footer__brand-content">
                        <div className="footer__logo">
                            <FaLeaf className="footer__logo-icon" />
                            <span className="footer__logo-text">
                                {footerContent.brand.title}
                            </span>
                        </div>
                        <p className="footer__description">
                            {footerContent.brand.description}
                        </p>
                    </div>
                </div>

                {/* Navigation Section */}
                <div className="footer__section footer__navigation">
                    <h3 className="footer__section-title">
                        {footerContent.navigation.title}
                    </h3>
                    <ul className="footer__links">
                        {footerContent.navigation.links.map((link) => (
                            <li key={link.path} className="footer__link-item">
                                <button
                                    onClick={() => handleNavigation(link.path)}
                                    className={`footer__link ${
                                        isActivePath(link.path) ? 'footer__link--active' : ''
                                    }`}
                                    aria-label={`Ir a ${link.label}`}
                                >
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Developer Section */}
                <div className="footer__section footer__developer">
                    <h3 className="footer__section-title">
                        {footerContent.developer.title}
                    </h3>
                    <p className="footer__developer-name">
                        {footerContent.developer.name}
                    </p>
                    <div className="footer__social-links">
                        {footerContent.developer.links.map((link) => {
                            const IconComponent = iconMap[link.icon]
                            return (
                                <button
                                    key={link.url}
                                    onClick={() => handleExternalLink(link.url)}
                                    className="footer__social-link"
                                    aria-label={`Visitar ${link.label}`}
                                    title={link.label}
                                >
                                    <IconComponent className="footer__social-icon" />
                                    <span className="footer__social-text">
                                        {link.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="footer__bottom">
                <div className="footer__bottom-container">
                    <p className="footer__copyright">
                        {footerContent.legal.copyright}
                    </p>
                    <p className="footer__made-with">
                        {footerContent.legal.madeWith}{' '}
                        <FaHeart className="footer__heart-icon" />{' '}
                        {footerContent.legal.by}{' '}
                        <span className="footer__author">
                            {footerContent.developer.name}
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer