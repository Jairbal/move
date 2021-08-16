#include <Arduino.h>
#include <WiFi.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>

Adafruit_MPU6050 mpu;

sensors_event_t a, g, temp;

float gyroX, gyroY, gyroZ;
float accX, accY, accZ;
float temperature;

//Gyroscope sensor deviation
float gyroXerror = 0.07;
float gyroYerror = 0.03;
float gyroZerror = 0.01;



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
const char* mqtt_server = "192.168.0.103";
// PORT MQTT
const int mqtt_port = 1883;

String agentId = "de50b458-2833-411a-aa93-e54227bef6ea";

// PubSubClient
WiFiClient espClient;
PubSubClient client(espClient);
void callback(char* topic, byte* payload, unsigned int length);
void reconnect();
void setup_wifi();


/**********************************************************
*****              INICIALIZACION MPU              *****
***********************************************************/

// Init MPU6050
void initMPU(){
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setBufferSize(2048);
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  initMPU();

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

void loop() {
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
    mpu.getEvent(&a, &g, &temp);
    // Get current acceleration values
    accX = a.acceleration.x;
    accY = a.acceleration.y;
    accZ = a.acceleration.z;

    X["type"] = "X";
    Y["type"] = "Y";
    X["value"] = accX;
    Y["value"] = accY;

    metrics.add(X);
    metrics.add(Y);

    char buffer[2048];
    size_t n = serializeJson(JSONMessage, buffer);

    client.publish("agent/message", buffer, n);

    delay(150);
  }
  client.loop();
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
