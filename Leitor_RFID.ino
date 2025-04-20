#include <Wire.h>
#include <Adafruit_PN532.h>
#include <LiquidCrystal.h>

// -------------------- CONFIGURAÇÕES DOS PINOS (AJUSTE CONFORME SUA PINAGEM) --------------------

#define PN532_IRQ -1
#define PN532_RESET -1
Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

// RFID (PN532 via I2C)
//Adafruit_PN532 nfc(Wire); // Inicialização correta para I2C

// Definição das tags cadastradas
uint8_t tag1[] = { 0x8B, 0x89, 0xAE, 0x02 };//minha
uint8_t tag2[] = { 0xB3, 0x92, 0x68, 0x10 };

// Buzzer
const int buzzerPin = 18; // Pino do buzzer

// LEDs
const int ledVerdePin = 5;  // Pino do LED verde
const int ledVermelhoPin = 19; // Pino do LED vermelho

// LCD (Interface Paralela - Ajuste os pinos conforme sua conexão)
const int rsPin = 12;
const int enPin = 13;
const int d4Pin = 14;
const int d5Pin = 27;
const int d6Pin = 26; // Assumindo correção de conflito
const int d7Pin = 25; // Assumindo correção de conflito

LiquidCrystal lcd(rsPin, enPin, d4Pin, d5Pin, d6Pin, d7Pin);

// -------------------- VARIÁVEIS DE ESTADO --------------------
bool viagemIniciada = false;

// -------------------- SETUP --------------------
void setup() {
  Serial.begin(115200);
  Serial.println("Sistema de Leitura RFID");

  // Inicializa os LEDs como saída
  pinMode(ledVerdePin, OUTPUT);
  pinMode(ledVermelhoPin, OUTPUT);
  digitalWrite(ledVerdePin, LOW);
  digitalWrite(ledVermelhoPin, LOW);

  // Inicializa o Buzzer como saída
  pinMode(buzzerPin, OUTPUT);
  digitalWrite(buzzerPin, LOW);

  // Inicializa o LCD (colunas, linhas)
  lcd.begin(20, 4);
  lcd.print("Aguardando Tag...");

  // Inicializa a comunicação I2C
  Wire.begin();

  // Inicializa o PN532
  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("[FAIL] - Não foi possível encontrar o PN532");
    while (1);
  }
  nfc.SAMConfig();
  Serial.println("[OK] - PN532 Iniciado");
}

// -------------------- FUNÇÃO PARA ACIONAR O BUZZER --------------------
void acionarBuzzer(int duracao = 100) { // Duração em milissegundos
  digitalWrite(buzzerPin, HIGH);
  delay(duracao);
  digitalWrite(buzzerPin, LOW);
}

// -------------------- LOOP PRINCIPAL --------------------
void loop() {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer para o UID da tag
  uint8_t uidLength;                       // Comprimento do UID

  // Tenta ler uma tag
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    Serial.print("Tag lida (UID): ");
    for (int i = 0; i < uidLength; i++) {
      Serial.print(uid[i] < 0x10 ? " 0" : " ");
      Serial.print(uid[i], HEX);
    }
    Serial.println("");

    digitalWrite(ledVerdePin, HIGH);   // Acende o LED verde
    digitalWrite(ledVermelhoPin, LOW);  // Apaga o LED vermelho
    acionarBuzzer(200);               // Aciona o buzzer com bipe curto

    lcd.clear();
    if (!viagemIniciada) {
      lcd.setCursor(0, 0);
      lcd.print("Viagem Iniciada");
      viagemIniciada = true;
    } else {
      lcd.setCursor(0, 0);
      lcd.print("Viagem Finalizada");
      viagemIniciada = false;
    }
    delay(6000); // Exibe a mensagem por 6 segundos
    digitalWrite(ledVerdePin, LOW);  // Apaga o LED verde
    lcd.clear();
    lcd.print("Aguardando Tag...");

  } else {
    // Falha na leitura da tag
    digitalWrite(ledVermelhoPin, HIGH); // Acende o LED vermelho
    digitalWrite(ledVerdePin, LOW);    // Apaga o LED verde
    acionarBuzzer(400);                 // Aciona o buzzer com bipe longo
    lcd.clear();
    lcd.print("Erro na Leitura");
    delay(6000); // Exibe a mensagem por 6 segundos
    digitalWrite(ledVermelhoPin, LOW); // Apaga o LED vermelho
    lcd.clear();
    lcd.print("Aguardando Tag...");
  }

  delay(100); // Pequena pausa
}