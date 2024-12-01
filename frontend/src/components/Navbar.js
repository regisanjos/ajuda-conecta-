// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

function Navbar() {
    return (
        <header>
            <div className={styles.headerContainer}>
                <div className={styles.headerLogo}></div>
                <img className={styles.imgLogo} src="/img/Group.png" alt="Logo" />
                <nav>
                    <ul>
                        <li><Link to="/como-doar">COMO DOAR</Link></li>
                        <li><Link to="/sobre-nos">SOBRE NÓS</Link></li>
                        <li><Link to="/contate">CONTATE</Link></li>
                        <button className={styles.loginButton} onClick={() => window.location.href = "/login"}>ENTRAR</button>
                    </ul>
                </nav>
            </div>
            <div className={styles.line}></div>
        </header>
    );
}

export default Navbar;
