# MIC016 – Hands-On Advanced: 

## 📚 Sobre a Disciplina  
**Disciplina**: MIC016 – Hands-On Advanced  
**Atividade**: Maker Aula 06  
**Assunto**: Avanço e melhorias no projeto do **DSEI LESTE**

## 🚀 Projeto  
Este repositório contém a implementação e evolução de um projeto de monitoramento de veículo de transporte hospitalar

---

## 🏆 Desafio  monitoramento de veículo de transporte hospitalar - DSEI LESTE
O objetivo é construir uma solução funcional e testável para monitorar e gerenciar o transporte de pacientes e motoristas do DSEI.

---

## 👩‍💻 Participantes do Projeto  
- **Erica Camila Silva Cunha**  
- **João Lucas Sidney Rodrigues**  
- **Wendemara Gomes**

---
# 🧠 Projeto ESP32 com GPS, MPU6050, PN532, AD8232 e Firebase

Sistema embarcado utilizando o ESP32 para monitoramento de localização, movimento e sinais vitais, com envio periódico de dados ao Firebase Realtime Database. A ativação da coleta de dados ocorre via tag NFC.

---

## 🔌 Esquema de Ligações

### 📷 Diagrama de Conexões

![Esquema de Ligação](https://github.com/user-attachments/assets/046cb2fd-b86e-4ad0-a333-c989ef3b4811)

### 📍 Conexões por Componente

#### MPU6050 (I2C)
- `VCC` → 3.3V
- `GND` → GND
- `SCL` → GPIO 22
- `SDA` → GPIO 21

#### GPS (GY-GPS6MV2)
- `VCC` → 3.3V
- `GND` → GND
- `TX` → GPIO 16 (RX)
- `RX` → GPIO 17 (TX)

#### PN532 NFC (I2C)
- `VCC` → 3.3V
- `GND` → GND
- `SDA` → GPIO 21
- `SCL` → GPIO 22

#### AD8232 (Sensor Cardíaco)
- `OUT` → GPIO 34
- `3.3V` → 3.3V
- `GND` → GND

#### LEDs
- **LED Vermelho** → GPIO 12
- **LED Verde** → GPIO 13

#### Buzzer
- `Sinal` → GPIO 18
- `GND` → GND (com resistor de 330Ω)

---

### 💡 Observações
- Todos os sensores são alimentados com 3.3V, compatível com o ESP32.
- O sistema usa WiFi para envio de dados ao Firebase.
- O buzzer emite som ao detectar uma tag NFC válida.

---

## ⚙️ Funcionalidades do Sistema

- Detecção de RFID via PN532 para ativar/desativar o monitoramento
- Leitura de:
  - Localização GPS (latitude, longitude, altitude, velocidade)
  - Movimento (aceleração e giroscópio via MPU6050)
  - Sinal de batimento cardíaco (via AD8232)
- LEDs indicativos de status
- Buzzer como sinal de ativação
- Envio dos dados para o Firebase a cada 5 segundos enquanto ativo

---

## ☁️ Integração com Firebase

- Dados RFID são registrados em `/drivers/<tag_id>/rfid`
- Dados dos sensores ativos são enviados em `/drivers/<tag_id>/dados_ativos`
- O Firebase utiliza autenticação por token legado

---

## 📦 Bibliotecas Utilizadas

- `WiFi.h`
- `Wire.h`
- `Adafruit_PN532.h`
- `Adafruit_MPU6050.h`
- `Adafruit_Sensor.h`
- `Firebase_ESP_Client.h`
- `TinyGPSPlus.h`

---

## 🚀 Como Usar

1. Clone este repositório
2. Configure as credenciais WiFi e Firebase no arquivo `ambiente.ino`
3. Faça upload do código para seu ESP32
4. Encoste uma tag NFC válida no leitor para iniciar o monitoramento

---

## 📎 Licença

Este projeto é de livre uso educacional. Sinta-se à vontade para usar e modificar com os devidos créditos.

---

|   |   |
|----------|----------|
| <img src="https://github.com/user-attachments/assets/046cb2fd-b86e-4ad0-a333-c989ef3b4811" alt="Diagrama" width="640">|<img src="https://github.com/user-attachments/assets/b56fa892-df8c-4b7f-9034-c7abbbeefa65" alt="Foto" width="360"> |

