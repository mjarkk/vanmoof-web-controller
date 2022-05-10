import { useEffect, useState } from 'react'
import { BikeContext, Bike } from '../lib/bike'
import { SoundBoard } from './SoundBoard'
import { Button } from './Button'

export interface BikeControlsArgs {
    bike: Bike
    disconnect: () => void
}

export default function BikeControls({ bike, disconnect }: BikeControlsArgs) {
    return (
        <BikeContext.Provider value={bike}>
            <BikeStats bike={bike} />
            <SpeedLimit />
            <PowerLevel />
            <SoundBoard />
            <Button onClick={disconnect} secondary>
                Disconnect bike
            </Button>
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
            <div className='bikeInfo'>
                <p>Version: <b>{info.version ?? 'loading..'}</b></p>
                <p>Distance driven: <b>{info.distance ? info.distance + ' KM' : 'loading..'}</b></p>
                <p>Mac: <b>{bike.mac}</b></p>
                <style jsx>{`
                    .bikeInfo {
                        display: flex;
                        justify-content: center;
                        flex-wrap: wrap;
                    }
                    .bikeInfo p {
                        display: inline-block;
                        margin-right: 10px;
                    }
                `}</style>
            </div>
        </>
    )
}

function SpeedLimit() {
    return (
        <>
            <h3>Speed limit</h3>
            <div style={{ display: 'inline-block' }}>
                <SetSpeedLimitButton country='🇯🇵' id={2} maxSpeed={24} />
                <SetSpeedLimitButton country='🇪🇺' id={0} maxSpeed={27} />
                <SetSpeedLimitButton country='🇺🇸' id={1} maxSpeed={32} />
                <SetSpeedLimitButton country='😎' id={3} maxSpeed={37} />
            </div>
        </>
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
            <Button
                onClick={() => bike.setSpeedLimit(id)}
                style={{
                    margin: 4,
                    padding: '6px 10px',
                    width: 'auto',
                }}
            >
                <h1 style={{ margin: 0 }}>{country}</h1>
                <span style={{ color: 'var(--secondary-border-color)' }}>{maxSpeed} km/h</span>
            </Button>
        }</BikeContext.Consumer>
    )
}

function PowerLevel() {
    return (
        <>
            <h3>Power level</h3>
            <div style={{ display: 'inline-block' }}>
                <SetPowerLevelButton id={0} level="0" />
                <SetPowerLevelButton id={1} level="1" />
                <SetPowerLevelButton id={2} level="2" />
                <SetPowerLevelButton id={3} level="3" />
                <SetPowerLevelButton id={4} level="4" />
                <SetPowerLevelButton id={5} level="5" />
            </div>
        </>
    )
}

interface SetPowerLevelButtonArgs {
    level: string
    id: number
}

function SetPowerLevelButton({ level, id }: SetPowerLevelButtonArgs) {
    return (
        <BikeContext.Consumer>{bike =>
            <Button
                onClick={() => bike.setPowerLvl(id)}
                style={{
                    margin: 4,
                    padding: '6px 10px',
                    width: 44,
                    height: 50,
                }}
            >
                <h1 style={{ margin: 0 }}>{level}</h1>
            </Button>
        }</BikeContext.Consumer>
    )
}

