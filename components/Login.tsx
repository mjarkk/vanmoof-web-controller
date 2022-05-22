import { useState, FormEvent } from 'react'
import type { BikeCredentials } from '../lib/bike'
import { Callout, CalloutKind } from './Callouts'
import { Button } from './Button'
import { FormError } from './Form'
import { P } from './Spacing'

const API_KEY = 'fcb38d47-f14b-30cf-843b-26283f6a5819'

export interface LoginArgs {
    setBikeCredentials: (data: Array<BikeCredentials>) => void
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

            setBikeCredentials(bikes.map((b: any) => ({
                mac: b.macAddress,
                encryptionKey: b.key.encryptionKey,
                userKeyId: b.key.userKeyId,
            })))
        } catch (e) {
            setError(`${e}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className='loginForm' onSubmit={onSubmit}>
            <Callout kind={CalloutKind.Warning}>This website is <b>NOT</b> an offical VanMoof service/product</Callout>
            <Callout kind={CalloutKind.Warning}>Changing your speed limit might cause you to drive faster than the laws allow you to in your country</Callout>
            Login using your VanMoof account
            <div className='formField'>
                <label htmlFor="username">Username</label>
                <input
                    disabled={loading}
                    id="username"
                    value={login.username}
                    onChange={e => setLogin(v => ({ ...v, username: e.target.value }))}
                    placeholder="example@example.com"
                />
            </div>
            <div className='formField'>
                <label htmlFor='password'>Password</label>
                <input
                    disabled={loading}
                    id="password"
                    value={login.password}
                    onChange={e => setLogin(v => ({ ...v, password: e.target.value }))}
                    type="password"
                />
            </div>
            <P top={20}>
                <Button
                    disabled={loading || !login.username || !login.password}
                    type='submit'
                >Login</Button>
            </P>
            <FormError error={error} />
            <style jsx>{`
                .loginForm {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .formField {
                    max-width: 100%;
                    width: 260px;
                    margin-top: 15px;
                }

                .formField label {
                    display: block;
                    font-size: 0.9rem;
                    color: var(--label-color);
                    padding-bottom: 4px;
                }

                .formField input {
                    width: 100%;
                    color: var(--text-color);
                    padding: 10px;
                    font-size: 0.9rem;
                    border: 2px solid var(--border-color);
                    background-color: transparent;
                }

                .formField input:focus {
                    border: 2px solid var(--active-color);
                    outline: none;
                }

                .formField input[disabled] {
                    background-color: rgba(0, 0, 0, .07);
                    color: var(--disabled-text-color);
                }
            `}</style>
        </form>
    )
}
