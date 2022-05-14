import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return <div>
    <Head>
      <title>Change VanMoof S&X 3 speed limit</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content="Change the speed limit of your vanmoof S3 and X3" />
      <meta property="og:title" content="Change the speed limit of your vanmoof S3 and X3" />
      <meta property="og:image" content="https://vanmoof-web-controller.vercel.app/screenshot_dark.png" />
    </Head>
    <Component {...pageProps} />
  </div>
}

export default MyApp
