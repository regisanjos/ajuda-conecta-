
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EntregasContext } from '../context/EntregasContext';
import styles from '../styles/DetalhesEntrega.module.css';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function DetalhesEntrega() {
  const { id } = useParams();
  const { entregas } = useContext(EntregasContext);
  const [entrega, setEntrega] = useState(null);
  const [doador, setDoador] = useState(null);
  const [destinatario, setDestinatario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [coordsDoador, setCoordsDoador] = useState(null);
  const [coordsDestinatario, setCoordsDestinatario] = useState(null);

  
  const fetchCEPData = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    const obterEntrega = async () => {
      console.log("Recebendo ID na DetalhesEntrega:", id);
      console.log("Lista de entregas no DetalhesEntrega:", entregas);
      const encontrada = entregas.find(e => e.id.toLowerCase() === id.toLowerCase());
      if (!encontrada) {
        console.log("Entrega não encontrada para ID:", id);
        setError(true);
        setLoading(false);
        return;
      }
      console.log("Entrega encontrada:", encontrada);
      setEntrega(encontrada);

      const doadorData = await fetchCEPData(encontrada.cepDoador);
      const destinatarioData = await fetchCEPData(encontrada.cepDestinatario);
      setDoador(doadorData);
      setDestinatario(destinatarioData);
      setLoading(false);
    };

    obterEntrega();
  }, [id, entregas]);

  
  useEffect(() => {
    const obterCoordenadas = async () => {
      if (doador && destinatario) {
        const fetchCoords = async (cep) => {
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&country=Brazil&postalcode=${cep}`);
            const data = await response.json();
            if (data && data.length > 0) {
              return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
              };
            }
            return null;
          } catch (err) {
            console.error(err);
            return null;
          }
        };

        const coordsOrigem = await fetchCoords(entrega.cepDoador);
        const coordsDestino = await fetchCoords(entrega.cepDestinatario);
        setCoordsDoador(coordsOrigem);
        setCoordsDestinatario(coordsDestino);
      }
    };

    obterCoordenadas();
  }, [doador, destinatario, entrega]);

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (error || !entrega) {
    return <div className={styles.error}>Entrega não encontrada.</div>;
  }

  return (
    <div className={styles.detalhesContainer}>
      <h1 className={styles.title}>Detalhes da Entrega</h1>
      <div className={styles.section}>
        <h2>Informações Gerais</h2>
        <p><strong>ID (Código de Rastreio):</strong> {entrega.id}</p>
        <p><strong>CPF:</strong> {entrega.cpf}</p>
        <p><strong>Itens:</strong> {entrega.itens}</p>
        <p><strong>Lote:</strong> {entrega.lote}</p>
        <p><strong>Data de Entrega:</strong> {entrega.data}</p>
        <p><strong>Status:</strong> {entrega.status}</p>
      </div>
      <div className={styles.section}>
        <h2>Origem (Doador)</h2>
        {doador ? (
          <p>
            {doador.logradouro}, {doador.bairro}, {doador.localidade} - {doador.uf}, CEP: {doador.cep}
          </p>
        ) : (
          <p>Informações do doador não disponíveis.</p>
        )}
      </div>
      <div className={styles.section}>
        <h2>Destino (Destinatário)</h2>
        {destinatario ? (
          <p>
            {destinatario.logradouro}, {destinatario.bairro}, {destinatario.localidade} - {destinatario.uf}, CEP: {destinatario.cep}
          </p>
        ) : (
          <p>Informações do destinatário não disponíveis.</p>
        )}
      </div>
      <div className={styles.section}>
        <h2>Percurso</h2>
        {coordsDoador && coordsDestinatario ? (
          <MapContainer
            center={[coordsDoador.lat, coordsDoador.lon]}
            zoom={6}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coordsDoador.lat, coordsDoador.lon]}>
              <Popup>Origem</Popup>
            </Marker>
            <Marker position={[coordsDestinatario.lat, coordsDestinatario.lon]}>
              <Popup>Destino</Popup>
            </Marker>
            <Polyline positions={[
              [coordsDoador.lat, coordsDoador.lon],
              [coordsDestinatario.lat, coordsDestinatario.lon]
            ]} color="blue" />
          </MapContainer>
        ) : (
          <p>Informações de percurso não disponíveis.</p>
        )}
      </div>
    </div>
  );
}

export default DetalhesEntrega;
