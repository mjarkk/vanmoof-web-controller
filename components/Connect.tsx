import { useState, useEffect } from 'react'
import type { Bike, BikeCredentials } from '../lib/bike'
import { Button } from './Button'
import { FormError, FormHint } from './Form'
import { P } from './Spacing'
import { BikeSelector } from './BikeSelector'

interface BluetoothConnectArgs {
    bikeCredentials: Array<BikeCredentials>
    backToLogin: () => void
    setBikeInstance: (bike: Bike) => void,
}

export default function BluetoothConnect({ bikeCredentials, setBikeInstance, backToLogin }: BluetoothConnectArgs) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [showWakeupMessage, setShowWakeupMessage] = useState(false)

    const clickConnect = async (credentials: BikeCredentials) => {
        let reachedAuth = false
        try {
            setLoading(true)
            setError(undefined)

            // Start pre-loading the bike controls
            const controlsPannelPreload = import('./Controls')

            const { connectToBike } = await import('../lib/bike')
            const bike = await connectToBike(credentials)
            reachedAuth = true
            await bike.authenticate()

            await controlsPannelPreload

            setBikeInstance(bike)
        } catch (e) {
            const eStr = `${e}`
            if (!/permission|cancelled/.test(eStr)) setError(eStr)
            if (reachedAuth) setShowWakeupMessage(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (bikeCredentials.length === 1)
            clickConnect(bikeCredentials[0])
    }, [])

    return (
        <>
            <P vertical={10}>
                {loading
                    ? <Button disabled={loading} positive>loading</Button>
                    : <BikeSelector
                        options={bikeCredentials}
                        onSelect={credentials => clickConnect(credentials)}
                        title={'Select a bike to connect with'}
                    />
                }
            </P>
            <FormError error={error} />
            <FormHint hint={showWakeupMessage ? 'You might need to wake the bike before you can connect' : undefined} />
            <P vertical={10}>
                <Button
                    onClick={backToLogin}
                    secondary
                >
                    Back to login
                </Button>
            </P>
        </>
    )
}
