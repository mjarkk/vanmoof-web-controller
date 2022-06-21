import { useEffect, useState } from 'react'
import { BikeContext, Bike, PowerLevel as PowerLevelEnum, SpeedLimit as SpeedLimitEnum } from '../lib/bike'
import { SoundBoard } from './SoundBoard'
import { ShareBike } from './ShareBike'
import { Button } from './Button'
import { ApiContext } from '../lib/api'

export interface BikeControlsArgs {
    bike: Bike
    disconnect: () => void
}

export default function BikeControls({ bike, disconnect }: BikeControlsArgs) {
    return (
        <BikeContext.Provider value={bike}>
            <BikeStats bike={bike} />
            <SpeedLimit bike={bike} />
            <PowerLevel bike={bike} />
            <SoundBoard />
            <ApiContext.Consumer>
                {api => 
                <ShareBike bike={bike} api={api} />
                }
            </ApiContext.Consumer>
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

function SpeedLimit({ bike }: { bike: Bike }) {
    const [currentSpeedLimit, setCurrentSpeedLimit] = useState<SpeedLimitEnum | undefined>(undefined)

    const obtainFromBike = () => bike.getSpeedLimit().then(setCurrentSpeedLimit)
    useEffect(() => { obtainFromBike() }, [])

    const newLimit = async (id: SpeedLimitEnum) => {
        setCurrentSpeedLimit(id)
        setCurrentSpeedLimit(await bike.setSpeedLimit(id))
    }

    const options: Array<[string, number, SpeedLimitEnum]> = [
        ['🇯🇵', 24, SpeedLimitEnum.JP],
        ['🇪🇺', 27, SpeedLimitEnum.EU],
        ['🇺🇸', 32, SpeedLimitEnum.US],
        ['😎', 37, SpeedLimitEnum.NO_LIMIT],
    ]

    return (
        <>
            <h3>Speed limit</h3>
            <div style={{ display: 'inline-block' }}>
                {options.map(([countryFlag, maxSpeed, id]) =>
                    <SetSpeedLimitButton
                        key={id}
                        country={countryFlag}
                        maxSpeed={maxSpeed}
                        selected={currentSpeedLimit === id}
                        select={() => newLimit(id)}
                    />
                )}
            </div>
        </>
    )
}

interface SetSpeedLimitButtonArgs {
    country: string
    maxSpeed: number
    selected: boolean
    select(): void
}

function SetSpeedLimitButton({ country, maxSpeed, selected, select }: SetSpeedLimitButtonArgs) {
    return (
        <Button
            onClick={select}
            style={{
                margin: 4,
                padding: '6px 10px',
                width: 'auto',
                backgroundColor: selected ? 'var(--active-button-bg-color)' : undefined,
            }}
        >
            <h1 style={{ margin: 0 }}>{country}</h1>
            <span style={{ color: 'var(--secondary-border-color)' }}>{maxSpeed} km/h</span>
        </Button>
    )
}

function PowerLevel({ bike }: { bike: Bike }) {
    const [currentLevel, setCurrentLevel] = useState<PowerLevelEnum | undefined>(undefined)

    const obtainFromBike = () => bike.getPowerLvl().then(setCurrentLevel)
    useEffect(() => { obtainFromBike() }, [])

    const setNewLevel = async (id: PowerLevelEnum) => {
        setCurrentLevel(id)
        setCurrentLevel(await bike.setPowerLvl(id))
    }

    const levels: Array<[string, PowerLevelEnum]> = [
        ['0', PowerLevelEnum.Off],
        ['1', PowerLevelEnum.First],
        ['2', PowerLevelEnum.Second],
        ['3', PowerLevelEnum.Third],
        ['4', PowerLevelEnum.Fourth],
        ['5', PowerLevelEnum.Max],
    ]

    return (
        <>
            <h3>Power level</h3>
            <div style={{ display: 'inline-block' }}>
                {levels.map(([label, id]) =>
                    <SetPowerLevelButton
                        key={id}
                        level={label}
                        selected={currentLevel === id}
                        onSelect={() => setNewLevel(id)}
                    />
                )}
            </div>
        </>
    )
}

interface SetPowerLevelButtonArgs {
    level: string
    selected: boolean
    onSelect(): void
}

function SetPowerLevelButton({ level, selected, onSelect }: SetPowerLevelButtonArgs) {
    return (
        <Button
            onClick={onSelect}
            style={{
                margin: 4,
                padding: '6px 10px',
                width: 44,
                height: 50,
                backgroundColor: selected ? 'var(--active-button-bg-color)' : undefined,
            }}
        >
            <h1 style={{ margin: 0 }}>{level}</h1>
        </Button>
    )
}

