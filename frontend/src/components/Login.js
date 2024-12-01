import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import SocialLoginModal from './SocialLoginModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, facebookProvider } from '../scripts/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import Signup from './Signup';

function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [modalProvider, setModalProvider] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSelect = (option) => {
        setIsSignUp(option === 'signup');
    };

    const handleLogin = async (provider) => {
        try {
            let result;
            if (provider === 'Google') {
                result = await signInWithPopup(auth, googleProvider);
            } else if (provider === 'Facebook') {
                result = await signInWithPopup(auth, facebookProvider);
            } else {
                // Email and password login
                result = await signInWithEmailAndPassword(auth, email, password);
            }
            alert(`Logado com ${provider}: ${result.user.displayName || result.user.email}`);
            navigate('/dashboard'); // Redireciona para o UserMenu após o login
        } catch (error) {
            alert(`Erro ao autenticar com ${provider}: ${error.message}`);
            setError('Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            {
                navigate('/dashboard'); // Redireciona para o UserMenu se não for admin
            }
        } catch (error) {
            setError('Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    // Função para redirecionar após cadastro
    const handleSignupSuccess = () => {
        setIsSignUp(false); // Exibe a tela de login
    };

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.logo}>
                    <div className={styles.circle}>
                        <img className={styles.imgLogoLogin} src='/img/GroupGreen.png'></img>
                    </div>
                    <span>AJUDA</span>
                    <span className={styles.subtext}>CONECTA</span>
                </div>
                <h1 className={styles.h1Login}>Olá, <br /> <strong>Bem-Vindo!</strong></h1>
                
                <button
                    className={`${styles.btn} ${!isSignUp ? styles.selected : ''}`}
                    onClick={() => handleSelect('login')}
                >
                    Log in
                </button>
                
                <a
                    href="#"
                    className={`${styles.signup} ${isSignUp ? styles.selected : ''}`}
                    onClick={() => handleSelect('signup')}
                >
                    Sign Up
                </a>
            </div>
            
            <div className={styles.right}>
                {!isSignUp ? (
                    <div className={styles.formContainer}>
                        <h2 className={styles.loginTitle}>Selecione o método de Login</h2>
                        <p className={styles.loginP}>Preencha os dados abaixo para entrar</p>
                        <form className={styles.loginForm} onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="E-mail"
                                required
                                className={styles.inputLoginEmail}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Senha"
                                required
                                className={styles.inputLoginPassword}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className={styles.options}>
                                <label><input type="checkbox" /> Lembrar-me</label>
                                <a href="#" className={styles.forgotPassword}>Esqueceu sua senha?</a>
                            </div>
                            {error && <p className={styles.error}>{error}</p>}
                            <button type="submit" className={styles.loginBtn}>LOGIN</button>
                        </form>
                        <div className={styles.divider}>
                            <hr className={styles.line} />
                            <span className={styles.or}>Ou</span>
                            <hr className={styles.line} />
                        </div>
                        <div className={styles.socialIcons}>
                            <FontAwesomeIcon
                                icon={faGoogle}
                                className={`${styles.icon} ${styles.googleIcon}`}
                                onClick={() => handleLogin('Google')}
                            />
                            <FontAwesomeIcon
                                icon={faFacebook}
                                className={`${styles.icon} ${styles.facebookIcon}`}
                                onClick={() => handleLogin('Facebook')}
                            />
                        </div>
                    </div>
                ) : (
                    <Signup onSignupSuccess={handleSignupSuccess} />
                )}
            </div>

            {modalProvider && (
                <SocialLoginModal
                    provider={modalProvider}
                    onClose={() => setModalProvider(null)}
                    onLogin={handleLogin}
                />
            )}
        </div>
    );
}

export default Login;
