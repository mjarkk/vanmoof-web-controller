import { useEffect, useState } from 'react'
import { BikeContext, Bike, PowerLevel as PowerLevelEnum, SpeedLimit as SpeedLimitEnum, BellTone as BellToneEnum } from '../lib/bike'
import { SoundBoard } from './SoundBoard'
import { ShareBike } from './sharing/ShareBike'
import { Button } from './Button'
import { Api, ApiContext } from '../lib/api'
import { CurrentShares } from './sharing/CurrentShares'
import { compareVersions } from 'compare-versions'

export interface BikeControlsArgs {
    bike: Bike
    api: Api | undefined
    disconnect: () => void
}

export default function BikeControls({ bike, api, disconnect }: BikeControlsArgs) {
    return (
        <BikeContext.Provider value={bike}>
            <BikeStats bike={bike} />
            <SpeedLimit bike={bike} />
            <PowerLevel bike={bike} />
            <BellTone bike={bike} />
            <SoundBoard />
            {api ?
                <ApiContext.Provider value={api}>
                    <ShareBike bike={bike} api={api} />
                    <CurrentShares bike={bike} api={api} />
                </ApiContext.Provider >
                : undefined}
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
        batteryPercentage?: number
    }>({})

    const loadInfo = async () => {
        setInfo({
            version: await bike.bikeFirmwareVersion(),
            distance: await bike.bikeDistance(),
            batteryPercentage: await bike.batteryChargingLevel()
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
                <p>Battery percentage: <strong>{info.batteryPercentage ? info.batteryPercentage + '%' : 'Loading...'}</strong></p>
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

interface SpeedLimitFirmwareVersionState {
    version: string
    supportsDebugSettings: boolean
}

function SpeedLimit({ bike }: { bike: Bike }) {
    const [currentSpeedLimit, setCurrentSpeedLimit] = useState<SpeedLimitEnum | undefined>(undefined)
    const [currentFirmwareVersion, setCurrentFirmwareVersion] = useState<SpeedLimitFirmwareVersionState>()

    const obtainSpeedLimitFromBike = () => bike.getSpeedLimit().then(setCurrentSpeedLimit)
    const obtainFirmwareVersionFromBike = async () => {
        const version = await bike.bikeFirmwareVersion()
        setCurrentFirmwareVersion({
            version,
            supportsDebugSettings: compareVersions('1.7.6', version) >= 0
        })
    }

    useEffect(() => {
        obtainSpeedLimitFromBike()
        obtainFirmwareVersionFromBike()
    }, [])

    const newLimit = async (id: SpeedLimitEnum) => {
        setCurrentSpeedLimit(id)
        setCurrentSpeedLimit(await bike.setSpeedLimit(id))
    }

    const options: Array<[string, number, SpeedLimitEnum]> = [
        ['🇯🇵', 24, SpeedLimitEnum.JP],
        ['🇪🇺', 25, SpeedLimitEnum.EU],
        ['🇺🇸', 32, SpeedLimitEnum.US],
    ]
    if (currentFirmwareVersion?.supportsDebugSettings) {
        options.push(['😎', 37, SpeedLimitEnum.NO_LIMIT])
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

function BellTone({ bike }: { bike: Bike }) {
    const [currentTone, setCurrentTone] = useState<BellToneEnum | undefined>(undefined)

    useEffect(() => { bike.getBellTone().then(setCurrentTone) }, [])

    var tones: Array<[string, string, BellToneEnum]> = [
        ['🔔', 'Bell', BellToneEnum.Bell],
        ['⚓️', 'Sonar', BellToneEnum.Sonar],
        ['🎉', 'Party', BellToneEnum.Party],
        ['🛳', 'Foghorn', BellToneEnum.Foghorn],
    ]

    const setNewTone = async (tone: number) => {
        setCurrentTone(await bike.setBellTone(tone))
    }

    return (
        <>
            <div className='toneList'>
                <h3>Bell tone</h3>
                <div className='tone'>
                    {tones.map(([icon, label, id]) =>
                        <SetBellToneButton
                            key={id}
                            icon={icon}
                            label={label}
                            selected={currentTone === id}
                            onSelect={() => setNewTone(id)}
                        />
                    )}
                </div>
            </div>

            <style jsx>{`
                .toneList {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }

                .tone {
                     display: grid;
                     grid-template-columns: repeat(4, auto);
                     justify-content: center;
                     grid-gap: 10px;
                     margin: 10px 0;
                }

                @media screen and (max-width: 900px) {
                     .tone {
                         grid-template-columns: repeat(3, auto);
                     }
                 }

                 @media screen and (max-width: 500px) {
                     .tone {
                         grid-template-columns: repeat(2, auto);
                     }
                 }

                 @media screen and (max-width: 200px) {
                     .tone {
                         grid-template-columns: repeat(1, auto);
                     }
                 }
            `}</style>
        </>
    )
}

function PowerLevel({ bike }: { bike: Bike }) {
    const [currentLevel, setCurrentLevel] = useState<PowerLevelEnum | undefined>(undefined)
    const [currentFirmwareVersion, setCurrentFirmwareVersion] = useState<string | undefined>(undefined)

    const obtainFromBike = () => bike.getPowerLvl().then(setCurrentLevel)
    const obtainFirmwareVersionFromBike = () => bike.bikeFirmwareVersion().then(setCurrentFirmwareVersion)
    useEffect(() => {
        obtainFromBike()
        obtainFirmwareVersionFromBike()
    }, [])

    const setNewLevel = async (id: PowerLevelEnum) => {
        setCurrentLevel(id)
        setCurrentLevel(await bike.setPowerLvl(id))
    }

    const levels: Array<[string, PowerLevelEnum, string?]> = [
        ['0', PowerLevelEnum.Off],
        ['1', PowerLevelEnum.First],
        ['2', PowerLevelEnum.Second],
        ['3', PowerLevelEnum.Third],
        ['4', PowerLevelEnum.Fourth],
        ['5', PowerLevelEnum.Max, '1.7.6'],
    ]

    const getPossibleSpeedLevels = (): Array<[string, PowerLevelEnum, string?]> => {
        return levels.filter(([, , latestSupportedFirmwareVersion]) => {
            if (latestSupportedFirmwareVersion == undefined || currentFirmwareVersion == undefined) return true
            const firmwareTooNew: Boolean = compareVersions(latestSupportedFirmwareVersion, currentFirmwareVersion) < 1
            return !firmwareTooNew;
        })
    }

    return (
        <>
            <h3>Power level</h3>
            <div style={{ display: 'inline-block' }}>
                {getPossibleSpeedLevels().map(([label, id]) =>
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

interface SetBellToneButtonArgs {
    icon: string
    label: string
    selected: boolean
    onSelect(): void
}

function SetBellToneButton({ icon, label, selected, onSelect }: SetBellToneButtonArgs) {
    return (
        <Button
            onClick={onSelect}
            style={{
                padding: '6px 10px',
                width: '75px',
                height: '75px',
                backgroundColor: selected ? 'var(--active-button-bg-color)' : undefined,
            }}
        >
            <h1 style={{ margin: 0 }}>{icon}</h1>
            <span style={{ color: 'var(--secondary-border-color)' }}>{label}</span>
        </Button>
    )
}
