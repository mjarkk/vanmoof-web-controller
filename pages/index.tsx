import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
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
    <div className='container'>
      <Head>
        <title>Change VanMoof S&X 3 speed limit</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Change the speed limit of your vanmoof S3 and X3" />
        <meta property="og:title" content="Change the speed limit of your vanmoof S3 and X3" />
        <meta property="og:image" content="https://vanmoof-web-controller.vercel.app/screenshot_dark.png" />
      </Head>

      <main>
        <h1 className='title'>Change VanMoof S&X 3 speed limit</h1>

        {!browserCompatible || (!bikeInstance && !bikeCredentials) ?
          <>
            <p className='description'>
              Using this site you can change the speed limit of your VanMoof S3 and X3
            </p>
            <div className='previewLight'>
              <Image
                alt="Site preview"
                src={screenshotLight}
                placeholder='blur'
                layout="responsive"
              />
            </div>
            <div className='previewDark'>
              <Image
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

      <footer>
        <span><b>NOT</b> an offical VanMoof service/product!, <a href="https://github.com/mjarkk/vanmoof-web-controller">Source code</a></span>
      </footer>

      <style jsx>{`
        .container {
          padding: 0 2rem;
        }

        main {
          padding: 4rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          display: flex;
          flex: 1;
          padding: 20px 0;
          border-top: 1px solid var(--divider-color);
          justify-content: center;
          align-items: center;
        }

        .title {
          font-size: 2rem;
          text-align: center;
        }

        .description {
          text-align: center;
        }

        .previewLight, .previewDark {
          height: 400px;
          width: 400px;
        }

        .previewLight {display: block !important;}
        .previewDark {display: none !important;}

        @media (prefers-color-scheme: dark) {
          .previewLight {display: none !important;}
          .previewDark {display: block !important;}
        }
      `}</style>
    </div>
  )
}



export default Home
