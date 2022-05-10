import { useState, useEffect } from 'react'
import type { Bike, BikeCredentials } from '../lib/bike'
import { Button } from './Button'
import { FormError, FormHint } from './Form'
import { P } from './Spacing'

interface BluetoothConnectArgs {
    bikeCredentials: BikeCredentials
    backToLogin: () => void
    setBikeInstance: (bike: Bike) => void,
}

export default function BluetoothConnect({ bikeCredentials, setBikeInstance, backToLogin }: BluetoothConnectArgs) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [showWakeupMessage, setShowWakeupMessage] = useState(false)

    const clickConnect = async () => {
        let reachedAuth = false
        try {
            setLoading(true)
            setError(undefined)

            // Start pre-loading the bike controls
            const controlsPannelPreload = import('./Controls')

            const { connectToBike } = await import('../lib/bike')
            const bike = await connectToBike(bikeCredentials)
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
        clickConnect()
    }, [])

    return (
        <>
            <P vertical={10}>
                <Button
                    onClick={clickConnect}
                    disabled={loading}
                    positive
                >
                    {loading ? 'loading' : 'Connect your bike'}
                </Button>
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
