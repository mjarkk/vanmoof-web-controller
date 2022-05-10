import BikeControls from '../components/Controls'
import { Bike } from '../lib/bike'

export default function ControlsTest() {
    const fakeBike = {
        mac: '1234',
        async bikeFirmwareVersion() { return '1.1.1' },
        async bikeDistance() { return 100 },
        async setSpeedLimit(l) { console.log(l) },
        async setPowerLvl(l) { console.log(l) },
        async playSound(id) { console.log(id) },
    } as Bike

    return (
        <div>
            <h1>Page for testing the bike controls</h1>
            <BikeControls bike={fakeBike} disconnect={() => alert('disconnect')} />

            <style jsx>{`
                div {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }
            `}</style>
        </div>
    )
}
