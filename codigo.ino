#include <Wire.h>
#include <WiFi.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_MPU6050.h>
#include <Firebase_ESP_Client.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include "ambiente.ino"  // #define WIFI_SSID WIFI_PASSWORD

// Objeto Firebase
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Definições de pinos
#define GPS_RX 16
#define GPS_TX 17
#define SDA 21
#define SCL 22
#define AD8232_OUT 34
#define LED_GREEN 13
#define LED_RED 12
#define BUZZER 18

// Inicialização dos sensores
Adafruit_MPU6050 mpu;
TinyGPSPlus gps;
HardwareSerial gpsSerial(2); // Serial2 para GPS (GPIO 16 e 17)

// Variáveis de controle
unsigned long lastHeartbeat = 0;
float heartRate = 0;
bool isMoving = false;

// Configurações
const float ACCEL_THRESHOLD = 1.5; // Limiar de aceleração para detectar movimento (m/s²)
const int HEARTBEAT_INTERVAL = 10000; // Intervalo para cálculo de frequência cardíaca (ms)

void setup() {
  Serial.begin(115200);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  digitalWrite(LED_GREEN, HIGH); 

  Wire.begin(SDA, SCL); // Inicializa a biblioteca Wire para I2C

  // WIFI
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("[  ] - Conectando ao WiFi...");
  }
  Serial.println("[OK] - WiFi conectado!");

  // FIREBASE
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  if (!Firebase.ready()) {
    Serial.println("[FAIL] - Falha ao conectar ao Firebase!");
    tocaBuzzer();
    while (1);
  } else{
    Serial.println("[OK] - FIREBASE conectado!");
  }

  // MPU6050
  if (!mpu.begin()) {
    Serial.println("[FAIL] - Falha ao inicializar MPU6050");
    tocaBuzzer();
    while (1);
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  //GPS
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX, GPS_TX);

}

void loop() {
  readSensor("test_tag");
  delay(2000); 
}

void tocaBuzzer(){
    digitalWrite(BUZZER, HIGH);
    delay(200);
    digitalWrite(BUZZER, LOW);
}


void readSensor(String currentTagID){
  // Leitura do MPU6050
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  float accelMagnitude = sqrt(a.acceleration.x * a.acceleration.x +
                              a.acceleration.y * a.acceleration.y +
                              a.acceleration.z * a.acceleration.z) / 9.81; // Normaliza para g
  isMoving = accelMagnitude > ACCEL_THRESHOLD;
  Serial.print("Movimento: ");
  Serial.println(isMoving ? "Sim" : "Não");

    // Leitura do AD8232 (Frequência cardíaca)
    if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
      int samples = 100;
      int beats = 0;
      unsigned long startTime = millis();
      int lastValue = analogRead(AD8232_OUT);
      bool rising = false;

      while (millis() - startTime < HEARTBEAT_INTERVAL) {
        int value = analogRead(AD8232_OUT);
        if (lastValue < 2000 && value >= 2000) {
          rising = true;
        } else if (rising && lastValue >= 2000 && value < 2000) {
          beats++;
          rising = false;
        }
        lastValue = value;
        delay(10);
      }
      heartRate = (beats * 60000.0) / HEARTBEAT_INTERVAL; // BPM
      lastHeartbeat = millis();
      Serial.print("Frequência cardíaca: ");
      Serial.print(heartRate);
      Serial.println(" BPM");
    }

    // Leitura do GPS
    while (gpsSerial.available() > 0) {
      if (gps.encode(gpsSerial.read())) {
        if (gps.location.isValid()) {
          Serial.print("Latitude: ");
          Serial.print(gps.location.lat(), 6);
          Serial.print(" Longitude: ");
          Serial.println(gps.location.lng(), 6);
        }
      }
    }
 
  enviarDadosParaFirebase(currentTagID, isMoving);
}

void enviarDadosParaFirebase(String driver, bool moving) {
  FirebaseJson json;

  // Dados do GPS
  if (gps.location.isValid()) {
    json.set("latitude", gps.location.lat());
    json.set("longitude", gps.location.lng());
  } else {
    json.set("latitude", 0.0);
    json.set("longitude", 0.0);
  }

  // Dados do MPU6050
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  json.set("mpu_accel_x", a.acceleration.x);
  json.set("mpu_accel_y", a.acceleration.y);
  json.set("mpu_accel_z", a.acceleration.z);
  json.set("mpu_gyro_x", g.gyro.x);
  json.set("mpu_gyro_y", g.gyro.y);
  json.set("mpu_gyro_z", g.gyro.z);
  json.set("mpu_temperature", temp.temperature);
  json.set("is_moving", moving);

  // Dados do AD8232 (ajustado para leitura simples)
  int heartRate = analogRead(AD8232_OUT);
  //json.set("ad8232_alerta", alerta);
  json.set("heart_rate", heartRate);

  String databasePath = "/drivers/" + driver;
  if (Firebase.RTDB.setJSON(&fbdo, databasePath.c_str(), &json)) {
    Serial.println("[OK] - Dados (*GPS, *MPU, AD8232) enviados para: " + databasePath);
  } else {
    Serial.println(fbdo.errorReason());
  }
  delay(1000);
}
