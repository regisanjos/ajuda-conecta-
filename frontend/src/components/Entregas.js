// src/components/Entregas.js

import React, { useState, useContext } from "react";
import InputMask from 'react-input-mask';
import { EntregasContext } from "../context/EntregasContext";
import styles from "../styles/Entregas.module.css";
import { FaEdit, FaTrash, FaCopy, FaPlus } from 'react-icons/fa';

function Entregas() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [entregaSelecionada, setEntregaSelecionada] = useState(null);
  const [novaEntrega, setNovaEntrega] = useState({
    cpf: "",
    cepDoador: "",
    cepDestinatario: "",
    itens: "",
    lote: "",
    data: "",
    status: "Pendente",
  });

  const { entregas, adicionarEntrega, removerEntrega, editarEntrega } = useContext(EntregasContext);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [entregaParaDeletar, setEntregaParaDeletar] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddClick = () => {
    setIsRegistering(true);
    setIsEditing(false);
    setNovaEntrega({
      cpf: "",
      cepDoador: "",
      cepDestinatario: "",
      itens: "",
      lote: "",
      data: "",
      status: "Pendente",
    });
    setEntregaSelecionada(null);
  };

  const handleCloseForm = () => {
    setIsRegistering(false);
    setIsEditing(false);
    setEntregaSelecionada(null);
    setNovaEntrega({
      cpf: "",
      cepDoador: "",
      cepDestinatario: "",
      itens: "",
      lote: "",
      data: "",
      status: "Pendente",
    });
    setErrorMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaEntrega((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const cepRegex = /^\d{5}-\d{3}$/;

    const cepDoadorTrimmed = novaEntrega.cepDoador.trim();
    const cepDestinatarioTrimmed = novaEntrega.cepDestinatario.trim();

    console.log("CPF:", novaEntrega.cpf);
    console.log("CEP Doador Trimmed:", cepDoadorTrimmed);
    console.log("CEP Destinatário Trimmed:", cepDestinatarioTrimmed);

    if (!cpfRegex.test(novaEntrega.cpf)) {
      setErrorMessage('CPF inválido.');
      setSuccessMessage('');
      return;
    }

    if (!cepRegex.test(cepDoadorTrimmed) || !cepRegex.test(cepDestinatarioTrimmed)) {
      setErrorMessage('CEP(s) inválido(s).');
      setSuccessMessage('');
      return;
    }

    const entregaAtualizada = {
      ...novaEntrega,
      cepDoador: cepDoadorTrimmed,
      cepDestinatario: cepDestinatarioTrimmed,
    };

    if (isEditing) {
      editarEntrega(entregaSelecionada.id, entregaAtualizada);
      setSuccessMessage('Entrega atualizada com sucesso!');
    } else {
      const idGerado = Date.now().toString();
      adicionarEntrega({ ...entregaAtualizada, id: idGerado });
      setSuccessMessage(`Entrega adicionada com sucesso! Código de Rastreio: ${idGerado}`);
    }
    setErrorMessage('');
    handleCloseForm();
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleEditClick = (entrega) => {
    setIsEditing(true);
    setIsRegistering(true);
    setEntregaSelecionada(entrega);
    setNovaEntrega(entrega);
  };

  const handleDeleteClick = (entrega) => {
    setEntregaParaDeletar(entrega);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (entregaParaDeletar) {
      removerEntrega(entregaParaDeletar.id);
      setSuccessMessage('Entrega removida com sucesso!');
      setErrorMessage('');
      setEntregaParaDeletar(null);
      setIsConfirmModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const cancelDelete = () => {
    setEntregaParaDeletar(null);
    setIsConfirmModalOpen(false);
  };

  const handleCopyClick = (id) => {
    navigator.clipboard.writeText(id)
      .then(() => {
        alert("Código de rastreio copiado para a área de transferência!");
      })
      .catch(err => {
        console.error("Erro ao copiar o código:", err);
      });
  };

  return (
    <div className={styles.entregasContainer}>
      {/* Mensagens de Sucesso e Erro */}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

      <div className={styles.entregasTopBoardContainer}>
        <nav>
          <div className={styles.entregasNavList}>
            <p className={styles.entregasNavListItem}>Admin</p>
            <p className={styles.entregasNavListItem}>
              <strong>Entregas</strong>
            </p>
          </div>
        </nav>
        <h1 className={styles.entregasHeaderTitle}>Entregas</h1>
      </div>
      <div className={styles.searchAndAddContainer}>
        <input
          type="text"
          className={styles.entregasSearchInput}
          placeholder="Pesquisar por ID, CPF ou CEP"
        />
        <button className={styles.entregasAddButton} onClick={handleAddClick} aria-label="Adicionar Entrega">
          <FaPlus size={24} color="#fff" />
        </button>
      </div>

      {/* Lista de Entregas */}
      <div className={styles.entregasListContainer}>
        <h2 className={styles.entregasListTitle}>Lista de Entregas</h2>
        <div className={styles.entregasDataHeader}>
          <p className={styles.entregasDataColumn}>ID</p>
          <p className={styles.entregasDataColumn}>CPF</p>
          <p className={styles.entregasDataColumn}>CEP Doador</p>
          <p className={styles.entregasDataColumn}>CEP Destinatário</p>
          <p className={styles.entregasDataColumn}>Itens</p>
          <p className={styles.entregasDataColumn}>Lote</p>
          <p className={styles.entregasDataColumn}>Data</p>
          <p className={styles.entregasDataColumn}>Status</p>
          <p className={styles.entregasDataColumn}>Ações</p>
        </div>
        {entregas.map((entrega) => (
          <div key={entrega.id} className={styles.entregasDataRow}>
            <p className={styles.entregasDataColumn}>{entrega.id}</p>
            <p className={styles.entregasDataColumn}>{entrega.cpf}</p>
            <p className={styles.entregasDataColumn}>{entrega.cepDoador}</p>
            <p className={styles.entregasDataColumn}>{entrega.cepDestinatario}</p>
            <p className={styles.entregasDataColumn}>{entrega.itens}</p>
            <p className={styles.entregasDataColumn}>{entrega.lote}</p>
            <p className={styles.entregasDataColumn}>{entrega.data}</p>
            <p className={styles.entregasDataColumn}>{entrega.status}</p>
            <div className={styles.entregasActionButtons}>
              <button onClick={() => handleEditClick(entrega)} className={styles.editButton} aria-label="Editar Entrega">
                <FaEdit /> Editar
              </button>
              <button onClick={() => handleDeleteClick(entrega)} className={styles.deleteButton} aria-label="Excluir Entrega">
                <FaTrash /> Excluir
              </button>
              <button onClick={() => handleCopyClick(entrega.id)} className={styles.copyButton} aria-label="Copiar ID">
                <FaCopy /> Copiar ID
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Cadastro e Edição */}
      {isRegistering && (
        <div className={styles.entregasModal}>
          <div className={styles.entregasModalContent}>
            <h2>{isEditing ? "Editar Entrega" : "Cadastrar Nova Entrega"}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.entregasInlineGroup}>
                <div className={styles.entregasFormGroupInline}>
                  <label htmlFor="cpf">CPF:</label>
                  <InputMask
                    mask="999.999.999-99"
                    maskChar={null}
                    name="cpf"
                    value={novaEntrega.cpf}
                    onChange={handleChange}
                    required
                    placeholder="123.456.789-00"
                  >
                    {(inputProps) => <input className={styles.cpf12} type="text" id="cpf" {...inputProps} />}
                  </InputMask>
                </div>
                <div className={styles.entregasFormGroupInline}>
                  <label htmlFor="data">Data de Entrega:</label>
                  <input className={styles.date12}
                    type="date"
                    id="data"
                    name="data"
                    value={novaEntrega.data}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.entregasFormGroup}>
                <label htmlFor="cepDoador">CEP Doador:</label>
                <InputMask
                  mask="99999-999"
                  maskChar={null}
                  name="cepDoador"
                  value={novaEntrega.cepDoador}
                  onChange={handleChange}
                  required
                  placeholder="88032-300"
                >
                  {(inputProps) => <input type="text" id="cepDoador" {...inputProps} />}
                </InputMask>
              </div>
              <div className={styles.entregasFormGroup}>
                <label htmlFor="cepDestinatario">CEP Destinatário:</label>
                <InputMask
                  mask="99999-999"
                  maskChar={null}
                  name="cepDestinatario"
                  value={novaEntrega.cepDestinatario}
                  onChange={handleChange}
                  required
                  placeholder="12345-678"
                >
                  {(inputProps) => <input type="text" id="cepDestinatario" {...inputProps} />}
                </InputMask>
              </div>
              <div className={styles.entregasFormGroup}>
                <label htmlFor="itens">Itens:</label>
                <select
                  name="itens"
                  id="itens"
                  value={novaEntrega.itens}
                  onChange={handleChange}
                  required
                  className={styles.entregasSelect}
                >
                  <option value="" disabled>Selecione um item</option>
                  <option value="Alimentos não perecíveis">Alimentos não perecíveis</option>
                  <option value="Água potável">Água potável</option>
                  <option value="Roupas e Calçados">Roupas e Calçados</option>
                  <option value="Produtos de Higiene Pessoal">Produtos de Higiene Pessoal</option>
                </select>
              </div>
              <div className={styles.entregasFormGroup}>
                <label htmlFor="lote">Lote:</label>
                <input
                  type="text"
                  id="lote"
                  name="lote"
                  value={novaEntrega.lote}
                  onChange={handleChange}
                  required
                  placeholder="Ex: 2"
                />
              </div>
              <div className={styles.entregasFormGroup}>
                <label htmlFor="status">Status:</label>
                <select
                  name="status"
                  id="status"
                  value={novaEntrega.status}
                  onChange={handleChange}
                  required
                  className={styles.entregasStatusSelect}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Entregue">Entregue</option>
                </select>
              </div>
              <div className={styles.entregasModalButtons}>
                <button type="submit" className={styles.entregasSaveButton}>
                  {isEditing ? "Atualizar" : "Cadastrar"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className={styles.entregasCancelButton}
                >
                  Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isConfirmModalOpen && entregaParaDeletar && (
        <div className={styles.entregasModal}>
          <div className={styles.entregasModalContent}>
            <h2>Confirmar Exclusão</h2>
            <p>
              Você tem certeza que deseja excluir a entrega <strong>ID: {entregaParaDeletar.id}</strong>?
            </p>
            <div className={styles.entregasModalButtons}>
              <button
                onClick={confirmDelete}
                className={styles.entregasSaveButton}
              >
                Sim
              </button>
              <button
                onClick={cancelDelete}
                className={styles.entregasCancelButton}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Entregas;
