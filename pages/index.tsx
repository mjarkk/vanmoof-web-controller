import type { NextPage } from 'next'
import Head from 'next/head'
import { FormEvent, ReactNode, useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { connectToBike, Bike } from '../lib/bike'
import { setRevalidateHeaders } from 'next/dist/server/send-payload'

const API_KEY = 'fcb38d47-f14b-30cf-843b-26283f6a5819'

const Home: NextPage = () => {
  const [browserCompatible, setBrowserCompatible] = useState<{
    bluetooth?: boolean
  }>({})
  const [bikeCredentials, setBikeCredentials] = useState<undefined | BikeCredentials>(undefined)
  const [bikeInstance, setBikeInstance] = useState<undefined | Bike>(undefined)

  const disconnect = () => {
    bikeInstance?.disconnect()
    setBikeInstance(undefined)
  }

  const backToLogin = () => {
    disconnect()
    setBikeCredentials(undefined)
  }


  useEffect(() => {
    if (bikeCredentials)
      localStorage.setItem('vm-bike-credentials', JSON.stringify(bikeCredentials))
  }, [bikeCredentials])

  useEffect(() => {
    setBrowserCompatible({
      bluetooth: !!navigator.bluetooth,
    })
    const bikeCredentials = localStorage.getItem('vm-bike-credentials')
    if (bikeCredentials) setBikeCredentials(JSON.parse(bikeCredentials))
  }, [])

  useEffect(() => {
    if (bikeInstance) {
      const connectedTimer = setInterval(() => {
        bikeInstance.checkConnection()
          .catch((_) => setBikeInstance(undefined))
      }, 1_000)
      return () => clearTimeout(connectedTimer)
    }
  }, [bikeInstance])

  return (
    <div className={styles.container}>
      <Head>
        <title>Change VanMoof S&X 3 speed limit</title>
        <meta name="description" content="Change the speed limit of your vanmoof S3 and X3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Change VanMoof S&X 3 speed limit
        </h1>

        {browserCompatible.bluetooth === false
          ? <BrowserMissingFeatures />
          : bikeInstance
            ? <BikeControls
              bike={bikeInstance}
              disconnect={disconnect}
            />
            : bikeCredentials
              ? <BluetoothConnect
                bikeCredentials={bikeCredentials}
                setBikeInstance={setBikeInstance}
                backToLogin={backToLogin}
              />
              : <Login setBikeCredentials={setBikeCredentials} />
        }
      </main>

      <footer className={styles.footer}>
        <span><b>NOT</b> an offical VanMoof service/product!</span>
      </footer>
    </div>
  )
}

interface BikeControlsArgs {
  bike: Bike
  disconnect: () => void
}

function BikeControls({ bike, disconnect }: BikeControlsArgs) {
  return (
    <>
      <div className={styles.setSpeedLimit}>
        <SetSpeedLimitButton bike={bike} country='🇯🇵' id={2} maxSpeed={24} />
        <SetSpeedLimitButton bike={bike} country='🇪🇺' id={0} maxSpeed={27} />
        <SetSpeedLimitButton bike={bike} country='🇺🇸' id={1} maxSpeed={32} />
        <SetSpeedLimitButton bike={bike} country='😎' id={3} maxSpeed={37} />
      </div>
      <button
        className={styles.button + ' ' + styles.secondary}
        onClick={disconnect}
      >Disconnect bike</button>
    </>
  )
}

interface SetSpeedLimitButtonArgs {
  bike: Bike
  country: string
  id: number
  maxSpeed: number
}

function SetSpeedLimitButton({ bike, country, id, maxSpeed }: SetSpeedLimitButtonArgs) {
  return (
    <button onClick={() => bike.setSpeedLimit(id)}>
      <h1>{country}</h1>
      <span>{maxSpeed} km/h</span>
    </button>
  )
}

interface BluetoothConnectArgs {
  bikeCredentials: BikeCredentials
  backToLogin: () => void
  setBikeInstance: (bike: Bike) => void,
}

function BluetoothConnect({ bikeCredentials, setBikeInstance, backToLogin }: BluetoothConnectArgs) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const clickConnect = async () => {
    try {
      setLoading(true)
      setError(undefined)
      const bike = await connectToBike({
        mac: bikeCredentials.mac,
        encryptionKey: bikeCredentials.encryptionKey,
        userKeyId: bikeCredentials.userKeyId,
      })
      setBikeInstance(bike)
    } catch (e) {
      const eStr = `${e}`
      if (!/permission|cancelled/.test(eStr)) {
        setError(eStr)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    clickConnect()
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
      <button
        className={styles.button + ' ' + styles.secondary}
        onClick={backToLogin}
      >
        Back to login
      </button>
    </>
  )
}

function BrowserMissingFeatures() {
  return (
    <>
      <p className={styles.description}>
        Using this site you can change the speed limit of your VanMoof S3 and X3
      </p>

      <div className={styles.errorBlock}>
        <div>
          This browser does not support <a href="https://caniuse.com/web-bluetooth">Web Bluetooth</a>.<br />
          we need that to communicate with your bike
        </div>
      </div>
    </>
  )
}

interface BikeCredentials {
  mac: string
  encryptionKey: string
  userKeyId: number
}

interface LoginArgs {
  setBikeCredentials: (data: BikeCredentials) => void
}

function Login({ setBikeCredentials }: LoginArgs) {
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
      <p className={styles.description}>
        Using this site you can change the speed limit of your VanMoof S3 and X3
      </p>
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

export default Home
