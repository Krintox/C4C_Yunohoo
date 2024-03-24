#include "ACS712.h"
#include <ZMPT101B.h>
#include <ThingSpeak.h>
#include "WiFi.h"

#define SENSITIVITY 500.0f
#define CHANNEL_ID CHANNEL_ID
#define API_KEY ""

ZMPT101B voltageSensor(19, 50.0);
ACS712 ACS(18, 5.0, 1023, 100);
WiFiClient client;

void setup() {
  Serial.begin(115200);
  while (!Serial);
  Serial.println(_FILE_);
  Serial.print("ACS712_LIB_VERSION: ");
  Serial.println(ACS712_LIB_VERSION);

  ThingSpeak.begin(client);

  voltageSensor.setSensitivity(SENSITIVITY);
}

void loop() {
  int mA = ACS.mA_AC_sampling();
  float voltage = voltageSensor.getRmsVoltage();
Serial.println(voltage);
Serial.println(mA);
  ThingSpeak.writeField(CHANNEL_ID, 1, mA, API_KEY); // Field 1: AC Current
  ThingSpeak.writeField(CHANNEL_ID, 2, voltage, API_KEY); // Field 2: AC Voltage
  
  delay(1500); // Delay for 15 seconds
}