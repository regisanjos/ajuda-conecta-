
import React from 'react';
import styles from '../styles/Contate.module.css';
import { useNavigate } from 'react-router-dom';

    function Contate() {
        const navigate = useNavigate();
    return (
            <main className={styles.mainContent}>
                <div className={styles.contactLeft}>
                    <h1 className={styles.titleH1Contate}>CONTATE</h1>
                    <p className={styles.description}>
                        Queremos ouvir você! Se tiver alguma dúvida, sugestão ou deseja entrar em contato para oportunidades
                        de colaboração, fique à vontade para nos enviar uma mensagem. Estamos à disposição para responder
                        suas dúvidas, preencha o formulário ao lado ou envie um e-mail, e retornaremos o mais rápido possível.
                    </p>
                    <div className={styles.contactDetails}>
                        <div className={styles.containerMessage}>
                            <img className={styles.emailIcon} src='/img/Email.svg'></img>
                        </div>
                        <p className={styles.contactLabel}>Contato</p>
                        <p className={styles.contactEmail}>exemplo@gmail.com</p>
                    </div>
                </div>

                <div className={styles.containerForm}>
                    <form>
                        <p className={styles.formTitle}>Preencha o formulário de contato:</p>
                        <label className={styles.formLabelContact} htmlFor="nome">Seu nome</label>
                        <input className={styles.formInputContact}type="text" id="nome" name="nome" />

                        <label className={styles.formLabelContact1} htmlFor="telefone">Telefone</label>
                        <input className={styles.formInputContact1} type="text" id="telefone" name="telefone"  />

                        <label className={styles.formLabelContact2} htmlFor="email">E-mail</label>
                        <input className={styles.formInputContact2} type="email" id="email" name="email"/>

                        <label className={styles.formLabelContact3} htmlFor="mensagem">Escreva sua mensagem</label>
                        <textarea className={styles.formInputContact3} id="mensagem" name="mensagem"></textarea>

                        <button type="submit" className={styles.submitButton}>Contatar</button>
                    </form>
                </div>
            </main>
    );
}

export default Contate;
