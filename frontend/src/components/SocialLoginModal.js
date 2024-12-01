// SocialLoginModal.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import styles from '../styles/SocialLoginModal.module.css';

function SocialLoginModal({ provider, onClose, onLogin }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Login com {provider}</h2>
                <p>Confirme para fazer login com sua conta {provider}.</p>
                <button
                    className={`${styles.socialButton} ${provider === 'Google' ? styles.google : styles.facebook}`}
                    onClick={() => onLogin(provider)}
                >
                    <FontAwesomeIcon icon={provider === 'Google' ? faGoogle : faFacebook} />
                    Entrar com {provider}
                </button>
                <button className={styles.cancelButton} onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default SocialLoginModal;
