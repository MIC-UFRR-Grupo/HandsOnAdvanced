import { database } from '../config/firebase';
import { ref, set, get, update } from 'firebase/database';

export const rfidService = {
  // Atualizar informações de uma tag RFID
  atualizarInfo: async (rfidTag, info) => {
    try {
      const rfidRef = ref(database, `rfid_tag_info/${rfidTag}`);
      await update(rfidRef, {
        heart_rate: info.heart_rate,
        is_moving: info.is_moving,
        latitude: info.latitude,
        longitude: info.longitude,
        mpu_accel_x: info.mpu_accel_x,
        mpu_accel_y: info.mpu_accel_y,
        mpu_accel_z: info.mpu_accel_z,
        mpu_gyro_x: info.mpu_gyro_x,
        mpu_gyro_y: info.mpu_gyro_y,
        mpu_gyro_z: info.mpu_gyro_z,
        mpu_temperature: info.mpu_temperature,
        timestamp: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar informações do RFID:', error);
      throw error;
    }
  },

  // Registrar uma nova leitura de RFID
  registrarLeitura: async (rfidTag, localizacao) => {
    try {
      const rfidRef = ref(database, `rfid_tag_info/${rfidTag}`);
      await set(rfidRef, {
        ultimaLeitura: new Date().toISOString(),
        localizacaoLeitura: localizacao,
        status: 'Lido',
        ultimaAtualizacao: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao registrar leitura do RFID:', error);
      throw error;
    }
  },

  // Obter informações de uma tag RFID
  obterInfo: async (rfidTag) => {
    try {
      const rfidRef = ref(database, `rfid_tag_info/${rfidTag}`);
      const snapshot = await get(rfidRef);
      return snapshot.val();
    } catch (error) {
      console.error('Erro ao obter informações do RFID:', error);
      throw error;
    }
  }
}; 