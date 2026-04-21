#include "RS485Protocol.h"

RS485Protocol::RS485Protocol(Stream& serial, uint8_t deviceAddress)
    : _serial(serial), _address(deviceAddress), _lastError(OK) {}

void RS485Protocol::setAddress(uint8_t deviceAddress) { _address = deviceAddress; }

uint8_t RS485Protocol::getAddress() const { return _address; }

int RS485Protocol::getLastError() const { return _lastError; }

bool RS485Protocol::readHoldingRegisters(uint16_t startAddress,
                                         uint16_t count,
                                         uint16_t* outValues,
                                         uint16_t timeoutMs) {
  if (count == 0 || outValues == NULL) {
    _lastError = ERR_INVALID_PARAM;
    return false;
  }

  uint8_t req[8];
  req[0] = _address;
  req[1] = 0x03;
  req[2] = (uint8_t)(startAddress >> 8);
  req[3] = (uint8_t)(startAddress & 0xFF);
  req[4] = (uint8_t)(count >> 8);
  req[5] = (uint8_t)(count & 0xFF);
  uint16_t crc = crc16Modbus(req, 6);
  req[6] = (uint8_t)(crc & 0xFF);
  req[7] = (uint8_t)((crc >> 8) & 0xFF);

  flushInput();
  _serial.write(req, sizeof(req));
  // RS485 半双工：等发送离开总线后再收应答；@9600 约 3.5 字符时间 ≈4ms，WK2132 亦需留出发送完成时间
  delayMicroseconds(5000);

  const uint8_t expectBytes = (uint8_t)(count * 2);
  const uint8_t respLen = (uint8_t)(5 + expectBytes);
  uint8_t resp[64];
  if (respLen > sizeof(resp)) {
    _lastError = ERR_INVALID_PARAM;
    return false;
  }

  if (!readBytes(resp, respLen, timeoutMs)) {
    _lastError = ERR_TIMEOUT;
    flushInput();
    return false;
  }
  if (resp[0] != _address) {
    _lastError = ERR_ADDR_MISMATCH;
    flushInput();
    return false;
  }
  if (resp[1] != 0x03) {
    _lastError = ERR_FUNC_MISMATCH;
    flushInput();
    return false;
  }
  if (resp[2] != expectBytes) {
    _lastError = ERR_BYTE_COUNT_MISMATCH;
    flushInput();
    return false;
  }

  uint16_t calcCrc = crc16Modbus(resp, (uint8_t)(respLen - 2));
  uint16_t recvCrc = (uint16_t)(((uint16_t)resp[respLen - 1] << 8) | resp[respLen - 2]);
  if (calcCrc != recvCrc) {
    _lastError = ERR_CRC_MISMATCH;
    flushInput();
    return false;
  }

  for (uint8_t i = 0; i < count; i++) {
    outValues[i] = (uint16_t)(((uint16_t)resp[3 + i * 2] << 8) | resp[4 + i * 2]);
  }

  _lastError = OK;
  return true;
}

int16_t RS485Protocol::toSigned16(uint16_t value) { return (int16_t)value; }

float RS485Protocol::scaleX10Signed(uint16_t value) { return toSigned16(value) / 10.0f; }

float RS485Protocol::scaleX10Unsigned(uint16_t value) { return value / 10.0f; }

uint16_t RS485Protocol::crc16Modbus(const uint8_t* data, uint8_t len) {
  uint16_t crc = 0xFFFF;
  for (uint8_t i = 0; i < len; i++) {
    crc ^= data[i];
    for (uint8_t bit = 0; bit < 8; bit++) {
      if (crc & 0x0001) {
        crc >>= 1;
        crc ^= 0xA001;
      } else {
        crc >>= 1;
      }
    }
  }
  return crc;
}

bool RS485Protocol::readBytes(uint8_t* buf, size_t len, uint16_t timeoutMs) {
  size_t offset = 0;
  unsigned long start = millis();
  while (offset < len) {
    while (_serial.available() && offset < len) {
      int c = _serial.read();
      if (c >= 0) buf[offset++] = (uint8_t)c;
    }
    if ((unsigned long)(millis() - start) > timeoutMs) return false;
  }
  return true;
}

void RS485Protocol::flushInput() {
  while (_serial.available()) {
    _serial.read();
  }
}
