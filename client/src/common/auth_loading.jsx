import React from 'react'

const AuthLoading = () => {
    return (
        <div className="auth-loading">
            <div className="auth-loading__container">
                <div className="auth-loading__spinner"></div>
                <p className="auth-loading__text">Verificando sesión...</p>
            </div>
        </div>
    )
}

export default AuthLoading