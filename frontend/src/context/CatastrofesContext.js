// src/context/CatastrofesContext.js
import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Importa a função para gerar IDs únicos

export const CatastrofesContext = createContext();

export const CatastrofesProvider = ({ children }) => {
    const [catastrofes, setCatastrofes] = useState(() => {
        const savedCatastrofes = localStorage.getItem("catastrofes");
        return savedCatastrofes ? JSON.parse(savedCatastrofes) : [];
    });

    // Sincroniza o estado com o localStorage
    useEffect(() => {
        localStorage.setItem("catastrofes", JSON.stringify(catastrofes));
    }, [catastrofes]);

    // Log para depuração
    useEffect(() => {
        console.log("Catástrofes no Contexto:", catastrofes);
    }, [catastrofes]);

    // Função para adicionar uma nova catástrofe
    const adicionarCatastrofe = (catastrofe) => {
        const novaCatastrofe = {
            ...catastrofe,
            id: uuidv4(),
        };
        setCatastrofes(prevCatastrofes => [...prevCatastrofes, novaCatastrofe]);
    };

    // Função para remover uma catástrofe pelo ID
    const removerCatastrofe = (id) => {
        setCatastrofes(prevCatastrofes => prevCatastrofes.filter(catastrofe => catastrofe.id !== id));
    };

    // Função para atualizar uma catástrofe existente
    const atualizarCatastrofe = (id, novosDados) => {
        setCatastrofes(prevCatastrofes =>
            prevCatastrofes.map(catastrofe =>
                catastrofe.id === id ? { ...catastrofe, ...novosDados } : catastrofe
            )
        );
    };

    return (
        <CatastrofesContext.Provider value={{ catastrofes, adicionarCatastrofe, removerCatastrofe, atualizarCatastrofe }}>
            {children}
        </CatastrofesContext.Provider>
    );
};
