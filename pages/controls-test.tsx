import BikeControls from '../components/Controls'
import { Bike, SpeedLimit, PowerLevel, BikeCredentials } from '../lib/bike'
import { ApiContext, Api } from '../lib/api'
import { useEffect, useState } from 'react'
import { BikeSelector } from '../components/BikeSelector'
import type { BikeAndApiCredentials } from '../components/Login'

class FakeBike {
    id: string
    mac: string
    private speedLimit = SpeedLimit.EU
    private powerLevel = PowerLevel.Fourth

    constructor(credentials: BikeCredentials) {
        this.id = credentials.id
        this.mac = credentials.mac
    }

    async bikeFirmwareVersion() {
        return '1.1.1'
    }
    async bikeDistance() {
        return 100
    }

    async setSpeedLimit(l: SpeedLimit): Promise<SpeedLimit> {
        this.speedLimit = l
        return l
    }
    async getSpeedLimit(): Promise<SpeedLimit> {
        return this.speedLimit
    }

    async setPowerLvl(l: PowerLevel): Promise<PowerLevel> {
        this.powerLevel = l
        return l
    }
    async getPowerLvl(): Promise<PowerLevel> {
        return this.powerLevel
    }

    async playSound(id: number) {
        console.log('play sound:', id)
    }
}

const dummyBike: BikeCredentials = {
    id: '000000',
    mac: '00:00:00:00:00:00',
    encryptionKey: '00000000000000000000000000000000',
    userKeyId: 1,
    name: 'Susy testing bike',
    ownerName: 'sus',
    modelColor: {
        name: 'Dark',
        primary: '#25282a',
        secondary: '#25282a',
    },
    links: null,
}

export default function ControlsTest() {
    const [fakeBike, setFakeBike] = useState<any>(undefined) // new FakeBike as unknown as Bike
    const [credentials, setCredentials] = useState<BikeAndApiCredentials>({
        api: new Api({
            token: 'dummy',
            refreshToken: 'dummy',
        }),
        bikes: [dummyBike],
    })

    useEffect(() => {
        try {
            const apiCredential = localStorage.getItem('vm-api-credentials')
            const rawBikeCredentials = localStorage.getItem('vm-bike-credentials')

            if (!apiCredential || !rawBikeCredentials)
                throw 'no cached credentials that can be used, you can login on the root page (/) page to get them'

            const apiCredentials = JSON.parse(apiCredential)
            const parsedBikeCredentials = JSON.parse(rawBikeCredentials)

            const parsedApi = new Api(apiCredentials)

            setCredentials({
                api: parsedApi,
                bikes: [dummyBike, ...parsedBikeCredentials],
            })
        } catch (e) {
            console.log('unable to parse bike/api credentials from local storage, error:', e)
        }
    }, [])

    return (
        <div>
            <h1>Page for testing the bike controls</h1>

            {fakeBike
                ? <ApiContext.Provider value={credentials.api}>
                    <BikeControls
                        bike={fakeBike}
                        disconnect={() => setFakeBike(undefined)}
                    />
                </ApiContext.Provider>
                : <BikeSelector
                    options={credentials.bikes}
                    onSelect={bike => setFakeBike(new FakeBike(bike))}
                    title='Select a bike'
                />
            }

            <style jsx>{`
                div {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }
            `}</style>
        </div>
    )
}
