import { AESECB } from './aes'

export class Bike {
    mac: string
    server: BluetoothRemoteGATTServer
    encryptionKey: string
    userKeyId: number
    aesEcb: AESECB

    constructor(mac: string, encryptionKey: string, userKeyId: number, server: BluetoothRemoteGATTServer) {
        this.mac = mac
        this.encryptionKey = encryptionKey
        this.userKeyId = userKeyId
        this.server = server
        this.aesEcb = new AESECB(new Uint8Array(Buffer.from(this.encryptionKey, 'hex')))
    }

    private async makeEncryptedPayload(data: Uint8Array): Promise<Uint8Array> {
        const nonce = new Uint8Array((await this.bluetoothRead(CHALLENGE)).buffer)
        const paddLength = 16 - ((nonce.length + data.length) % 16)
        const dataToEncrypt = new Uint8Array([
            ...nonce,
            ...data,
            ...new Uint8Array(paddLength),
        ])
        return this.aesEcb.encrypt(dataToEncrypt)
    }

    private async bluetoothRead(characteristic: Characteristic, encrypted = true): Promise<DataView> {
        const bluetoothService = await this.server.getPrimaryService(characteristic.service)
        const bluetoothCharacteristic = await bluetoothService.getCharacteristic(characteristic.id)
        return await bluetoothCharacteristic.readValue()
    }

    private async bluetoothWrite(characteristic: Characteristic, data: Uint8Array, encrypted = true) {
        const bluetoothService = await this.server.getPrimaryService(characteristic.service)
        const bluetoothCharacteristic = await bluetoothService.getCharacteristic(characteristic.id)
        await bluetoothCharacteristic.writeValue(encrypted ? await this.makeEncryptedPayload(data) : data)
    }

    async authenticate(playSuccessSound = true) {
        const nonce = await this.bluetoothRead(CHALLENGE, false)
        const dataToEncrypt = new Uint8Array(16)
        dataToEncrypt.set(new Uint8Array(nonce.buffer))
        const encryptedData = this.aesEcb.encrypt(dataToEncrypt)
        const data = new Uint8Array([...encryptedData, 0, 0, 0, this.userKeyId])
        await this.bluetoothWrite(KEY_INDEX, data, false)
        if (playSuccessSound)
            await this.playSound(0x1)
    }

    disconnect() {
        this.server.disconnect()
    }

    async checkConnection() {
        if (this.server.connected) return
        console.log('trying to reconnect..')
        await this.server.connect()
        // Re-authenticate
        await this.authenticate(false)
        console.log('success reconnecting..')
    }

    async playSound(id: number) {
        await this.bluetoothWrite(PLAY_SOUND, new Uint8Array([id, 0x1]))
    }

    async setPowerLvl(lvl: number) {
        if (lvl < 0 || lvl > 5) return;
        await this.bluetoothWrite(POWER_LEVEL, new Uint8Array([lvl, 0x1]))
    }

    async setSpeedLimit(limit: number) {
        await this.bluetoothWrite(SPEED_LIMIT, new Uint8Array([limit, 0x1]))
    }
}

export interface BikeCredentials {
    mac: string
    encryptionKey: string
    userKeyId: number
}

export async function connectToBike({ mac, encryptionKey, userKeyId }: BikeCredentials): Promise<Bike> {
    const device = await navigator.bluetooth.requestDevice({
        filters: [
            { name: 'ES3-' + mac.replaceAll(':', '').toUpperCase() },
            { name: 'EX3-' + mac.replaceAll(':', '').toUpperCase() }
        ],
        optionalServices: [SECURITY_SERVICE, DEFENSE_SERVICE, MOVEMENT_SERVICE, BIKE_INFO_SERVICE, BIKE_STATE_SERVICE, SOUND_SERVICE, LIGHT_SERVICE]
    })

    const gatt = device.gatt
    if (!gatt) throw `gatt property not found`
    const server = await gatt.connect()
    if (!server.connected) throw `device not connected`

    const bike = new Bike(mac, encryptionKey, userKeyId, server)
    await bike.authenticate()
    return bike
}

export interface Characteristic {
    service: string
    id: string
}

function c(service: string, characteristic: string): Characteristic {
    return {
        service,
        id: characteristic,
    }
}

// Security
const SECURITY_SERVICE = "6acc5500-e631-4069-944d-b8ca7598ad50"
export const CHALLENGE = c(SECURITY_SERVICE, "6acc5501-e631-4069-944d-b8ca7598ad50")
export const KEY_INDEX = c(SECURITY_SERVICE, "6acc5502-e631-4069-944d-b8ca7598ad50")
export const BACKUP_CODE = c(SECURITY_SERVICE, "6acc5503-e631-4069-944d-b8ca7598ad50")
export const BIKE_MESSAGE = c(SECURITY_SERVICE, "6acc5505-e631-4069-944d-b8ca7598ad50")

// Defense
const DEFENSE_SERVICE = "6acc5520-e631-4069-944d-b8ca7598ad50"
export const LOCK_STATE = c(DEFENSE_SERVICE, "6acc5521-e631-4069-944d-b8ca7598ad50")
export const UNLOCK_REQUEST = c(DEFENSE_SERVICE, "6acc5522-e631-4069-944d-b8ca7598ad50")
export const ALARM_STATE = c(DEFENSE_SERVICE, "6acc5523-e631-4069-944d-b8ca7598ad50")
export const ALARM_MODE = c(DEFENSE_SERVICE, "6acc5524-e631-4069-944d-b8ca7598ad50")

// Movement
const MOVEMENT_SERVICE = "6acc5530-e631-4069-944d-b8ca7598ad50"
export const DISTANCE = c(MOVEMENT_SERVICE, "6acc5531-e631-4069-944d-b8ca7598ad50")
export const SPEED = c(MOVEMENT_SERVICE, "6acc5532-e631-4069-944d-b8ca7598ad50")
export const UNIT_SYSTEM = c(MOVEMENT_SERVICE, "6acc5533-e631-4069-944d-b8ca7598ad50")
export const POWER_LEVEL = c(MOVEMENT_SERVICE, "6acc5534-e631-4069-944d-b8ca7598ad50")
export const SPEED_LIMIT = c(MOVEMENT_SERVICE, "6acc5535-e631-4069-944d-b8ca7598ad50")
export const E_SHIFTER_GEAR = c(MOVEMENT_SERVICE, "6acc5536-e631-4069-944d-b8ca7598ad50")
export const E_SHIFTIG_POINTS = c(MOVEMENT_SERVICE, "6acc5537-e631-4069-944d-b8ca7598ad50")
export const E_SHIFTER_MODE = c(MOVEMENT_SERVICE, "6acc5538-e631-4069-944d-b8ca7598ad50")

// BikeInfo
const BIKE_INFO_SERVICE = "6acc5540-e631-4069-944d-b8ca7598ad50"
export const MOTOR_BATTERY_LEVEL = c(BIKE_INFO_SERVICE, "6acc5541-e631-4069-944d-b8ca7598ad50")
export const MOTOR_BATTERY_STATE = c(BIKE_INFO_SERVICE, "6acc5542-e631-4069-944d-b8ca7598ad50")
export const MODULE_BATTERY_LEVEL = c(BIKE_INFO_SERVICE, "6acc5543-e631-4069-944d-b8ca7598ad50")
export const MODULE_BATTERY_STATE = c(BIKE_INFO_SERVICE, "6acc5544-e631-4069-944d-b8ca7598ad50")
export const BIKE_FIRMWARE_VERSION = c(BIKE_INFO_SERVICE, "6acc554a-e631-4069-944d-b8ca7598ad50")
export const BLE_CHIP_FIRMWARE_VERSION = c(BIKE_INFO_SERVICE, "6acc554b-e631-4069-944d-b8ca7598ad50")
export const CONTROLLER_FIRMWARE_VERSION = c(BIKE_INFO_SERVICE, "6acc554c-e631-4069-944d-b8ca7598ad50")
export const PCBA_HARDWARE_VERSION = c(BIKE_INFO_SERVICE, "6acc554d-e631-4069-944d-b8ca7598ad50")
export const GSM_FIRMWARE_VERSION = c(BIKE_INFO_SERVICE, "6acc554e-e631-4069-944d-b8ca7598ad50")
export const E_SHIFTER_FIRMWARE_VERSION = c(BIKE_INFO_SERVICE, "6acc554f-e631-4069-944d-b8ca7598ad50")
export const BATTERY_FIRMWARE_VERSION = c(BIKE_INFO_SERVICE, "6acc5550-e631-4069-944d-b8ca7598ad50")
// data returned seems to be firmware version info?
export const _UNKNOWN = c(BIKE_INFO_SERVICE, "6acc5551-e631-4069-944d-b8ca7598ad50")
export const FRAME_NUMBER = c(BIKE_INFO_SERVICE, "6acc5552-e631-4069-944d-b8ca7598ad50")

// BikeState
const BIKE_STATE_SERVICE = "6acc5560-e631-4069-944d-b8ca7598ad50"
export const MODULE_MODE = c(BIKE_STATE_SERVICE, "6acc5561-e631-4069-944d-b8ca7598ad50")
export const MODULE_STATE = c(BIKE_STATE_SERVICE, "6acc5562-e631-4069-944d-b8ca7598ad50")
export const ERRORS = c(BIKE_STATE_SERVICE, "6acc5563-e631-4069-944d-b8ca7598ad50")
export const WHEEL_SIZE = c(BIKE_STATE_SERVICE, "6acc5564-e631-4069-944d-b8ca7598ad50")
export const CLOCK = c(BIKE_STATE_SERVICE, "6acc5567-e631-4069-944d-b8ca7598ad50")

// Sound
const SOUND_SERVICE = "6acc5570-e631-4069-944d-b8ca7598ad50"
export const PLAY_SOUND = c(SOUND_SERVICE, "6acc5571-e631-4069-944d-b8ca7598ad50")
export const SOUND_VOLUME = c(SOUND_SERVICE, "6acc5572-e631-4069-944d-b8ca7598ad50")
export const BELL_SOUND = c(SOUND_SERVICE, "6acc5574-e631-4069-944d-b8ca7598ad50")

// Light
const LIGHT_SERVICE = "6acc5580-e631-4069-944d-b8ca7598ad50"
export const LIGHT_MODE = c(LIGHT_SERVICE, "6acc5581-e631-4069-944d-b8ca7598ad50")
export const SENSOR = c(LIGHT_SERVICE, "6acc5584-e631-4069-944d-b8ca7598ad50")
