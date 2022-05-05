import { createContext, useEffect, useState } from 'react'
import { Bike } from './bike'
import styles from '../styles/Home.module.css'
import soundboardStyle from '../styles/Soundboard.module.css'

export interface BikeControlsArgs {
    bike: Bike
    disconnect: () => void
}

const BikeContext = createContext({} as Bike)

export default function BikeControls({ bike, disconnect }: BikeControlsArgs) {
    return (
        <BikeContext.Provider value={bike}>
            <BikeStats bike={bike} />
            <SpeedLimit />
            <SoundBoard />
            <button
                className={styles.button + ' ' + styles.secondary}
                onClick={disconnect}
            >Disconnect bike</button>
        </BikeContext.Provider>
    )
}

function BikeStats({ bike }: { bike: Bike }) {
    const [info, setInfo] = useState<{
        version?: string
        distance?: number
    }>({})

    const loadInfo = async () => {
        setInfo({
            version: await bike.bikeFirmwareVersion(),
            distance: await bike.bikeDistance(),
        })
    }

    useEffect(() => {
        loadInfo()
    }, [])

    return (
        <>
            <h3>Bike info</h3>
            <div className={styles.bikeInfo}>
                <p>Version: <b>{info.version ?? 'loading..'}</b></p>
                <p>Distance driven: <b>{info.distance ? info.distance + ' KM' : 'loading..'}</b></p>
                <p>Mac: <b>{bike.mac}</b></p>
            </div>
        </>
    )
}

function SpeedLimit() {
    return (
        <>
            <h3>Speed limit</h3>
            <div className={styles.setSpeedLimit}>
                <SetSpeedLimitButton country='🇯🇵' id={2} maxSpeed={24} />
                <SetSpeedLimitButton country='🇪🇺' id={0} maxSpeed={27} />
                <SetSpeedLimitButton country='🇺🇸' id={1} maxSpeed={32} />
                <SetSpeedLimitButton country='😎' id={3} maxSpeed={37} />
            </div>
        </>
    )
}

function SoundBoard() {
    return (
        <>
            <h3>Sound board</h3>
            <p className={soundboardStyle.label}>Short</p>
            <div className={soundboardStyle.board}>
                <SoundBtn id={0x1}>🔘 Click</SoundBtn>
                <SoundBtn id={0x2}>🧨 Error</SoundBtn>
                <SoundBtn id={0x3}>👍 Pling</SoundBtn>
                <SoundBtn id={0x6}>🤔 Cling clong</SoundBtn>
                <SoundBtn id={0xA}>🔔 Bell</SoundBtn>
                <SoundBtn id={0x16}>🔔 Normal bike bell</SoundBtn>
                <SoundBtn id={0x17}>🎉 Bell Tada</SoundBtn>
                <SoundBtn id={0xB}>😚 Whistle</SoundBtn>
                <SoundBtn id={0x18}>🚢 BOAT</SoundBtn>
                <SoundBtn id={0x14}>⚡️ Wuup</SoundBtn>
                <SoundBtn id={0x19}>🫤 Success but error</SoundBtn>
            </div>
            <p className={soundboardStyle.label}>Long</p>
            <div className={soundboardStyle.board}>
                <SoundBtn id={0x7}>🔋 Charding noise..</SoundBtn>
                <SoundBtn id={0xE}>🚨 Alarm</SoundBtn>
                <SoundBtn id={0xF}>🚨 Alarm stage 2</SoundBtn>
                <SoundBtn id={0x12}>🔋 Charging..</SoundBtn>
                <SoundBtn id={0x13}>🆕 Updating..</SoundBtn>
                <SoundBtn id={0x15}>🎉 Update complete</SoundBtn>
                <SoundBtn id={0x1A}>💥 Make wired noises</SoundBtn>
                {/* TODO add more bell sounds */}
            </div>
        </>
    )
}

function SoundBtn({ children, id }: { children: string, id: number }) {
    return (
        <BikeContext.Consumer>{bike =>
            <button
                className={styles.button}
                onClick={() => bike.playSound(id)}
            >{children}</button>
        }</BikeContext.Consumer>
    )
}

interface SetSpeedLimitButtonArgs {
    country: string
    id: number
    maxSpeed: number
}

function SetSpeedLimitButton({ country, id, maxSpeed }: SetSpeedLimitButtonArgs) {
    return (
        <BikeContext.Consumer>{bike =>
            <button onClick={() => bike.setSpeedLimit(id)}>
                <h1>{country}</h1>
                <span>{maxSpeed} km/h</span>
            </button>
        }</BikeContext.Consumer>
    )
}
