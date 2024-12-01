import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/Home.module.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const allowedRoutes = ['/', '/como-doar', '/contate', '/como-coletar'];
    if (!allowedRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <header>
            <div className={styles.headerLogo}></div>
            <img className={styles.imgLogo} src="/img/Group.png" alt="Logo" />
            <nav>
                <ul>
                    <li><Link to="/como-doar">ESPAÇO DOE</Link></li>
                    <li><Link to="/como-coletar">ESPAÇO COLETA</Link></li>
                    <li><Link to="/contate">CONTATE</Link></li>
                </ul>
            </nav>
            <div className={styles.line}></div>
        </header>
    );
}

export default Header;
