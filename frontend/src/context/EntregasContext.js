// src/context/EntregasContext.js
import React, { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

// Criando o contexto
export const EntregasContext = createContext();

// Provider para gerenciar as entregas
export const EntregasProvider = ({ children }) => {
  const [entregas, setEntregas] = useState(() => {
    const armazenadas = localStorage.getItem('entregas');
    const parsed = armazenadas ? JSON.parse(armazenadas) : [];
    console.log("Entregas carregadas do localStorage:", parsed);
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem('entregas', JSON.stringify(entregas));
  }, [entregas]);

  // Função para adicionar uma nova entrega
  const adicionarEntrega = (novaEntrega) => {
    const entregaComId = { ...novaEntrega, id: uuidv4() };
    console.log("Adicionando entrega:", entregaComId);
    setEntregas((prevEntregas) => [...prevEntregas, entregaComId]);
  };

  // Função para remover uma entrega
  const removerEntrega = (id) => {
    console.log("Removendo entrega com ID:", id);
    setEntregas((prevEntregas) => prevEntregas.filter(entrega => entrega.id !== id));
  };

  // Função para editar uma entrega
  const editarEntrega = (id, entregaAtualizada) => {
    console.log("Editando entrega com ID:", id, "Dados atualizados:", entregaAtualizada);
    setEntregas((prevEntregas) =>
      prevEntregas.map(entrega =>
        entrega.id === id ? { ...entrega, ...entregaAtualizada } : entrega
      )
    );
  };

  return (
    <EntregasContext.Provider value={{ entregas, adicionarEntrega, removerEntrega, editarEntrega }}>
      {children}
    </EntregasContext.Provider>
  );
};
