

import React from 'react';
import { Link } from 'react-router-dom';
import styles from "../styles/ComoColetar.module.css";

function ComoColetar() {
    return (
        <div className={styles.imgColetaFundo}>
            <div className={styles.colorColetaFundo}></div>
            <div className={styles.textColeta}>
                <h1 className={styles.coletaTitle}>O modo prático de ajudar</h1>
                <p className={styles.coletaP}>
                    Garanta a segurança e a eficiência das doações com pontos de coleta confiáveis e acompanhamento transparente para os usuários.
                </p>
                {/* Estilizando o Link diretamente */}
                <Link to="/login" className={styles.coletaButton}>Entrar</Link>
            </div>
            <div className={styles.containersColeta}>
                <div className={styles.containerColeta}>    
                    <img className={styles.imgContainerColeta} src="/img/Performance Macbook.png" alt="Dashboards" />
                    <h2 className={styles.dashboardColetaTitle}>Dashboards</h2>
                    <p className={styles.dashboardColetaP}>
                        Com dados em tempo real, você pode monitorar o status dos pontos de coleta, acompanhar a entrega de suprimentos e acessar gráficos detalhados sobre o que foi arrecadado e distribuído.
                    </p>
                    <Link to="/dashboard" className={styles.dashboardButton}>Veja seu Dashboard</Link>
                </div>
                <div className={styles.containerColeta}>
                    <img className={styles.imgContainerColeta} src="/img/Adjust.png" alt="Entidades" />
                    <h2 className={styles.dashboardColetaTitle}>Entidades</h2>
                    <p className={styles.dashboardColetaP}>
                        O sistema inclui funcionalidades completas de CRUD (Criar, Listar, Atualizar e Deletar) para gerenciar as principais entidades de doações, entregas e pontos de coleta.
                    </p>
                    <Link to="/dashboard" className={styles.dashboardButton}>Veja suas Entidades</Link>
                </div>
                <div className={styles.containerColeta}>
                    <img className={styles.imgContainerColeta} src="/img/Map.png" alt="Mapeando" />
                    <h2 className={styles.dashboardColetaTitle}>Mapeando</h2>
                    <p className={styles.dashboardColetaP}>
                        Você pode visualizar no mapa o ponto de coleta vinculado à sua administração. Nosso sistema foi projetado para facilitar sua gestão e trazer mais transparência ao processo.
                    </p>
                    <Link to="/doar-user" className={styles.dashboardButton}>Veja o Mapa</Link>
                </div>
            </div>
            <div className={styles.containerFinalColeta}>
                <h2 className={styles.finalTextColeta}>Comece AGORA!</h2>
                <p className={styles.finalPColeta}>
                    A Ajuda Conecta é uma plataforma inovadora que transforma a gestão de doações para catástrofes naturais, conectando solidariedade e eficiência.
                </p>
                <Link to="/login#" className={styles.finalButtonColeta}>Cadastrar</Link>
            </div>
            <div className={styles.footer}></div>
        </div>
        
    );
}

export default ComoColetar;
