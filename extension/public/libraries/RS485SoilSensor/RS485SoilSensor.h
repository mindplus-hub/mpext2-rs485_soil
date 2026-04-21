#ifndef RS485_SOIL_SENSOR_H
#define RS485_SOIL_SENSOR_H

#include <Arduino.h>
#include "RS485Protocol.h"

class RS485SoilSensor {
 public:
  explicit RS485SoilSensor(Stream& serial, uint8_t deviceAddress = 0x01);

  void setAddress(uint8_t deviceAddress);
  uint8_t getAddress() const;
  int getLastError() const;

  // Step 1: update cache (returns true if read success)
  bool updateSoilMoistureTemperature();       // SEN0600
  bool updateSoilMoistureTemperatureEc();     // SEN0601
  bool updateSoilMoistureTemperaturePh();     // SEN0602
  bool updateSoilEcPh();                      // SEN0603
  bool updateSoilMoistureTemperatureEcPh();   // SEN0604
  bool updateSoilNpk();                       // SEN0605

  // One-shot read APIs: read once and output values directly
  bool readSoilMoistureTemperature(float& humidity, float& temperature);
  bool readSoilMoistureTemperatureEc(float& humidity, float& temperature, uint16_t& ec);
  bool readSoilMoistureTemperaturePh(float& humidity, float& temperature, float& ph);
  bool readSoilEcPh(uint16_t& ec, float& ph);
  bool readSoilMoistureTemperatureEcPh(float& humidity, float& temperature, uint16_t& ec, float& ph);
  bool readSoilNpk(uint16_t& n, uint16_t& p, uint16_t& k);

  // Step 2: get cached values
  float getHumidity() const;
  float getTemperature() const;
  uint16_t getEc() const;
  float getPh() const;
  uint16_t getN() const;
  uint16_t getP() const;
  uint16_t getK() const;

 private:
  RS485Protocol _protocol;
  float _humidity;
  float _temperature;
  uint16_t _ec;
  float _ph;
  uint16_t _n;
  uint16_t _p;
  uint16_t _k;
};

#endif
