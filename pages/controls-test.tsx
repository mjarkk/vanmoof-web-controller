import BikeControls from '../components/Controls'
import { SpeedLimit, PowerLevel, BellTone, BikeCredentials } from '../lib/bike'
import { Api } from '../lib/api'
import { useEffect, useState } from 'react'
import { BikeSelector } from '../components/BikeSelector'
import type { BikeAndApiCredentials } from '../components/Login'

class FakeBike {
    id: string
    mac: string
    private speedLimit = SpeedLimit.EU
    private powerLevel = PowerLevel.Fourth
    private bellTone = BellTone.Foghorn
    private firmwareVersion = '1.8.1'

    constructor(credentials: BikeCredentials) {
        this.id = credentials.id
        this.mac = credentials.mac
    }

    async bikeFirmwareVersion() {
        return this.firmwareVersion
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

    async getBellTone(): Promise<BellTone> {
        return this.bellTone
    }

    async setBellTone(t: BellTone): Promise<BellTone> {
        this.bellTone = t
        return t
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
    links: {
        "hash": "http://my.vanmoof.com/v8/getBikeDataHash/000000",
        "thumbnail": "https://my.vanmoof.com/image/model/75",
    }
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
                ? <BikeControls
                    api={credentials.api}
                    bike={fakeBike}
                    disconnect={() => setFakeBike(undefined)}
                />
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
                    padding-bottom: 70px;
                }
            `}</style>
        </div >
    )
}
