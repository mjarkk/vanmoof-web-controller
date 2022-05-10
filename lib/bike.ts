import { createContext } from 'react'
import { AESECB } from './aes'
import { Queue } from './queue'

export const BikeContext = createContext({} as Bike)

export class Bike {
    mac: string
    server: BluetoothRemoteGATTServer
    encryptionKey: string
    userKeyId: number
    aesEcb: AESECB
    queue: Queue

    constructor(mac: string, encryptionKey: string, userKeyId: number, server: BluetoothRemoteGATTServer) {
        this.mac = mac
        this.encryptionKey = encryptionKey
        this.userKeyId = userKeyId
        this.server = server
        this.aesEcb = new AESECB(new Uint8Array(Buffer.from(this.encryptionKey, 'hex')))
        this.queue = new Queue
    }

    private async makeEncryptedPayload(data: Uint8Array): Promise<Uint8Array> {
        const nonce = await this.bluetoothRead(CHALLENGE, false)
        const paddLength = 16 - ((nonce.length + data.length) % 16)
        const dataToEncrypt = new Uint8Array([
            ...nonce,
            ...data,
            ...new Uint8Array(paddLength),
        ])
        return this.aesEcb.encrypt(dataToEncrypt)
    }

    private async decrypt(data: Uint8Array): Promise<Uint8Array> {
        let decryptedValue = this.aesEcb.decrypt(data).reverse()
        for (const v of decryptedValue) {
            if (v != 0) {
                decryptedValue.slice()
                break
            }
            decryptedValue = decryptedValue.slice(1)
        }
        return decryptedValue.reverse()
    }

    private async bluetoothRead(characteristic: Characteristic, decrypt = true): Promise<Uint8Array> {
        const data = await this.queue.push(async () => {
            const bluetoothService = await this.server.getPrimaryService(characteristic.service)
            const bluetoothCharacteristic = await bluetoothService.getCharacteristic(characteristic.id)
            const buff = await bluetoothCharacteristic.readValue()
            return new Uint8Array(buff.buffer)
        })
        return decrypt ? this.decrypt(data) : data
    }

    private async bluetoothWrite(characteristic: Characteristic, data: Uint8Array, encrypted = true) {
        const payload = encrypted ? await this.makeEncryptedPayload(data) : data
        await this.queue.push(async () => {
            const bluetoothService = await this.server.getPrimaryService(characteristic.service)
            const bluetoothCharacteristic = await bluetoothService.getCharacteristic(characteristic.id)
            await bluetoothCharacteristic.writeValue(payload)
        })
    }

    async authenticate(playSuccessSound = true) {
        const nonce = await this.bluetoothRead(CHALLENGE, false)
        const dataToEncrypt = new Uint8Array(16)
        dataToEncrypt.set(nonce)
        const encryptedData = this.aesEcb.encrypt(dataToEncrypt)
        const data = new Uint8Array([...encryptedData, 0, 0, 0, this.userKeyId])
        await this.bluetoothWrite(KEY_INDEX, data, false)
        if (playSuccessSound)
            await this.playSound(0x1)
    }

    async bikeFirmwareVersion(): Promise<string> {
        const value = await this.bluetoothRead(BIKE_FIRMWARE_VERSION)
        const strValue = new TextDecoder().decode(value)
        return strValue.split('.').map(part => part.match(/^0+(.+)/)?.[1] ?? part).join('.')
    }

    // returns the distance in kilometers
    async bikeDistance(): Promise<number> {
        const distanceInBytes = await this.bluetoothRead(DISTANCE)
        const distance = distanceInBytes.reduce((acc, v, idx) => acc + (v << (idx * 8)), 0)
        return distance / 10
    }

    // disconnect the bluetooth connection
    // this makes the bike also available for other devices again
    disconnect() {
        this.server.disconnect()
    }

    // checkConnection throws if the bike is not connected anymore and is unable to be reconnected with
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
        if (limit < 0 || limit > 3) return;
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

    return new Bike(mac, encryptionKey, userKeyId, server)
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
