import ArgumentType from '../utils/argument-type';
import BlockType from '../utils/block-type';
import func from './func';
import { setLocaleData, formatMessage, setLocale } from '../utils/translation';
import LocaleData from './locales';
import menuIconURI from './icon/menuIcon.svg';
import blockIconURI from './icon/blockIcon.svg';

setLocaleData(LocaleData);

class RS485SoilExtension {
    constructor(runtime, extensionId) {
        this.runtime = runtime;
        this.funcs = new func(runtime, extensionId);
    }

    setLocale(locale) {
        setLocale(locale);
    }

    /** Combine UART and DIP address as `channel_IA1IA0` (e.g. 1_11). */
    getChannelAddrMenu() {
        const rows = [
            ['1_11', 'gui.blocklyText.rs485soil.channelAddr.port_1_11', 'UART1 · Addr 1 (IA1=1 IA0=1)'],
            ['1_01', 'gui.blocklyText.rs485soil.channelAddr.port_1_01', 'UART1 · Addr 2 (IA1=0 IA0=1)'],
            ['1_10', 'gui.blocklyText.rs485soil.channelAddr.port_1_10', 'UART1 · Addr 3 (IA1=1 IA0=0)'],
            ['1_00', 'gui.blocklyText.rs485soil.channelAddr.port_1_00', 'UART1 · Addr 4 (IA1=0 IA0=0)'],
            ['2_11', 'gui.blocklyText.rs485soil.channelAddr.port_2_11', 'UART2 · Addr 1 (IA1=1 IA0=1)'],
            ['2_01', 'gui.blocklyText.rs485soil.channelAddr.port_2_01', 'UART2 · Addr 2 (IA1=0 IA0=1)'],
            ['2_10', 'gui.blocklyText.rs485soil.channelAddr.port_2_10', 'UART2 · Addr 3 (IA1=1 IA0=0)'],
            ['2_00', 'gui.blocklyText.rs485soil.channelAddr.port_2_00', 'UART2 · Addr 4 (IA1=0 IA0=0)']
        ];
        return rows.map(([value, id, def]) => ({
            text: formatMessage({ id, default: def }),
            value
        }));
    }

    getCodePrimitives() {
        return this.funcs;
    }

    getInfo() {
        return {
            name: formatMessage({
                id: 'extension.name',
                default: 'RS485 Soil Sensors'
            }),
            menuIconURI,
            blockIconURI,
            blockIconWidth: 50,
            blockIconHeight: 40,
            color1: '#2D7D9A',
            color2: '#276F88',
            color3: '#1F5E74',
            blocks: [
                // {
                //     opcode: 'initRs485Soil',
                //     text: formatMessage({
                //         id: 'gui.blocklyText.rs485soil.initRs485Soil',
                //         default: 'initialize RS485 soil sensor [CHANNEL_ADDR] baud [BAUD]'
                //     }),
                //     blockType: BlockType.COMMAND,
                //     group: formatMessage({
                //         id: 'gui.blocklyText.rs485soil.groupInit',
                //         default: 'Initialization'
                //     }),
                //     arguments: {
                //         CHANNEL_ADDR: {
                //             type: ArgumentType.STRING,
                //             menu: 'CHANNEL_ADDR_MENU',
                //             defaultValue: '1_11'
                //         },
                //         BAUD: {
                //             type: ArgumentType.STRING,
                //             menu: 'BAUD_MENU',
                //             defaultValue: '115200'
                //         }
                //     }
                // },
                {
                    blockType: BlockType.SUBMENU,
                    id: 'sen0600',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.submenu.sen0600',
                        default: 'SEN0600 Moisture + Temperature'
                    })
                },
                {
                    blockType: BlockType.SUBMENU,
                    id: 'sen0601',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.submenu.sen0601',
                        default: 'SEN0601 Moisture + Temperature + EC'
                    })
                },
                {
                    blockType: BlockType.SUBMENU,
                    id: 'sen0602',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.submenu.sen0602',
                        default: 'SEN0602 Moisture + Temperature + PH'
                    })
                },
                {
                    blockType: BlockType.SUBMENU,
                    id: 'sen0603',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.submenu.sen0603',
                        default: 'SEN0603 EC + PH'
                    })
                },
                {
                    blockType: BlockType.SUBMENU,
                    id: 'sen0604',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.submenu.sen0604',
                        default: 'SEN0604 Moisture + Temperature + EC + PH'
                    })
                },
                {
                    blockType: BlockType.SUBMENU,
                    id: 'sen0605',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.submenu.sen0605',
                        default: 'SEN0605 NPK'
                    })
                },
                {
                    opcode: 'readMoistureTempToVars',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.readMoistureTempToVars',
                        default: '[CHANNEL_ADDR] read moisture+temperature once'
                    }),
                    blockType: BlockType.COMMAND,

                    submenuId: 'sen0600',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'updateMoistureTempEc',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.updateMoistureTempEc',
                        default: '[CHANNEL_ADDR] read moisture+temperature+EC once'
                    }),
                    blockType: BlockType.COMMAND,

                    submenuId: 'sen0601',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'updateMoistureTempPh',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.updateMoistureTempPh',
                        default: '[CHANNEL_ADDR] read moisture+temperature+PH once'
                    }),
                    blockType: BlockType.COMMAND,

                    submenuId: 'sen0602',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'updateEcPh',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.updateEcPh',
                        default: '[CHANNEL_ADDR] read EC+PH once'
                    }),
                    blockType: BlockType.COMMAND,

                    submenuId: 'sen0603',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'updateMoistureTempEcPh',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.updateMoistureTempEcPh',
                        default: '[CHANNEL_ADDR] read moisture+temperature+EC+PH once'
                    }),
                    blockType: BlockType.COMMAND,

                    submenuId: 'sen0604',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'updateNpk',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.updateNpk',
                        default: '[CHANNEL_ADDR] read NPK once'
                    }),
                    blockType: BlockType.COMMAND,

                    submenuId: 'sen0605',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getTemperatureSen0600',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getTemperatureSen0600.getTemperature',
                        default: 'temperature (C)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0600'
                },
                {
                    opcode: 'getHumiditySen0600',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getHumiditySen0600.getHumidity',
                        default: 'humidity (%RH)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0600'
                },

                {
                    opcode: 'getTemperatureSen0601',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getTemperatureSen0601.getTemperature',
                        default: 'temperature (C)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0601',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getHumiditySen0601',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getHumiditySen0601.getHumidity',
                        default: 'humidity (%RH)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0601',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },

                {
                    opcode: 'getEcSen0601',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getEcSen0601.getEc',
                        default: 'EC (us/cm)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0601',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getTemperatureSen0602',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getTemperatureSen0602.getTemperature',
                        default: 'temperature (C)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0602',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getHumiditySen0602',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getHumiditySen0602.getHumidity',
                        default: 'humidity (%RH)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0602',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getPhSen0602',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getPhSen0602.getPh',
                        default: 'PH value'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0602',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getEcSen0603',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getEcSen0603.getEc',
                        default: 'EC (us/cm)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0603',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getPhSen0603',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getPhSen0603.getPh',
                        default: 'PH value'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0603',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getTemperatureSen0604',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getTemperatureSen0604.getTemperature',
                        default: 'temperature (C)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0604',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getHumiditySen0604',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getHumiditySen0604.getHumidity',
                        default: 'humidity (%RH)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0604',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },

                {
                    opcode: 'getEcSen0604',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getEcSen0604.getEc',
                        default: 'EC (us/cm)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0604',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getPhSen0604',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getPhSen0604.getPh',
                        default: 'PH value'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0604',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getN',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getNSen0605.getN',
                        default: 'N content (mg/kg)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0605',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getP',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getPSen0605.getP',
                        default: 'P content (mg/kg)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0605',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                },
                {
                    opcode: 'getK',
                    text: formatMessage({
                        id: 'gui.blocklyText.rs485soil.getKSen0605.getK',
                        default: 'K content (mg/kg)'
                    }),
                    blockType: BlockType.REPORTER,

                    submenuId: 'sen0605',
                    arguments: {
                        CHANNEL_ADDR: {
                            type: ArgumentType.STRING,
                            menu: 'CHANNEL_ADDR_MENU',
                            defaultValue: '1_11'
                        }
                    }
                }
            ],
            menus: {
                CHANNEL_ADDR_MENU: this.getChannelAddrMenu(),
                BAUD_MENU: ['9600']
            }
        };
    }
}

export default RS485SoilExtension;
