import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../leaflet/dist/leaflet.css';
import { mapaService } from '../services/mapaService';
import carIcon from '../assets/car-icon.png';

// Corrigir o ícone do marcador
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Criar ícone personalizado para o carro
const vehicleIcon = new L.Icon({
  iconUrl: carIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const Mapa = () => {
  const [veiculos, setVeiculos] = useState([]);
  const center = [-23.550520, -46.633308]; // São Paulo

  useEffect(() => {
    const unsubscribe = mapaService.observarVeiculos((veiculosAtualizados) => {
      setVeiculos(veiculosAtualizados);
    });

    return () => unsubscribe();
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {veiculos.map((veiculo) => (
        <Marker
          key={veiculo.id}
          position={[veiculo.latitude, veiculo.longitude]}
          icon={vehicleIcon}
        >
          <Popup>
            <div>
              <h3>{veiculo.placa}</h3>
              <p>Motorista: {veiculo.motoristaNome}</p>
              <p>Velocidade: {veiculo.velocidade} km/h</p>
              <p>RFID: {veiculo.rfid_tag}</p>
              <p>Status RFID: {veiculo.rfidInfo.status}</p>
              {veiculo.rfidInfo.ultimaLeitura && (
                <p>Última leitura RFID: {new Date(veiculo.rfidInfo.ultimaLeitura).toLocaleString()}</p>
              )}
              {veiculo.rfidInfo.localizacaoLeitura && (
                <p>Local da leitura: {veiculo.rfidInfo.localizacaoLeitura}</p>
              )}
              <p>Última atualização: {new Date(veiculo.timestamp).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Mapa; 