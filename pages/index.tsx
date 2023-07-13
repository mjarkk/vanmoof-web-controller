import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import type { Bike } from '../lib/bike'
import { Api } from '../lib/api'
import type { BikeControlsArgs } from '../components/Controls'
import Login, { BikeAndApiCredentials } from '../components/Login'
import BluetoothConnect from '../components/Connect'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import screenshotLight from '../public/screenshot_light.png'
import screenshotDark from '../public/screenshot_dark.png'
import { Footer } from '../components/Footer'

const Unsupported = dynamic(() => import('../components/Unsupported'), { ssr: false })
const BikeControls = dynamic<BikeControlsArgs>(() => import('../components/Controls'))

const Home: NextPage = () => {
  const [browserCompatible, setBrowserCompatible] = useState(true)
  const [credentials, setCredentials] = useState<undefined | BikeAndApiCredentials>(undefined)
  const [bikeInstance, setBikeInstance] = useState<undefined | Bike>(undefined)

  const disconnect = () => {
    bikeInstance?.disconnect()
    setBikeInstance(undefined)
  }

  const backToLogin = () => {
    disconnect()
    setCredentials(undefined)
  }

  useEffect(() => {
    setBrowserCompatible(!!navigator.bluetooth)

    const apiCredential = localStorage.getItem('vm-api-credentials')
    const rawBikeCredentials = localStorage.getItem('vm-bike-credentials')
    if (rawBikeCredentials) {
      try {
        const apiCredentials = apiCredential ? JSON.parse(apiCredential) : undefined
        const parsedBikeCredentials = JSON.parse(rawBikeCredentials)

        if (!Array.isArray(parsedBikeCredentials))
          throw 'old bike credentials format'

        const parsedApi = apiCredentials ? new Api(apiCredentials) : undefined

        setCredentials({
          api: parsedApi,
          bikes: parsedBikeCredentials,
        })
      } catch (e) {
        console.log('unable to parse bike/api credentials from local storage, error:', e)
      }
    }

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
    <div>
      <main>
        <h1 className='title'>Mooovy</h1>
        <p>Change VanMoof S&X 3 speed limit</p>

        {!browserCompatible || (!bikeInstance && !credentials) ?
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
          : credentials
            ? bikeInstance
              ? <BikeControls
                api={credentials.api}
                bike={bikeInstance}
                disconnect={disconnect}
              />
              : <BluetoothConnect
                bikeCredentials={credentials.bikes}
                setBikeInstance={setBikeInstance}
                backToLogin={backToLogin}
              />
            : <Login setCredentials={setCredentials} />
        }
      </main>

      <Footer />

      <style jsx>{`
        main {
          padding: 4rem 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
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
