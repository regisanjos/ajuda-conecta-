import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Home.module.css';

function Home() {
    const navigate = useNavigate();

    const handleHowDonateClick = () => {
        navigate('/como-doar');
    };

    const handleHowCollectClick = () => {
        navigate('/como-coletar');
    };

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div className={styles.bodyColor}>
            <main>
                <div className={styles.logo} onClick={handleLogoClick}>
                    <div className={styles.circle}></div>
                    <img className={styles.imgHome} src='/img/Home Page PHOTO.svg' alt="Home" />
                    <div className={styles.colorBody}></div>
                </div>
                <h1 className={styles.h1Home}>AJUDACONECTA</h1>
                <p className={styles.subtitle}>Seu site que conecta doações</p>
                <p className={styles.p1}>
                    Seu gesto pode fazer a diferença na reconstrução de vidas e na 
                    recuperação de áreas devastadas, promovendo a união em tempos de crise.
                </p>
                <button
                    id="howDonate"
                    className={styles.donationButton}
                    onClick={handleHowDonateClick}
                >
                    Veja como Doar
                </button>
                <button
                    id="howCollect"
                    className={styles.donationButton}
                    onClick={handleHowCollectClick}
                >
                    Veja como Coletar
                </button>
            </main>
        </div>
    );
}

export default Home;
