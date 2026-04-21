class func {
    constructor(runtime, extensionId) {
        this.runtime = runtime;
        this.extensionId = extensionId;
        /** Last soil object used by a「获取一次数据」command; round reporters without port use this. */
        this._sen0600LastSoilVar = null;
        this._sen0601LastSoilVar = null;
        this._sen0602LastSoilVar = null;
        this._sen0603LastSoilVar = null;
        this._sen0604LastSoilVar = null;
        this._sen0605LastSoilVar = null;
    }

    /**
     * Parse combined menu value `channel_addrBits`, e.g. `1_11` → UART1 + IA1/IA0 bits.
     * @returns {{ channel: string, addrBits: string } | null}
     */
    parseChannelAddr(code) {
        if (code == null || code === '') return null;
        const s = String(code).trim();
        const i = s.indexOf('_');
        if (i <= 0 || i >= s.length - 1) return null;
        const channel = s.slice(0, i);
        const addrBits = s.slice(i + 1);
        if (!/^[12]$/.test(channel) || !/^[01]{2}$/.test(addrBits)) return null;
        return { channel, addrBits };
    }

    getChannelAndAddrBits(parameter) {
        const fromCombo = this.parseChannelAddr(parameter?.CHANNEL_ADDR?.code);
        if (fromCombo) return fromCombo;
        const channel = parameter?.CHANNEL?.code || '1';
        const addrBits = parameter?.ADDR_BITS?.code || '11';
        return { channel, addrBits };
    }

    getSoilVarName(parameter) {
        const { channel, addrBits } = this.getChannelAndAddrBits(parameter);
        const ia1 = addrBits.charAt(0);
        const ia0 = addrBits.charAt(1);
        return `soil_${channel}${ia1}${ia0}`;
    }


    /**
     * 声明 IIC 串口、RS485SoilSensor、Wire.begin、子串口波特率。
     * DFRobot 土壤传感器出厂 Modbus 默认 9600（见 SEN0600/SEN0602 wiki），故默认 baud 用 9600。
     * @returns {string} soilVar 名，如 soil_111
     */
    addRs485SoilHardware(generator, parameter) {
        const { channel, addrBits } = this.getChannelAndAddrBits(parameter);
        const ia1 = addrBits.charAt(0);
        const ia0 = addrBits.charAt(1);
        const baud = parameter?.BAUD?.code ?? '9600';
        const serialVar = `iic_${channel}${ia1}${ia0}`;
        const soilVar = `soil_${channel}${ia1}${ia0}`;


        generator.addInclude('Wire.h');
        generator.addInclude('DFRobot_IICSerial.h');
        generator.addInclude('RS485Protocol.h');
        generator.addInclude('RS485SoilSensor.h');

        generator.addObject(
            `object_${serialVar}`,
            `DFRobot_IICSerial ${serialVar}(Wire, SUBUART_CHANNEL_${channel}, /*IA1=*/${ia1}, /*IA0=*/${ia0});`,
            true
        );
        generator.addObject(
            `object_${soilVar}`,
            `RS485SoilSensor ${soilVar}(${serialVar}, 1);`,
            true
        );

        generator.addSetup('setup_wire_begin', 'Wire.begin();', 9, true);
        generator.addSetup(`setup_rs485_begin${serialVar}`, `${serialVar}.begin(${baud});`, 8);
        return soilVar;
    }


    setDeviceAddress(generator, block, parameter) {
        const address = parameter.ADDRESS.code;
        return `soil_A.setAddress(${address});\n`;
    }

    readMoistureTempToVars(generator, block, parameter) {
        const soilVar = this.addRs485SoilHardware(generator, parameter);
        this._sen0600LastSoilVar = soilVar;
        return `${soilVar}.updateSoilMoistureTemperature();\n`;
    }

    updateMoistureTempEc(generator, block, parameter) {
        const soilVar = this.addRs485SoilHardware(generator, parameter);
        this._sen0601LastSoilVar = soilVar;
        return `${soilVar}.updateSoilMoistureTemperatureEc();\n`;
    }

    updateMoistureTempPh(generator, block, parameter) {
        const soilVar = this.addRs485SoilHardware(generator, parameter);
        this._sen0602LastSoilVar = soilVar;
        return `${soilVar}.updateSoilMoistureTemperaturePh();\n`;
    }

    updateEcPh(generator, block, parameter) {
        const soilVar = this.addRs485SoilHardware(generator, parameter);
        this._sen0603LastSoilVar = soilVar;
        return `${soilVar}.updateSoilEcPh();\n`;
    }

    updateMoistureTempEcPh(generator, block, parameter) {
        const soilVar = this.addRs485SoilHardware(generator, parameter);
        this._sen0604LastSoilVar = soilVar;
        return `${soilVar}.updateSoilMoistureTemperatureEcPh();\n`;
    }

    updateNpk(generator, block, parameter) {
        const soilVar = this.addRs485SoilHardware(generator, parameter);
        this._sen0605LastSoilVar = soilVar;
        return `${soilVar}.updateSoilNpk();\n`;
    }

    getHumiditySen0600(generator, block, parameter) {
        const soilVar = this._sen0600LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getHumidity()`, generator.ORDER_ATOMIC];
    }

    getTemperatureSen0600(generator, block, parameter) {
        const soilVar = this._sen0600LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getTemperature()`, generator.ORDER_ATOMIC];
    }

    getHumiditySen0601(generator, block, parameter) {
        const soilVar = this._sen0601LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getHumidity()`, generator.ORDER_ATOMIC];
    }

    getTemperatureSen0601(generator, block, parameter) {
        const soilVar = this._sen0601LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getTemperature()`, generator.ORDER_ATOMIC];
    }

    getHumiditySen0602(generator, block, parameter) {
        const soilVar = this._sen0602LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getHumidity()`, generator.ORDER_ATOMIC];
    }

    getTemperatureSen0602(generator, block, parameter) {
        const soilVar = this._sen0602LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getTemperature()`, generator.ORDER_ATOMIC];
    }

    getEcSen0601(generator, block, parameter) {
        const soilVar = this._sen0601LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getEc()`, generator.ORDER_ATOMIC];
    }

    getEc(generator, block, parameter) {
        const soilVar = this._sen0603LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getEc()`, generator.ORDER_ATOMIC];
    }

    getEcSen0603(generator, block, parameter) {
        const soilVar = this._sen0603LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getEc()`, generator.ORDER_ATOMIC];
    }

    getPhSen0602(generator, block, parameter) {
        const soilVar = this._sen0602LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getPh()`, generator.ORDER_ATOMIC];
    }

    getPh(generator, block, parameter) {
        const soilVar = this._sen0603LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getPh()`, generator.ORDER_ATOMIC];
    }

    getPhSen0603(generator, block, parameter) {
        const soilVar = this._sen0603LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getPh()`, generator.ORDER_ATOMIC];
    }

    getHumiditySen0604(generator, block, parameter) {
        const soilVar = this._sen0604LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getHumidity()`, generator.ORDER_ATOMIC];
    }

    getTemperatureSen0604(generator, block, parameter) {
        const soilVar = this._sen0604LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getTemperature()`, generator.ORDER_ATOMIC];
    }

    getEcSen0604(generator, block, parameter) {
        const soilVar = this._sen0604LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getEc()`, generator.ORDER_ATOMIC];
    }

    getPhSen0604(generator, block, parameter) {
        const soilVar = this._sen0604LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getPh()`, generator.ORDER_ATOMIC];
    }

    getN(generator, block, parameter) {
        const soilVar = this._sen0605LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getN()`, generator.ORDER_ATOMIC];
    }

    getP(generator, block, parameter) {
        const soilVar = this._sen0605LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getP()`, generator.ORDER_ATOMIC];
    }

    getK(generator, block, parameter) {
        const soilVar = this._sen0605LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getK()`, generator.ORDER_ATOMIC];
    }

    getLastError(generator, block, parameter) {
        const soilVar = this._sen0605LastSoilVar || this.getSoilVarName(parameter);
        return [`${soilVar}.getLastError()`, generator.ORDER_ATOMIC];
    }
}

export default func;
