
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntregasContext } from '../context/EntregasContext';
import HeaderUser from './HeaderUser';
import styles from '../styles/AcompanharUser.module.css';

function AcompanharUser() {
  const [codigoRastreio, setCodigoRastreio] = useState('');
  const { entregas } = useContext(EntregasContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("Lista de entregas no AcompanharUser:", entregas);
  }, [entregas]);

  const handleInputChange = (e) => {
    setCodigoRastreio(e.target.value);
  };

  const handleAcompanhar = (e) => {
    e.preventDefault();
    const codigoTrimmed = codigoRastreio.trim();
    console.log("Código de rastreio inserido:", codigoTrimmed);
    entregas.forEach(entrega => {
      console.log(`Comparando com ID: ${entrega.id}`);
    });
    const entregaEncontrada = entregas.find(entrega => entrega.id === codigoTrimmed);

    if (entregaEncontrada) {
      console.log("Entrega encontrada:", entregaEncontrada);
      navigate(`/acompanhar/${entregaEncontrada.id}`);
    } else {
      console.log("Entrega não encontrada para o código:", codigoTrimmed);
      setError('Código de rastreio inválido ou não encontrado.');
    }
  };

  return (
    <div>
      <HeaderUser />
      <div className={styles.mainContent}>
        <div className={styles.colorVid}></div>
        <h1 className={styles.acompanharH1}>Acompanhe</h1>
        <p className={styles.acompanharP}>Digite seu código de rastreio abaixo</p>
        <form onSubmit={handleAcompanhar} className={styles.acompanharForm}>
          <input
            type='text'
            className={styles.acompanharInput}
            value={codigoRastreio}
            onChange={handleInputChange}
            required
          />
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.acompanharButton}>Acompanhar</button>
        </form>
      </div>
    </div>
  );
}

export default AcompanharUser;
