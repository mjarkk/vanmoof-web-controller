import type { Bike } from './bike'
import styles from '../styles/Home.module.css'

export interface BikeControlsArgs {
    bike: Bike
    disconnect: () => void
}

export default function BikeControls({ bike, disconnect }: BikeControlsArgs) {
    return (
        <>
            <SpeedLimit bike={bike} />
            <SoundBoard bike={bike} />
            <button
                className={styles.button + ' ' + styles.secondary}
                onClick={disconnect}
            >Disconnect bike</button>
        </>
    )
}

function SpeedLimit({ bike }: { bike: Bike }) {
    return (
        <div className={styles.setSpeedLimit}>
            <SetSpeedLimitButton bike={bike} country='🇯🇵' id={2} maxSpeed={24} />
            <SetSpeedLimitButton bike={bike} country='🇪🇺' id={0} maxSpeed={27} />
            <SetSpeedLimitButton bike={bike} country='🇺🇸' id={1} maxSpeed={32} />
            <SetSpeedLimitButton bike={bike} country='😎' id={3} maxSpeed={37} />
        </div>
    )
}

function SoundBoard({ bike }: { bike: Bike }) {
    return (
        <div></div>
    )
}

interface SetSpeedLimitButtonArgs {
    bike: Bike
    country: string
    id: number
    maxSpeed: number
}

function SetSpeedLimitButton({ bike, country, id, maxSpeed }: SetSpeedLimitButtonArgs) {
    return (
        <button onClick={() => bike.setSpeedLimit(id)}>
            <h1>{country}</h1>
            <span>{maxSpeed} km/h</span>
        </button>
    )
}
