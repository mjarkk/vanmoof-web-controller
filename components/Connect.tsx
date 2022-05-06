import { useState, useEffect } from 'react'
import type { Bike, BikeCredentials } from '../lib/bike'
import styles from '../styles/Home.module.css'

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
        // clickConnect()
    }, [])

    return (
        <>
            <button
                className={styles.button + ' ' + styles.positive}
                onClick={clickConnect}
                disabled={loading}
            >
                {loading ? 'loading' : 'Connect your bike'}
            </button>
            {error ? <div className={styles.errorBox}>{error}</div> : undefined}
            {showWakeupMessage ? <div className={styles.hintBox}>
                You might need to wake the bike before you can connect
            </div> : undefined}
            <button
                className={styles.button + ' ' + styles.secondary}
                onClick={backToLogin}
            >
                Back to login
            </button>
        </>
    )
}
