#include "RS485SoilSensor.h"

RS485SoilSensor::RS485SoilSensor(Stream& serial, uint8_t deviceAddress)
    : _protocol(serial, deviceAddress),
      _humidity(0.0f),
      _temperature(0.0f),
      _ec(0),
      _ph(0.0f),
      _n(0),
      _p(0),
      _k(0) {}

void RS485SoilSensor::setAddress(uint8_t deviceAddress) { _protocol.setAddress(deviceAddress); }

uint8_t RS485SoilSensor::getAddress() const { return _protocol.getAddress(); }

int RS485SoilSensor::getLastError() const { return _protocol.getLastError(); }

bool RS485SoilSensor::updateSoilMoistureTemperature() {
  uint16_t regs[2];
  if (!_protocol.readHoldingRegisters(0x0000, 2, regs)) return false;
  _humidity = RS485Protocol::scaleX10Unsigned(regs[0]);
  _temperature = RS485Protocol::scaleX10Signed(regs[1]);
  return true;
}

bool RS485SoilSensor::updateSoilMoistureTemperatureEc() {
  uint16_t regs[3];
  if (!_protocol.readHoldingRegisters(0x0000, 3, regs)) return false;
  _humidity = RS485Protocol::scaleX10Unsigned(regs[0]);
  _temperature = RS485Protocol::scaleX10Signed(regs[1]);
  _ec = regs[2];
  return true;
}

bool RS485SoilSensor::updateSoilMoistureTemperaturePh() {
  uint16_t regs[4];
  if (!_protocol.readHoldingRegisters(0x0000, 4, regs)) return false;
  _humidity = RS485Protocol::scaleX10Unsigned(regs[0]);
  _temperature = RS485Protocol::scaleX10Signed(regs[1]);
  _ph = RS485Protocol::scaleX10Unsigned(regs[3]);
  return true;
}

bool RS485SoilSensor::updateSoilEcPh() {
  uint16_t regs[4];
  if (!_protocol.readHoldingRegisters(0x0000, 4, regs)) return false;
  _ec = regs[2];
  _ph = RS485Protocol::scaleX10Unsigned(regs[3]);
  return true;
}

bool RS485SoilSensor::updateSoilMoistureTemperatureEcPh() {
  uint16_t regs[4];
  if (!_protocol.readHoldingRegisters(0x0000, 4, regs)) return false;
  _humidity = RS485Protocol::scaleX10Unsigned(regs[0]);
  _temperature = RS485Protocol::scaleX10Signed(regs[1]);
  _ec = regs[2];
  _ph = RS485Protocol::scaleX10Unsigned(regs[3]);
  return true;
}

bool RS485SoilSensor::updateSoilNpk() {
  uint16_t reg = 0;
  if (!_protocol.readHoldingRegisters(0x001E, 1, &reg)) return false;
  _n = reg;
  if (!_protocol.readHoldingRegisters(0x001F, 1, &reg)) return false;
  _p = reg;
  if (!_protocol.readHoldingRegisters(0x0020, 1, &reg)) return false;
  _k = reg;
  return true;
}

bool RS485SoilSensor::readSoilMoistureTemperature(float& humidity, float& temperature) {
  if (!updateSoilMoistureTemperature()) return false;
  humidity = _humidity;
  temperature = _temperature;
  return true;
}

bool RS485SoilSensor::readSoilMoistureTemperatureEc(float& humidity, float& temperature, uint16_t& ec) {
  if (!updateSoilMoistureTemperatureEc()) return false;
  humidity = _humidity;
  temperature = _temperature;
  ec = _ec;
  return true;
}

bool RS485SoilSensor::readSoilMoistureTemperaturePh(float& humidity, float& temperature, float& ph) {
  if (!updateSoilMoistureTemperaturePh()) return false;
  humidity = _humidity;
  temperature = _temperature;
  ph = _ph;
  return true;
}

bool RS485SoilSensor::readSoilEcPh(uint16_t& ec, float& ph) {
  if (!updateSoilEcPh()) return false;
  ec = _ec;
  ph = _ph;
  return true;
}

bool RS485SoilSensor::readSoilMoistureTemperatureEcPh(float& humidity, float& temperature, uint16_t& ec, float& ph) {
  if (!updateSoilMoistureTemperatureEcPh()) return false;
  humidity = _humidity;
  temperature = _temperature;
  ec = _ec;
  ph = _ph;
  return true;
}

bool RS485SoilSensor::readSoilNpk(uint16_t& n, uint16_t& p, uint16_t& k) {
  if (!updateSoilNpk()) return false;
  n = _n;
  p = _p;
  k = _k;
  return true;
}

float RS485SoilSensor::getHumidity() const { return _humidity; }

float RS485SoilSensor::getTemperature() const { return _temperature; }

uint16_t RS485SoilSensor::getEc() const { return _ec; }

float RS485SoilSensor::getPh() const { return _ph; }

uint16_t RS485SoilSensor::getN() const { return _n; }

uint16_t RS485SoilSensor::getP() const { return _p; }

uint16_t RS485SoilSensor::getK() const { return _k; }
