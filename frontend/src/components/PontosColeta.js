import React, { useState, useEffect } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import styles from "../styles/PontosColeta.module.css";
import { estadosECidades } from "./brasil.js";
import { FaPlus, FaEdit, FaTrash, FaCopy } from 'react-icons/fa';

const PontosColeta = () => {
  // Estados para o modal de cadastro/edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [horarioAbertura, setHorarioAbertura] = useState("");
  const [horarioFechamento, setHorarioFechamento] = useState("");
  const [doacaoAceita, setDoacaoAceita] = useState(""); // Alterado para armazenar uma única doação
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [editingPonto, setEditingPonto] = useState(null);

  // Novos estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");

  // Opções pré-definidas de doações aceitas
  const doacoesOpcoes = [
    "Alimentos não perecíveis",
    "Água potável",
    "Roupas e Calçados",
    "Produtos de Higiene Pessoal",
  ];

  // Estados para a lista de pontos de coleta
  const [pontosColeta, setPontosColeta] = useState(() => {
    const storedData = localStorage.getItem("pontosColeta");
    return storedData ? JSON.parse(storedData) : [];
  });

  // Estados para o modal de confirmação de exclusão
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pontoParaDeletar, setPontoParaDeletar] = useState(null);

  // Estados para mensagens de sucesso e erro
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Atualiza o localStorage sempre que pontosColeta mudar
  useEffect(() => {
    localStorage.setItem("pontosColeta", JSON.stringify(pontosColeta));
  }, [pontosColeta]);

  // Função para abrir o modal de cadastro
  const handleOpenModal = () => {
    setEditingPonto(null);
    setNome("");
    setRua("");
    setNumero("");
    setHorarioAbertura("");
    setHorarioFechamento("");
    setDoacaoAceita("");
    setEstadoSelecionado("");
    setCidadeSelecionada("");
    setIsModalOpen(true);
  };

  // Função para fechar o modal de cadastro/edição
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPonto(null);
    setNome("");
    setRua("");
    setNumero("");
    setHorarioAbertura("");
    setHorarioFechamento("");
    setDoacaoAceita("");
    setEstadoSelecionado("");
    setCidadeSelecionada("");
    setErrorMessage('');
  };

  // Função para cadastrar um novo ponto de coleta
  const handleSubmit = (event) => {
    event.preventDefault();

    const novoPonto = {
      id: `PT${pontosColeta.length + 1}`,
      nome: nome,
      estado: estadoSelecionado,
      cidade: cidadeSelecionada,
      rua: rua,
      numero: numero,
      horario: `${horarioAbertura} - ${horarioFechamento}`,
      doacoes: [doacaoAceita], // Armazena a doação selecionada em um array
    };

    setPontosColeta([...pontosColeta, novoPonto]);

    // Resetar estados
    handleCloseModal();
    setSuccessMessage('Ponto de coleta cadastrado com sucesso!');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Função para atualizar um ponto de coleta existente
  const handleUpdate = (event) => {
    event.preventDefault();

    const pontoAtualizado = {
      id: editingPonto.id,
      nome: nome,
      estado: estadoSelecionado,
      cidade: cidadeSelecionada,
      rua: rua,
      numero: numero,
      horario: `${horarioAbertura} - ${horarioFechamento}`,
      doacoes: [doacaoAceita], // Armazena a doação selecionada em um array
    };

    const updatedPontos = pontosColeta.map((ponto) =>
      ponto.id === editingPonto.id ? pontoAtualizado : ponto
    );

    setPontosColeta(updatedPontos);

    // Resetar estados
    handleCloseModal();
    setSuccessMessage('Ponto de coleta atualizado com sucesso!');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Função para iniciar a edição de um ponto de coleta
  const handleEdit = (ponto) => {
    setEditingPonto(ponto);
    setNome(ponto.nome);
    setRua(ponto.rua);
    setNumero(ponto.numero);
    setEstadoSelecionado(ponto.estado);
    setCidadeSelecionada(ponto.cidade);
    const [abertura, fechamento] = ponto.horario.split(" - ");
    setHorarioAbertura(abertura);
    setHorarioFechamento(fechamento);
    setDoacaoAceita(ponto.doacoes[0] || ""); // Pega a primeira doação do array
    setIsModalOpen(true);
  };

  // Função para abrir o modal de confirmação de exclusão
  const handleDelete = (ponto) => {
    setPontoParaDeletar(ponto);
    setIsConfirmModalOpen(true);
  };

  // Função para confirmar a exclusão
  const confirmDelete = () => {
    if (pontoParaDeletar) {
      const updatedPontos = pontosColeta.filter(
        (ponto) => ponto.id !== pontoParaDeletar.id
      );
      setPontosColeta(updatedPontos);
      setPontoParaDeletar(null);
      setIsConfirmModalOpen(false);
      setSuccessMessage('Ponto de coleta removido com sucesso!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  // Função para cancelar a exclusão
  const cancelDelete = () => {
    setPontoParaDeletar(null);
    setIsConfirmModalOpen(false);
  };

  // Função para copiar o ID para a área de transferência
  const handleCopyClick = (id) => {
    navigator.clipboard.writeText(id)
      .then(() => {
        alert("Código copiado para a área de transferência!");
      })
      .catch(err => {
        console.error("Erro ao copiar o código:", err);
      });
  };

  return (
    <div className={styles.doacoesContainer}>
      {/* Mensagens de Sucesso e Erro */}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

      {/* Cabeçalho e Navegação */}
      <div className={styles.doacoesTopBoardContainer}>
        <nav>
          <div className={styles.navList}>
            <p className={styles.navListItem}>Admin</p>
            <p className={styles.navListItem}>
              <strong>Pontos de Coleta</strong>
            </p>
          </div>
        </nav>
        <h1 className={styles.headerTitleDoacoes}>Pontos de Coleta</h1>
      </div>

      {/* Barra de Pesquisa e Botão de Adição */}
      <div className={styles.searchAndAddContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Pesquisar por ID ou Nome"
        />
        <button className={styles.addButton} onClick={handleOpenModal} aria-label="Adicionar Ponto de Coleta">
          <FaPlus size={24} color="#fff" />
        </button>
      </div>

      {/* Lista de Pontos de Coleta */}
      <div className={styles.containerDoacoes}>
        <h2 className={styles.doacoesListTitle}>Lista de Pontos de Coleta</h2>
        <div className={styles.doacoesDataHeader}>
          <p className={styles.doacoesDataColumn}>ID</p>
          <p className={styles.doacoesDataColumn}>Nome</p>
          <p className={styles.doacoesDataColumn}>Cidade</p>
          <p className={styles.doacoesDataColumn}>Estado</p>
          <p className={styles.doacoesDataColumn}>Horário</p>
          <p className={styles.doacoesDataColumn}>Doação Aceita</p>
          <p className={styles.doacoesDataColumn}>Ações</p>
        </div>
        {pontosColeta.map((ponto) => (
          <div key={ponto.id} className={styles.doacoesDataRow}>
            <p className={styles.doacoesDataColumn}>{ponto.id}</p>
            <p className={styles.doacoesDataColumn}>{ponto.nome}</p>
            <p className={styles.doacoesDataColumn}>{ponto.cidade}</p>
            <p className={styles.doacoesDataColumn}>{ponto.estado}</p>
            <p className={styles.doacoesDataColumn}>{ponto.horario}</p>
            <p className={styles.doacoesDataColumn}>{ponto.doacoes.join(", ")}</p>
            <div className={styles.doacoesActionButtons}>
              <button onClick={() => handleEdit(ponto)} className={styles.editButton} aria-label="Editar Ponto de Coleta">
                <FaEdit /> Editar
              </button>
              <button onClick={() => handleDelete(ponto)} className={styles.deleteButton} aria-label="Excluir Ponto de Coleta">
                <FaTrash /> Excluir
              </button>
              <button onClick={() => handleCopyClick(ponto.id)} className={styles.copyButton} aria-label="Copiar ID">
                <FaCopy /> Copiar ID
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
              {editingPonto ? "Editar Ponto de Coleta" : "Cadastrar Ponto de Coleta"}
            </h2>
            <form
              className={styles.form}
              onSubmit={editingPonto ? handleUpdate : handleSubmit}
            >
              <div className={styles.formGroup}>
                <label htmlFor="nome" className={styles.label}>
                  Nome
                </label>
                <input
                  className={styles.input}
                  name="nome"
                  id="nome"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do Ponto de Coleta"
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
                      setEstadoSelecionado(e.target.value);
                      setCidadeSelecionada("");
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
                    onChange={(e) => setCidadeSelecionada(e.target.value)}
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
              <div className={styles.inlineGroup}>
                <div className={styles.formGroupInline}>
                  <label htmlFor="rua" className={styles.label}>
                    Rua
                  </label>
                  <input
                    className={styles.input}
                    name="rua"
                    id="rua"
                    required
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    placeholder="Endereço de Entrega"
                  />
                </div>
                <div className={styles.formGroupInline}>
                  <label htmlFor="numero" className={styles.label}>
                    Número
                  </label>
                  <input
                    className={styles.input}
                    name="numero"
                    id="numero"
                    type="number"
                    required
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="Número"
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Horário de Funcionamento
                </label>
                <div className={styles.inlineGroup}>
                  <div className={styles.formGroupInline}>
                    <label htmlFor="horarioAbertura" className={styles.label}>
                      Início
                    </label>
                    <TimePicker
                      onChange={setHorarioAbertura}
                      value={horarioAbertura}
                      disableClock
                      clearIcon={null}
                      className={styles.timePicker}
                    />
                  </div>
                  <div className={styles.formGroupInline}>
                    <label htmlFor="horarioFechamento" className={styles.label}>
                      Fechamento
                    </label>
                    <TimePicker
                      onChange={setHorarioFechamento}
                      value={horarioFechamento}
                      disableClock
                      clearIcon={null}
                      className={styles.timePicker}
                    />
                  </div>
                </div>
              </div>
              {/* Atualização para o select simples */}
              <div className={styles.formGroup}>
                <label htmlFor="doacaoAceita" className={styles.label}>
                  Doação Aceita
                </label>
                <select
                  name="doacaoAceita"
                  id="doacaoAceita"
                  value={doacaoAceita}
                  onChange={(e) => setDoacaoAceita(e.target.value)}
                  required
                  className={styles.inputSelect}
                >
                  <option value="" disabled>
                    Selecione uma doação
                  </option>
                  {doacoesOpcoes.map((opcao) => (
                    <option key={opcao} value={opcao}>
                      {opcao}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.modalButtons}>
                <button className={styles.submitButton} type="submit">
                  {editingPonto ? "Atualizar" : "Cadastrar"}
                </button>
                <button
                  className={styles.closeButton}
                  type="button"
                  onClick={handleCloseModal}
                >
                  Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isConfirmModalOpen && pontoParaDeletar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Confirmar Exclusão</h2>
            <p>
              Você tem certeza que deseja excluir o ponto de coleta{" "}
              <strong>{pontoParaDeletar.nome}</strong>?
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

export default PontosColeta;
