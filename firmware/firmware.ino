#include <WiFi.h>
#include <HTTPClient.h>
#include <TinyGPS++.h>

// -------------------- Configuration --------------------
// Boat Number (Unique to this device)
const int BOAT_NUMBER = 1;

// WiFi Credentials
const char* WIFI_SSID = "Shetr";
const char* WIFI_PASS = "shettybros";

// FastAPI Server
// Replace with the IP of the machine running the backend
const char* SERVER_URL = "http://192.168.0.106:8000/update";

// -------------------- Hardware Pins --------------------
// GPS uses HardwareSerial 2 (GPIO16 = RX2, GPIO17 = TX2)
#define GPS_RX_PIN 16
#define GPS_TX_PIN 17

// Float Sensor (LOW = Water detected = EMERGENCY)
#define FLOAT_SENSOR_PIN 18

// -------------------- Globals --------------------
TinyGPSPlus gps;
HardwareSerial GPS(2);
unsigned long lastUpload = 0;

void setup()
{
    Serial.begin(115200);

    // Initialize Float Sensor Pin
    pinMode(FLOAT_SENSOR_PIN, INPUT_PULLUP);

    // Initialize GPS
    GPS.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

    // Initialize WiFi
    Serial.println("Connecting to WiFi...");
    WiFi.begin(WIFI_SSID, WIFI_PASS);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println();
    Serial.println("WiFi Connected successfully!");
    Serial.print("ESP32 IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.println("System Initialized. Waiting for GPS fix...");
}

void loop()
{
    // 1. Continuously feed GPS data to TinyGPS++
    while (GPS.available())
    {
        gps.encode(GPS.read());
    }

    // 2. Read sensor state
    int sensorState = digitalRead(FLOAT_SENSOR_PIN);
    bool emergency = (sensorState == LOW);

    // 3. Determine upload frequency
    // SAFE = 30 seconds, EMERGENCY = 5 seconds
    unsigned long uploadInterval = emergency ? 5000 : 30000;

    // 4. Upload Data
    if (millis() - lastUpload >= uploadInterval)
    {
        lastUpload = millis(); // Reset timer

        // Only upload if we have a valid GPS fix
        if (gps.location.isValid())
        {
            float latitude = gps.location.lat();
            float longitude = gps.location.lng();

            if (WiFi.status() == WL_CONNECTED)
            {
                HTTPClient http;
                http.begin(SERVER_URL);
                http.addHeader("Content-Type", "application/json");

                // Construct JSON Payload manually to avoid ArduinoJson dependency overhead
                String jsonData = "{";
                jsonData += "\"boat_no\":" + String(BOAT_NUMBER) + ",";
                jsonData += "\"status\":" + String(emergency ? 1 : 0) + ",";
                jsonData += "\"latitude\":" + String(latitude, 6) + ",";
                jsonData += "\"longitude\":" + String(longitude, 6);
                jsonData += "}";

                int httpResponseCode = http.POST(jsonData);

                // Diagnostic output
                Serial.println("================================");
                Serial.print("Boat: #"); Serial.println(BOAT_NUMBER);
                Serial.print("Lat: "); Serial.println(latitude, 6);
                Serial.print("Lng: "); Serial.println(longitude, 6);
                Serial.print("Status: ");
                Serial.println(emergency ? "EMERGENCY" : "SAFE");
                Serial.print("HTTP Code: "); Serial.println(httpResponseCode);
                Serial.println("================================");

                http.end();
            }
            else
            {
                Serial.println("Error: WiFi Disconnected. Attempting to reconnect...");
                WiFi.reconnect();
            }
        }
        else
        {
            Serial.println("Waiting for GPS Fix...");
        }
    }
}
