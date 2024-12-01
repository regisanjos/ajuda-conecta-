
import React, { useState, useContext } from "react";
import InputMask from 'react-input-mask';
import { CatastrofesContext } from "../context/CatastrofesContext";
import styles from "../styles/Catastrofes.module.css";
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { estadosECidades } from "../components/brasil.js"; // Certifique-se de que o caminho está correto

const Catastrofes = () => {
  const {
    catastrofes,
    adicionarCatastrofe,
    removerCatastrofe,
    atualizarCatastrofe,
  } = useContext(CatastrofesContext);

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatastrofe, setEditingCatastrofe] = useState(null);
  const [novaCatastrofe, setNovaCatastrofe] = useState({
    id: "",
    nome: "",
    estado: "",
    cidade: "",
    tipo: "",
    data: "",
    gravidade: "",
    status: "",
  });

 
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [catastrofeParaDeletar, setCatastrofeParaDeletar] = useState(null);

  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 
  const handleOpenModal = () => {
    setEditingCatastrofe(null);
    setNovaCatastrofe({
      id: "",
      nome: "",
      estado: "",
      cidade: "",
      tipo: "",
      data: "",
      gravidade: "",
      status: "",
    });
    setEstadoSelecionado("");
    setCidadeSelecionada("");
    setIsModalOpen(true);
    setErrorMessage('');
  };

  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCatastrofe(null);
    setNovaCatastrofe({
      id: "",
      nome: "",
      estado: "",
      cidade: "",
      tipo: "",
      data: "",
      gravidade: "",
      status: "",
    });
    setEstadoSelecionado("");
    setCidadeSelecionada("");
    setErrorMessage('');
  };

  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNovaCatastrofe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const idGerado = Date.now().toString();
    adicionarCatastrofe({ ...novaCatastrofe, id: idGerado });
    setSuccessMessage('Catástrofe cadastrada com sucesso!');
    handleCloseModal();
    setTimeout(() => setSuccessMessage(''), 5000); // Limpa a mensagem após 5 segundos
  };

 
  const handleUpdate = (event) => {
    event.preventDefault();
    atualizarCatastrofe(editingCatastrofe.id, novaCatastrofe);
    setSuccessMessage('Catástrofe atualizada com sucesso!');
    handleCloseModal();
    setTimeout(() => setSuccessMessage(''), 5000); 
  };

  
  const handleEdit = (catastrofe) => {
    setEditingCatastrofe(catastrofe);
    setNovaCatastrofe(catastrofe);
    setEstadoSelecionado(catastrofe.estado);
    setCidadeSelecionada(catastrofe.cidade);
    setIsModalOpen(true);
  };

 
  const handleDelete = (catastrofe) => {
    setCatastrofeParaDeletar(catastrofe);
    setIsConfirmModalOpen(true);
  };

  
  const confirmDelete = () => {
    if (catastrofeParaDeletar) {
      removerCatastrofe(catastrofeParaDeletar.id);
      setSuccessMessage('Catástrofe removida com sucesso!');
      setCatastrofeParaDeletar(null);
      setIsConfirmModalOpen(false);
      setTimeout(() => setSuccessMessage(''), 5000); 
    }
  };

 
  const cancelDelete = () => {
    setCatastrofeParaDeletar(null);
    setIsConfirmModalOpen(false);
  };

  
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");

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
              <strong>Catástrofes</strong>
            </p>
          </div>
        </nav>
        <h1 className={styles.headerTitleDoacoes}>Catástrofes</h1>
      </div>
      <div className={styles.searchAndAddContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Pesquise por ID, Nome ou Tipo"
        />
        <button className={styles.addButton} onClick={handleOpenModal} aria-label="Adicionar Catástrofe">
          <FaPlus size={24} color="#fff" />
        </button>
      </div>

      {/* Lista de Catástrofes */}
      <div className={styles.containerDoacoes}>
        <h2 className={styles.doacoesListTitle}>Lista de Catástrofes</h2>
        <div className={styles.doacoesDataHeader}>
          <p className={styles.doacoesDataColumn}>ID Catástrofe</p>
          <p className={styles.doacoesDataColumn}>Nome</p>
          <p className={styles.doacoesDataColumn}>Estado</p>
          <p className={styles.doacoesDataColumn}>Cidade</p>
          <p className={styles.doacoesDataColumn}>Tipo</p>
          <p className={styles.doacoesDataColumn}>Data</p>
          <p className={styles.doacoesDataColumn}>Gravidade</p>
          <p className={styles.doacoesDataColumn}>Status</p>
          <p className={styles.doacoesDataColumn}>Ações</p>
        </div>
        {catastrofes.map((catastrofe) => (
          <div key={catastrofe.id} className={styles.doacoesDataRow}>
            <p className={styles.doacoesDataColumn}>{catastrofe.id}</p>
            <p className={styles.doacoesDataColumn}>{catastrofe.nome}</p>
            <p className={styles.doacoesDataColumn}>{catastrofe.estado}</p>
            <p className={styles.doacoesDataColumn}>{catastrofe.cidade}</p>
            <p className={styles.doacoesDataColumn}>{catastrofe.tipo}</p>
            <p className={styles.doacoesDataColumn}>{catastrofe.data}</p>
            <p className={styles.doacoesDataColumn}>{catastrofe.gravidade}</p>
            <p className={styles.doacoesDataColumn}>{catastrofe.status}</p>
            <div className={styles.doacoesActionButtons}>
              <button onClick={() => handleEdit(catastrofe)} className={styles.editButton} aria-label="Editar Catástrofe">
                <FaEdit /> Editar
              </button>
              <button onClick={() => handleDelete(catastrofe)} className={styles.deleteButton} aria-label="Excluir Catástrofe">
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
              {editingCatastrofe ? "Editar Catástrofe" : "Cadastrar Nova Catástrofe"}
            </h2>
            <form
              className={styles.form}
              onSubmit={editingCatastrofe ? handleUpdate : handleSubmit}
            >
              <div className={styles.formGroup}>
                <label htmlFor="nome" className={styles.label}>
                  Nome
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="nome"
                  name="nome"
                  value={novaCatastrofe.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Nome da Catástrofe"
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="estado" className={styles.label}>
                    Estado
                  </label>
                  <select
                    className={styles.inputSelect}
                    id="estado"
                    name="estado"
                    value={estadoSelecionado}
                    onChange={(e) => {
                      const novoEstado = e.target.value;
                      setEstadoSelecionado(novoEstado);
                      setCidadeSelecionada(""); // Reseta a cidade ao mudar o estado
                      setNovaCatastrofe((prev) => ({
                        ...prev,
                        estado: novoEstado,
                        cidade: "",
                      }));
                    }}
                    required
                  >
                    <option value="">Selecione um estado</option>
                    {Object.keys(estadosECidades).map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cidade" className={styles.label}>
                    Cidade
                  </label>
                  <select
                    className={styles.inputSelect}
                    id="cidade"
                    name="cidade"
                    value={cidadeSelecionada}
                    onChange={(e) => {
                      const novaCidade = e.target.value;
                      setCidadeSelecionada(novaCidade);
                      setNovaCatastrofe((prev) => ({
                        ...prev,
                        cidade: novaCidade,
                      }));
                    }}
                    required
                    disabled={!estadoSelecionado}
                  >
                    <option value="">Selecione uma cidade</option>
                    {estadoSelecionado &&
                      estadosECidades[estadoSelecionado].map((cidade) => (
                        <option key={cidade} value={cidade}>
                          {cidade}
                        </option>
                      ))}
                  </select>
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
                  value={novaCatastrofe.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Terremoto">Terremoto</option>
                  <option value="Tsunami">Tsunami</option>
                  <option value="Furacão">Furacão</option>
                  <option value="Ciclone">Ciclone</option>
                  <option value="Inundação">Inundação</option>
                  <option value="Deslizamento">Deslizamento</option>
                </select>
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
                  value={novaCatastrofe.data}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="gravidade" className={styles.label}>
                  Gravidade
                </label>
                <select
                  className={styles.inputSelect}
                  id="gravidade"
                  name="gravidade"
                  value={novaCatastrofe.gravidade}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Alta">Alta</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="status" className={styles.label}>
                  Status
                </label>
                <select
                  className={styles.inputSelect}
                  id="status"
                  name="status"
                  value={novaCatastrofe.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Aviso Emitido">Aviso Emitido</option>
                  <option value="Em Curso">Em Curso</option>
                  <option value="Sob Controle">Sob Controle</option>
                </select>
              </div>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  {editingCatastrofe ? "Atualizar" : "Cadastrar"}
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
      {isConfirmModalOpen && catastrofeParaDeletar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Confirmar Exclusão</h2>
            <p>
              Você tem certeza que deseja excluir a catástrofe{" "}
              <strong>{catastrofeParaDeletar.nome}</strong>?
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

export default Catastrofes;
