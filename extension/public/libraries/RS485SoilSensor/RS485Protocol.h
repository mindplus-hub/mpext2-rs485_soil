#ifndef RS485_PROTOCOL_H
#define RS485_PROTOCOL_H

#include <Arduino.h>

class RS485Protocol {
 public:
  enum ErrorCode {
    OK = 0,
    ERR_TIMEOUT = -1,
    ERR_ADDR_MISMATCH = -2,
    ERR_FUNC_MISMATCH = -3,
    ERR_BYTE_COUNT_MISMATCH = -4,
    ERR_CRC_MISMATCH = -5,
    ERR_INVALID_PARAM = -6
  };

  explicit RS485Protocol(Stream& serial, uint8_t deviceAddress = 0x01);

  void setAddress(uint8_t deviceAddress);
  uint8_t getAddress() const;
  int getLastError() const;

  bool readHoldingRegisters(uint16_t startAddress,
                            uint16_t count,
                            uint16_t* outValues,
                            uint16_t timeoutMs = 800);

  static int16_t toSigned16(uint16_t value);
  static float scaleX10Signed(uint16_t value);
  static float scaleX10Unsigned(uint16_t value);

 private:
  Stream& _serial;
  uint8_t _address;
  int _lastError;

  static uint16_t crc16Modbus(const uint8_t* data, uint8_t len);
  bool readBytes(uint8_t* buf, size_t len, uint16_t timeoutMs);
  void flushInput();
};

#endif
