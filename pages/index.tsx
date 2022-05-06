import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import type { Bike, BikeCredentials } from '../lib/bike'
import type { BikeControlsArgs } from '../components/Controls'
import Login from '../components/Login'
import BluetoothConnect from '../components/Connect'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import screenshotLight from '../public/screenshot_light.png'
import screenshotDark from '../public/screenshot_dark.png'

const Unsupported = dynamic(() => import('../components/Unsupported'), { ssr: false })
const BikeControls = dynamic<BikeControlsArgs>(() => import('../components/Controls'))

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
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Change the speed limit of your vanmoof S3 and X3" />
        <meta property="og:title" content="Change the speed limit of your vanmoof S3 and X3" />
        <meta property="og:image" content="https://vanmoof-web-controller.vercel.app/screenshot_dark.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Change VanMoof S&X 3 speed limit
        </h1>

        {!browserCompatible || (!bikeInstance && !bikeCredentials) ?
          <>
            <p className={styles.description}>
              Using this site you can change the speed limit of your VanMoof S3 and X3
            </p>
            <div className={styles.previewLight}>
              <Image
                alt="Site preview"
                src={screenshotLight}
                placeholder='blur'
                layout="responsive"
              />
            </div>
            <div className={styles.previewDark}>
              <Image
                className={styles.darkScreenshot}
                alt="Site preview"
                src={screenshotDark}
                placeholder='blur'
                layout="responsive"
              />
            </div>
          </>
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



export default Home
