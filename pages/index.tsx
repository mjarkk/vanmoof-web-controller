import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { Bike, BikeCredentials } from '../lib/bike'
import type { BikeControlsArgs } from '../lib/Controls'
import Login from '../lib/Login'
import dynamic from 'next/dynamic'

const Unsupported = dynamic(() => import('../lib/Unsupported'), { ssr: false })
const BikeControls = dynamic<BikeControlsArgs>(() => import('../lib/Controls'))

const Home: NextPage = () => {
  const [browserCompatible, setBrowserCompatible] = useState(true)
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
    setBrowserCompatible(!!navigator.bluetooth)
    const bikeCredentials = localStorage.getItem('vm-bike-credentials')
    if (bikeCredentials) setBikeCredentials(JSON.parse(bikeCredentials))
    import('../lib/bike') // Start importing the bike lib
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

        {!browserCompatible || (!bikeInstance && !bikeCredentials) ?
          <p className={styles.description}>
            Using this site you can change the speed limit of your VanMoof S3 and X3
          </p>
          : undefined}

        {!browserCompatible
          ? <Unsupported />
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
        <span><b>NOT</b> an offical VanMoof service/product!, <a href="https://github.com/mjarkk/vanmoof-web-controller">Source code</a></span>
      </footer>
    </div>
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

      // Start pre-loading the bike controls
      const controlsPannelPreload = import('../lib/Controls')

      const { connectToBike } = await import('../lib/bike')
      const bike = await connectToBike(bikeCredentials)

      await controlsPannelPreload

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

export default Home
