import { useState, FormEvent, MouseEventHandler } from 'react'
import type { BikeCredentials } from '../lib/bike'
import { Api, API_KEY } from '../lib/api'
import { Callout, CalloutKind } from './Callouts'
import { Button } from './Button'
import { FormError } from './Form'
import { P } from './Spacing'
import { Input } from './Input'

export interface BikeAndApiCredentials {
    api: Api | undefined,
    bikes: Array<BikeCredentials>,
}

export interface LoginArgs {
    setCredentials: (creds: BikeAndApiCredentials) => void
}

export default function Login({ setCredentials }: LoginArgs) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [login, setLogin] = useState({
        email: '',
        password: '',
    })

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            setLoading(true)
            let req = await fetch('/api/my_vanmoof_com/authenticate', {
                method: 'POST',
                headers: {
                    'Api-Key': API_KEY,
                    'Authorization': 'Basic ' + btoa(login.email + ':' + login.password),
                },
            })

            if (req.status >= 400)
                throw await req.text()

            const credentials = await req.json()
            const api = new Api(credentials)
            const bikes = await api.getBikeCredentials()

            api.storeCredentialsInLocalStorage()
            localStorage.setItem('vm-bike-credentials', JSON.stringify(bikes))

            setCredentials({ bikes, api })
        } catch (e) {
            setError(`${e}`)
        } finally {
            setLoading(false)
        }
    }

    const loginWithoutAccount: MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault()

        let bikes = []
        try {
            const storedCredentials = localStorage.getItem('vm-bike-credentials') ?? ''
            const prevCredentials = JSON.parse(storedCredentials)
            if (Array.isArray(prevCredentials)) {
                bikes = prevCredentials
            }
        } catch (e) {
            // Ignore
        }

        localStorage.setItem('vm-bike-credentials', JSON.stringify(bikes))

        setCredentials({ bikes, api: undefined })
    }

    return (
        <form className='loginForm' onSubmit={onSubmit}>
            <Callout kind={CalloutKind.Warning}>This website is <b>NOT</b> an offical VanMoof service/product</Callout>
            <Callout kind={CalloutKind.Warning}>Changing your speed limit might cause you to drive faster than the laws allow you to in your country</Callout>
            Login using your VanMoof account
            <Input
                disabled={loading}
                id="email"
                value={login.email}
                onChange={email => setLogin(v => ({ ...v, email }))}
                placeholder="example@example.com"
            />
            <Input
                disabled={loading}
                id="password"
                value={login.password}
                onChange={password => setLogin(v => ({ ...v, password }))}
                type="password"
            />
            <P vertical={20}>
                <Button
                    disabled={loading || !login.email || !login.password}
                    type='submit'
                >Login</Button>
            </P>
            Or manually add bike credentials
            < P top={20} >
                <Button onClick={loginWithoutAccount}>Login without a account</Button>
            </P >
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
        </form >
    )
}
