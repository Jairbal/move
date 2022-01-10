// CONEXIONES ESP32
// GND - GND
// VCC - VCC
// SDA - 21
// SCL - 22
// INT - 18

// CONEXIONES ARDUINO NANO
// GND - GND
// VCC - VCC
// SDA - Pin A4
// SCL - Pin A5
// INT - Pin 2

#include <Arduino.h>
#include <WiFi.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>

#include "I2Cdev.h"
#include "MPU6050_6Axis_MotionApps20.h"
#if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
#include "Wire.h"
#endif

// class default I2C address is 0x68
// specific I2C addresses may be passed as a parameter here
// AD0 low = 0x68
// AD0 high = 0x69
MPU6050 mpu;
//MPU6050 mpu(0x69); // <-- use for AD0 high

#define INTERRUPT_PIN 18
#define LED_PIN 13
bool blinkState = false;

// MPU control/status vars
bool dmpReady = false;  // set true if DMP init was successful
uint8_t mpuIntStatus;   // holds actual interrupt status byte from MPU
uint8_t devStatus;      // return status after each device operation (0 = success, !0 = error)
uint16_t packetSize;    // expected DMP packet size (default is 42 bytes)
uint16_t fifoCount;     // count of all bytes currently in FIFO
uint8_t fifoBuffer[64]; // FIFO storage buffer

Quaternion q;           // [w, x, y, z]
VectorInt16 aa;         // [x, y, z]
VectorInt16 aaReal;     // [x, y, z]
VectorInt16 aaWorld;    // [x, y, z]
VectorFloat gravity;    // [x, y, z]
float ypr[3];           // [yaw, pitch, roll]

volatile bool mpuInterrupt = false;
void dmpDataReady() {
  mpuInterrupt = true;
}

/**********************************************************
*****              CONFIGURACIÓN WIFI              *****
***********************************************************/
//const char* ssid = "PUNTONET_ANDREA";
//const char* password = "isca1999";
const char* ssid = "fg5df";
const char* password = "a0b9c8d7e6f5";
/**********************************************************
*****              CONFIGURACIÓN MQTT              *****
***********************************************************/
// HOST MQTT
const char* mqtt_server = "192.168.0.105";
// PORT MQTT
const int mqtt_port = 1883;

String agentId = "de50b458-2833-411a-aa93-e54227bef6ea";

// PubSubClient
WiFiClient espClient;
PubSubClient client(espClient);
void callback(char* topic, byte* payload, unsigned int length);
void reconnect();
void setup_wifi();

void setup() {
  // join I2C bus (I2Cdev library doesn't do this automatically)
#if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
  Wire.begin();
  Wire.setClock(400000); // 400kHz I2C clock. Comment this line if having compilation difficulties
#elif I2CDEV_IMPLEMENTATION == I2CDEV_BUILTIN_FASTWIRE
  Fastwire::setup(400, true);
#endif

  Serial.begin(115200);
  setup_wifi();
  client.setBufferSize(2048);
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  // Iniciar MPU6050
  Serial.println(F("Initializing I2C devices..."));
  mpu.initialize();
  pinMode(INTERRUPT_PIN, INPUT);

  // Comprobar  conexion
  Serial.println(F("Testing device connections..."));
  Serial.println(mpu.testConnection() ? F("MPU6050 connection successful") : F("MPU6050 connection failed"));

  // Iniciar DMP
  Serial.println(F("Initializing DMP..."));
  devStatus = mpu.dmpInitialize();

  // Valores de calibracion
  mpu.setXGyroOffset(34);
  mpu.setYGyroOffset(-39);
  mpu.setZGyroOffset(82);
  mpu.setZAccelOffset(1245);

  // Activar DMP
  if (devStatus == 0) {
    Serial.println(F("Enabling DMP..."));
    mpu.setDMPEnabled(true);

    // Activar interrupcion
    attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), dmpDataReady, RISING);
    mpuIntStatus = mpu.getIntStatus();

    Serial.println(F("DMP ready! Waiting for first interrupt..."));
    dmpReady = true;

    // get expected DMP packet size for later comparison
    packetSize = mpu.dmpGetFIFOPacketSize();
  } else {
    // ERROR!
    // 1 = initial memory load failed
    // 2 = DMP configuration updates failed
    // (if it's going to break, usually the code will be 1)
    Serial.print(F("DMP Initialization failed (code "));
    Serial.print(devStatus);
    Serial.println(F(")"));
  }
}

void setup_wifi() {
  delay(10);
  // Nos conectamos a nuestra red Wifi
  Serial.println();
  Serial.print("Conectando a ssid: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("Conectado a red WiFi!");
  Serial.println("Dirección IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {

  while (!client.connected()) {
    Serial.print("Intentando conexión Mqtt...");
    // Intentamos conectar
    if (client.connect(agentId.c_str())) {
      Serial.println("Conectado!");
      // Nos suscribimos
      if (client.subscribe("agent/connected")) {
        Serial.println("Suscripcion ok (agent/connected)");
      } else {
        Serial.println("fallo Suscripciión (agent/connected)");
      }

      if (client.subscribe("agent/message")) {
        Serial.println("Suscripcion ok (agent/message)");
      } else {
        Serial.println("fallo Suscripciión (agent/message)");
      }

      if (client.subscribe("agent/disconnected")) {
        Serial.println("Suscripcion ok (agent/disconnected)");
      } else {
        Serial.println("fallo Suscripciión (agent/disconnected)");
      }
    } else {
      Serial.print("falló :( con error -> ");
      Serial.print(client.state());
      Serial.println(" Intentamos de nuevo en 5 segundos");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String incoming = "";
  Serial.print("Mensaje recibido desde -> ");
  Serial.print(topic);
  Serial.println("");
  for (int i = 0; i < length; i++) {
    incoming += (char)payload[i];
  }
  incoming.trim();
  Serial.println("Mensaje -> " + incoming);

}

void loop() {

  // Si fallo al iniciar, parar programa
  if (!dmpReady) return;

  // Ejecutar mientras no hay interrupcion
  while (!mpuInterrupt && fifoCount < packetSize) {

  }

  mpuInterrupt = false;
  mpuIntStatus = mpu.getIntStatus();

  // Obtener datos del FIFO
  fifoCount = mpu.getFIFOCount();

  // Controlar overflow
  if ((mpuIntStatus & 0x10) || fifoCount == 1024) {
    mpu.resetFIFO();
  }
  else if (mpuIntStatus & 0x02) {
    // wait for correct available data length, should be a VERY short wait
    while (fifoCount < packetSize) fifoCount = mpu.getFIFOCount();

    // read a packet from FIFO
    mpu.getFIFOBytes(fifoBuffer, packetSize);

    // track FIFO count here in case there is > 1 packet available
    // (this lets us immediately read more without waiting for an interrupt)
    fifoCount -= packetSize;

  }

  /**********************************************************
  *****              CONFIGURACIÓN JSON              *****
  ***********************************************************/
  DynamicJsonDocument JSONMessage(2048);
  StaticJsonDocument<512> X;
  StaticJsonDocument<512> Y;
  JsonObject agent = JSONMessage.createNestedObject("agent");
  JsonArray metrics = JSONMessage.createNestedArray("metrics");

  agent["username"] = "disp1";
  agent["name"] = "disp1";
  agent["pid"] = "000000";
  agent["uuid"] = agentId;
  agent["hostname"] = "disp1";

  if (!client.connected()) {
    reconnect();
  }

  if (client.connected()) {
    mpu.dmpGetQuaternion(&q, fifoBuffer);
    mpu.dmpGetGravity(&gravity, &q);
    mpu.dmpGetYawPitchRoll(ypr, &q, &gravity);

    X["type"] = "X";
    Y["type"] = "Y";
    // MOVIMIENTO HORIZONTAL
    X["value"] = (ypr[0] * 180 / M_PI);
    // MOVIMIENTO VERTICAL
    Y["value"] = (ypr[2] * 180 / M_PI);

    metrics.add(X);
    metrics.add(Y);

    char buffer[2048];
    size_t n = serializeJson(JSONMessage, buffer);

    client.publish("agent/message", buffer, n);

    delay(10);
  }
  client.loop();

}
