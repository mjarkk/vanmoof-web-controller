import styles from '../styles/Home.module.css'
import UAParser from 'ua-parser-js'

export default function Unsupported() {
    return (
        <div className={styles.errorBlock}>
            <div>
                This browser does not support <a href="https://caniuse.com/web-bluetooth">Web Bluetooth</a>.<br />
                we need that to communicate with your bike<br />
                {getSugestion()}
            </div>
        </div>
    )
}

function getSugestion() {
    const parser = new UAParser()

    const os = parser.getOS().name?.toLowerCase()
    const browser = parser.getBrowser().name?.toLowerCase()

    if (os == 'ios') return <>On IOS You might want to try <a href='https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055'>Bluefy – Web BLE Browser</a></>
    if (browser == 'chrome') return undefined
    if (os == 'windows') return <>You might want to use Chrome or Edge</>

    return <>You might want to use Chrome</>
}
