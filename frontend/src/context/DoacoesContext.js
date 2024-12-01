// src/context/DoacoesContext.js

import React, { createContext, useState, useEffect } from 'react';

// Criação do contexto
export const DoacoesContext = createContext();

// Provedor do contexto
export const DoacoesProvider = ({ children }) => {
  const [doacoes, setDoacoes] = useState(() => {
    const armazenadas = localStorage.getItem('doacoes');
    return armazenadas ? JSON.parse(armazenadas) : [];
  });

  useEffect(() => {
    localStorage.setItem('doacoes', JSON.stringify(doacoes));
  }, [doacoes]);

  const adicionarDoacao = (doacao) => {
    setDoacoes((prevDoacoes) => [...prevDoacoes, doacao]);
  };

  const removerDoacao = (id) => {
    setDoacoes((prevDoacoes) => prevDoacoes.filter((doacao) => doacao.id !== id));
  };

  const atualizarDoacao = (id, doacaoAtualizada) => {
    setDoacoes((prevDoacoes) =>
      prevDoacoes.map((doacao) =>
        doacao.id === id ? { ...doacao, ...doacaoAtualizada } : doacao
      )
    );
  };

  return (
    <DoacoesContext.Provider value={{ doacoes, adicionarDoacao, removerDoacao, atualizarDoacao }}>
      {children}
    </DoacoesContext.Provider>
  );
};
