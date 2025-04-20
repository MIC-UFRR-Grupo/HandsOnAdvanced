import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

export const mapaService = {
  observarVeiculos: (callback) => {
    const veiculosRef = ref(database, 'vehicles');
    const motoristasRef = ref(database, 'drivers');
    const rfidInfoRef = ref(database, 'rfid_tag_info');

    // Primeiro, buscar todos os motoristas e informações RFID
    onValue(motoristasRef, (motoristasSnapshot) => {
      const motoristas = {};
      motoristasSnapshot.forEach((motoristaSnapshot) => {
        motoristas[motoristaSnapshot.key] = motoristaSnapshot.val();
      });

      // Buscar informações RFID
      onValue(rfidInfoRef, (rfidSnapshot) => {
        const rfidInfo = {};
        rfidSnapshot.forEach((infoSnapshot) => {
          rfidInfo[infoSnapshot.key] = infoSnapshot.val();
        });

        // Depois, observar os veículos
        onValue(veiculosRef, (veiculosSnapshot) => {
          const veiculos = [];
          veiculosSnapshot.forEach((veiculoSnapshot) => {
            const veiculo = veiculoSnapshot.val();
            const motorista = motoristas[veiculo.motorista_id] || { nome: 'Motorista não encontrado' };
            const rfidData = rfidInfo[veiculo.rfid_tag] || {};
            
            veiculos.push({
              id: veiculoSnapshot.key,
              ...veiculo,
              motoristaNome: motorista.nome,
              rfidInfo: {
                ultimaLeitura: rfidData.ultimaLeitura || null,
                localizacaoLeitura: rfidData.localizacaoLeitura || null,
                status: rfidData.status || 'Não lido'
              }
            });
          });
          callback(veiculos);
        });
      });
    });

    // Retorna uma função para cancelar a observação
    return () => {
      off(veiculosRef);
      off(motoristasRef);
      off(rfidInfoRef);
    };
  }
}; 