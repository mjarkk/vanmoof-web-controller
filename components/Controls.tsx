import { useEffect, useState } from 'react'
import { BikeContext, Bike, PowerLevel as PowerLevelEnum, SpeedLimit as SpeedLimitEnum } from '../lib/bike'
import { SoundBoard } from './SoundBoard'
import { ShareBike } from './sharing/ShareBike'
import { Button } from './Button'
import { Api, ApiContext } from '../lib/api'
import { CurrentShares } from './sharing/CurrentShares'

export interface BikeControlsArgs {
    bike: Bike
    api: Api
    disconnect: () => void
}

export default function BikeControls({ bike, api, disconnect }: BikeControlsArgs) {
    return (
        <BikeContext.Provider value={bike}>
            <ApiContext.Provider value={api}>
                <BikeStats bike={bike} />
                <SpeedLimit bike={bike} />
                <PowerLevel bike={bike} />
                <SoundBoard />
                <ShareBike bike={bike} api={api} />
                <CurrentShares bike={bike} api={api} />
                <Button onClick={disconnect} secondary>
                    Disconnect bike
                </Button>
            </ApiContext.Provider>
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

function isNewerFirmwareVersion (newVer: string, oldVer: string) {
    const oldParts = oldVer.split('.')
    const newParts = newVer.split('.')
    for (var i = 0; i < newParts.length; i++) {
        const a = Number(newParts[i])
        const b = Number(oldParts[i])
        if (a > b) return true
        if (a < b) return false
    }
    return false
}

function SpeedLimit({ bike }: { bike: Bike }) {
    const [currentSpeedLimit, setCurrentSpeedLimit] = useState<SpeedLimitEnum | undefined>(undefined)
    const [firmwareVersion, setFirmwareVersion] = useState<string | undefined>(undefined)

    const obtainFromBike = () => bike.getSpeedLimit().then(setCurrentSpeedLimit)
    useEffect(() => { obtainFromBike() }, [])

    const newLimit = async (id: SpeedLimitEnum) => {
        setCurrentSpeedLimit(id)
        setCurrentSpeedLimit(await bike.setSpeedLimit(id))
    }

    const loadInfo = async () => { setFirmwareVersion(await bike.bikeFirmwareVersion()) }
    useEffect(() => { loadInfo() }, [])

    var options: Array<[string, number, SpeedLimitEnum]> = [
        ['🇯🇵', 24, SpeedLimitEnum.JP],
        ['🇪🇺', 25, SpeedLimitEnum.EU],
        ['🇺🇸', 32, SpeedLimitEnum.US],
        ['😎', 37, SpeedLimitEnum.NO_LIMIT],
    ]

    if(firmwareVersion !== undefined) {
        if(isNewerFirmwareVersion(firmwareVersion, "1.8.0")) {
            console.log("Old firmware, removing no limit speed limit")
            options = options.filter(x => x[2] !== SpeedLimitEnum.NO_LIMIT)
        }
    }

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
    const [firmwareVersion, setFirmwareVersion] = useState<string | undefined>(undefined)

    const obtainFromBike = () => bike.getPowerLvl().then(setCurrentLevel)
    useEffect(() => { obtainFromBike() }, [])

    const setNewLevel = async (id: PowerLevelEnum) => {
        setCurrentLevel(id)
        setCurrentLevel(await bike.setPowerLvl(id))
    }

    const loadInfo = async () => { setFirmwareVersion(await bike.bikeFirmwareVersion()) }
    useEffect(() => { loadInfo() }, [])

    var levels: Array<[string, PowerLevelEnum]> = [
        ['0', PowerLevelEnum.Off],
        ['1', PowerLevelEnum.First],
        ['2', PowerLevelEnum.Second],
        ['3', PowerLevelEnum.Third],
        ['4', PowerLevelEnum.Fourth],
        ['5', PowerLevelEnum.Max],
    ]

    if(firmwareVersion !== undefined) {
        if(isNewerFirmwareVersion(firmwareVersion, "1.8.0")) {
            levels = levels.filter(x => x[1] !== PowerLevelEnum.Max)
        }
    }

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

