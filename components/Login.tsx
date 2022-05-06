import { useState, FormEvent, ReactNode } from 'react'
import styles from '../styles/Home.module.css'
import type { BikeCredentials } from '../lib/bike'

const API_KEY = 'fcb38d47-f14b-30cf-843b-26283f6a5819'

export interface LoginArgs {
    setBikeCredentials: (data: BikeCredentials) => void
}

export default function Login({ setBikeCredentials }: LoginArgs) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [login, setLogin] = useState({
        username: '',
        password: '',
    })

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            setLoading(true)
            let req = await fetch('/api/authenticate', {
                method: 'POST',
                headers: {
                    'Api-Key': API_KEY,
                    'Authorization': 'Basic ' + btoa(login.username + ':' + login.password),
                },
            })

            if (req.status >= 400)
                throw await req.text()

            const { token } = await req.json()
            if (!token)
                throw 'login failed, missing token or refreshToken'

            req = await fetch(`/api/getCustomerData?includeBikeDetails`, {
                headers: {
                    'Api-Key': API_KEY,
                    'Authorization': 'Bearer ' + token,
                }
            })

            if (req.status >= 400)
                throw await req.text()

            const resp = await req.json()

            const bikes = resp.data.bikeDetails
            if (bikes.length == 0)
                throw 'You don\'t have a bike connected to your account'
            const bike = bikes[0]

            setBikeCredentials({
                mac: bike.macAddress,
                encryptionKey: bike.key.encryptionKey,
                userKeyId: bike.key.userKeyId,
            })
        } catch (e) {
            setError(`${e}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className={styles.loginForm} onSubmit={onSubmit}>
            <WarningBlock>This website is <b>NOT</b> an offical VanMoof service/product</WarningBlock>
            <WarningBlock>Changing your speed limit might cause you to drive faster than the laws allow you to in your country</WarningBlock>
            Login using your VanMoof account
            <div className={styles.formField}>
                <label htmlFor="username">Username</label>
                <input
                    disabled={loading}
                    id="username"
                    value={login.username}
                    onChange={e => setLogin(v => ({ ...v, username: e.target.value }))}
                    placeholder="example@example.com"
                />
            </div>
            <div className={styles.formField}>
                <label htmlFor='password'>Password</label>
                <input
                    disabled={loading}
                    id="password"
                    value={login.password}
                    onChange={e => setLogin(v => ({ ...v, password: e.target.value }))}
                    type="password"
                />
            </div>
            <button
                disabled={loading || !login.username || !login.password}
                className={styles.loginBtn}
                type='submit'
            >Login</button>
            {error ? <div className={styles.errorBox}>{error}</div> : undefined}
        </form>
    )
}


function WarningBlock({ children }: { children?: ReactNode }) {
    return (
        <div className={styles.warningBlock}>
            <div>
                {children}
            </div>
        </div>
    )
}
