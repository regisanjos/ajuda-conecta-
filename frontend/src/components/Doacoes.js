// src/pages/Doacoes.js

import React, { useState, useContext } from "react";
import InputMask from 'react-input-mask'; 
import { DoacoesContext } from "../context/DoacoesContext"; 
import styles from "../styles/Doacoes.module.css";
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; 

const Doacoes = () => {
  const {
    doacoes,
    adicionarDoacao,
    removerDoacao,
    atualizarDoacao,
  } = useContext(DoacoesContext);

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoacao, setEditingDoacao] = useState(null);
  const [novaDoacao, setNovaDoacao] = useState({
    id: "",
    doador: "",
    cpf: "",
    data: "",
    tipo: "",
    local: "",
    destinatario: "",
    status: "",
  });

  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [doacaoParaDeletar, setDoacaoParaDeletar] = useState(null);

  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenModal = () => {
    setEditingDoacao(null);
    setNovaDoacao({
      id: "",
      doador: "",
      cpf: "",
      data: "",
      tipo: "",
      local: "",
      destinatario: "",
      status: "",
    });
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDoacao(null);
    setNovaDoacao({
      id: "",
      doador: "",
      cpf: "",
      data: "",
      tipo: "",
      local: "",
      destinatario: "",
      status: "",
    });
    setErrorMessage('');
  };

 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNovaDoacao((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const idGerado = Date.now().toString();
    adicionarDoacao({ ...novaDoacao, id: idGerado });
    setSuccessMessage('Doação cadastrada com sucesso!');
    handleCloseModal();
    setTimeout(() => setSuccessMessage(''), 5000); 
  };

  npm
  const handleUpdate = (event) => {
    event.preventDefault();
    atualizarDoacao(editingDoacao.id, novaDoacao);
    setSuccessMessage('Doação atualizada com sucesso!');
    handleCloseModal();
    setTimeout(() => setSuccessMessage(''), 5000); 
  };

  // Função para abrir o modal de edição com os dados da doação selecionada
  const handleEdit = (doacao) => {
    setEditingDoacao(doacao);
    setNovaDoacao(doacao);
    setIsModalOpen(true);
  };

  // Função para abrir o modal de confirmação de exclusão
  const handleDelete = (doacao) => {
    setDoacaoParaDeletar(doacao);
    setIsConfirmModalOpen(true);
  };

  // Função para confirmar a exclusão
  const confirmDelete = () => {
    if (doacaoParaDeletar) {
      removerDoacao(doacaoParaDeletar.id);
      setSuccessMessage('Doação removida com sucesso!');
      setDoacaoParaDeletar(null);
      setIsConfirmModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 5000); // Limpa a mensagem após 5 segundos
    }
  };

  // Função para cancelar a exclusão
  const cancelDelete = () => {
    setDoacaoParaDeletar(null);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className={styles.doacoesContainer}>
      {/* Mensagens de Sucesso e Erro */}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

      <div className={styles.doacoesTopBoardContainer}>
        <nav>
          <div className={styles.navList}>
            <p className={styles.navListItem}>Admin</p>
            <p className={styles.navListItem}>
              <strong>Doações</strong>
            </p>
          </div>
        </nav>
        <h1 className={styles.headerTitleDoacoes}>Doações</h1>
      </div>
      <div className={styles.searchAndAddContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Pesquise por ID, Doador ou CPF"
        />
        <button className={styles.addButton} onClick={handleOpenModal} aria-label="Adicionar Doação">
          <FaPlus size={24} color="#fff" />
        </button>
      </div>

      {/* Lista de Doações */}
      <div className={styles.containerDoacoes}>
        <h2 className={styles.doacoesListTitle}>Lista de Doações</h2>
        <div className={styles.doacoesDataHeader}>
          <p className={styles.doacoesDataColumn}>ID Doação</p>
          <p className={styles.doacoesDataColumn}>Doador</p>
          <p className={styles.doacoesDataColumn}>Tipo</p>
          <p className={styles.doacoesDataColumn}>Data</p>
          <p className={styles.doacoesDataColumn}>Local da Entrega</p>
          <p className={styles.doacoesDataColumn}>Destinatário</p>
          <p className={styles.doacoesDataColumn}>Status</p>
          <p className={styles.doacoesDataColumn}>Ações</p>
        </div>
        {doacoes.map((doacao) => (
          <div key={doacao.id} className={styles.doacoesDataRow}>
            <p className={styles.doacoesDataColumn}>{doacao.id}</p>
            <p className={styles.doacoesDataColumn}>{doacao.doador}</p>
            <p className={styles.doacoesDataColumn}>{doacao.tipo}</p>
            <p className={styles.doacoesDataColumn}>{doacao.data}</p>
            <p className={styles.doacoesDataColumn}>{doacao.local}</p>
            <p className={styles.doacoesDataColumn}>{doacao.destinatario}</p>
            <p className={styles.doacoesDataColumn}>{doacao.status}</p>
            <div className={styles.doacoesActionButtons}>
              <button onClick={() => handleEdit(doacao)} className={styles.editButton} aria-label="Editar Doação">
                <FaEdit /> Editar
              </button>
              <button onClick={() => handleDelete(doacao)} className={styles.deleteButton} aria-label="Excluir Doação">
                <FaTrash /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Cadastro e Edição */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              {editingDoacao ? "Editar Doação" : "Cadastrar Nova Doação"}
            </h2>
            <form
              className={styles.form}
              onSubmit={editingDoacao ? handleUpdate : handleSubmit}
            >
              <div className={styles.formGroup}>
                <label htmlFor="doador" className={styles.label}>
                  Doador
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="doador"
                  name="doador"
                  value={novaDoacao.doador}
                  onChange={handleInputChange}
                  required
                  placeholder="Nome do Doador"
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="cpf" className={styles.label}>
                    CPF
                  </label>
                  <InputMask
                    mask="999.999.999-99"
                    maskChar={null}
                    name="cpf"
                    value={novaDoacao.cpf}
                    onChange={handleInputChange}
                    required
                    placeholder="123.456.789-00"
                  >
                    {(inputProps) => <input type="text" {...inputProps} className={styles.input} />}
                  </InputMask>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="data" className={styles.label}>
                    Data
                  </label>
                  <input
                    className={styles.inputDate}
                    type="date"
                    id="data"
                    name="data"
                    value={novaDoacao.data}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tipo" className={styles.label}>
                  Tipo
                </label>
                <select
                  className={styles.inputSelect}
                  id="tipo"
                  name="tipo"
                  value={novaDoacao.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Alimentos não perecíveis">Alimentos não perecíveis</option>
                  <option value="Água potável">Água potável</option>
                  <option value="Roupas e Calçados">Roupas e Calçados</option>
                  <option value="Produtos de Higiene Pessoal">Produtos de Higiene Pessoal</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="local" className={styles.label}>
                  Local da Entrega
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="local"
                  name="local"
                  value={novaDoacao.local}
                  onChange={handleInputChange}
                  required
                  placeholder="Endereço de Entrega"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="destinatario" className={styles.label}>
                  Destinatário
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="destinatario"
                  name="destinatario"
                  value={novaDoacao.destinatario}
                  onChange={handleInputChange}
                  required
                  placeholder="Nome do Destinatário"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="status" className={styles.label}>
                  Status
                </label>
                <select
                  className={styles.inputSelect}
                  id="status"
                  name="status"
                  value={novaDoacao.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Entregue">Entregue</option>
                  <option value="A Caminho">A Caminho</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  {editingDoacao ? "Atualizar" : "Cadastrar"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.closeButton}
                >
                  Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isConfirmModalOpen && doacaoParaDeletar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Confirmar Exclusão</h2>
            <p>
              Você tem certeza que deseja excluir a doação de{" "}
              <strong>{doacaoParaDeletar.doador}</strong>?
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.submitButton}
                onClick={confirmDelete}
              >
                Sim
              </button>
              <button
                className={styles.closeButton}
                onClick={cancelDelete}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doacoes;
