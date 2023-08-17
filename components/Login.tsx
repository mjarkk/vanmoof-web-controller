import { useState, FormEvent } from 'react'
import type { BikeCredentials } from '../lib/bike'
import { Api, API_KEY } from '../lib/api'
import { Callout, CalloutKind } from './Callouts'
import { Button } from './Button'
import { FormError } from './Form'
import { P } from './Spacing'

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

    const [loginMethod, setLoginMethod] = useState<'email' | 'file'>('email')

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

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        try {
            setLoading(true)
            const file = event.target.files?.[0]
            if (!file) {
                throw new Error('No file selected')
            }
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onload = async () => {
                // Check if the file is valid JSON
                try {
                    JSON.parse(reader.result as string)
                }
                catch (e) {
                    throw new Error('Invalid JSON file')
                }

                // Parse the JSON as BikeCredentials (There could be one bike but also multiple)
                const bikes = JSON.parse(reader.result as string) as Array<BikeCredentials>

                // Store the credentials in local storage
                localStorage.setItem('vm-bike-credentials', JSON.stringify(bikes))

                // Disable api functionality because we don't have the api credentials
                setCredentials({ bikes, api: undefined })
            }
        } catch (e) {
            setError(`${e}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='loginContainer'>
            <form className='loginForm' onSubmit={onSubmit} style={{ display: loginMethod === 'email' ? 'block' : 'none' }}>
                <Callout kind={CalloutKind.Warning}>This website is <b>NOT</b> an offical VanMoof service/product</Callout>
                <Callout kind={CalloutKind.Warning}>Changing your speed limit might cause you to drive faster than the laws allow you to in your country</Callout>
                Login using your VanMoof account
                <div className='formField'>
                    <label htmlFor="email">Email</label>
                    <input
                        disabled={loading}
                        id="email"
                        value={login.email}
                        onChange={e => setLogin(v => ({ ...v, email: e.target.value }))}
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
                <div className='loginBtn'>
                    <P top={20}>
                        <Button
                            disabled={loading}
                            type='submit'
                        >Login</Button>
                    </P>
                </div>
                <FormError error={error} />
            </form>
            <form className='loginForm' onSubmit={onSubmit} style={{ display: loginMethod === 'file' ? 'block' : 'none' }}>
                <Callout kind={CalloutKind.Warning}>This website is <b>NOT</b> an offical VanMoof service/product</Callout>
                <Callout kind={CalloutKind.Warning}>Changing your speed limit might cause you to drive faster than the laws allow you to in your country</Callout>
                Login using your local JSON file
                <div className='formField'>
                    <label htmlFor='file'>Select JSON file</label>
                    <input
                        disabled={loading}
                        id='file'
                        type='file'
                        accept='.json'
                        onChange={onFileChange}
                    />
                </div>
                <div className='loginBtn'>
                    <P top={20}>
                        <Button
                            disabled={loading}
                            type='submit'
                        >Login</Button>
                    </P>
                </div>
                <FormError error={error} />
            </form>
            <div className='loginMethod'>
                <label>
                    <input
                        type='radio'
                        name='loginMethod'
                        value='email'
                        checked={loginMethod === 'email'}
                        onChange={() => setLoginMethod('email')}
                    />
                    Login using email and password
                </label>
                <label>
                    <input
                        type='radio'
                        name='loginMethod'
                        value='file'
                        checked={loginMethod === 'file'}
                        onChange={() => setLoginMethod('file')}
                    />
                    Login using local JSON file
                </label>
            </div>
            <style jsx>{`
                .loginContainer {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .loginForm {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .formField {
                    max-width: 100%;
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

                .loginMethod {
                    margin-top: 20px;
                }

                .loginMethod label {
                    margin-right: 20px;
                }

                .loginBtn {
                    display: flex;
                    justify-content: center;
                }

                .loginBtn > button {
                    width: 100%;
                }
            `}</style>
        </div>
    )
}
