import BikeControls from '../components/Controls'
import { Bike, SpeedLimit, PowerLevel } from '../lib/bike'

class FakeBike {
    mac = '1234'
    private speedLimit = SpeedLimit.EU
    private powerLevel = PowerLevel.Fourth

    async bikeFirmwareVersion() {
        return '1.1.1'
    }
    async bikeDistance() {
        return 100
    }

    async setSpeedLimit(l: SpeedLimit): Promise<SpeedLimit> {
        this.speedLimit = l
        return l
    }
    async getSpeedLimit(): Promise<SpeedLimit> {
        return this.speedLimit
    }

    async setPowerLvl(l: PowerLevel): Promise<PowerLevel> {
        this.powerLevel = l
        return l
    }
    async getPowerLvl(): Promise<PowerLevel> {
        return this.powerLevel
    }

    async playSound(id: number) {
        console.log('play sound:', id)
    }
}

export default function ControlsTest() {
    const fakeBike = new FakeBike as unknown as Bike

    return (
        <div>
            <h1>Page for testing the bike controls</h1>
            <BikeControls bike={fakeBike} disconnect={() => console.log('click disconnect')} />

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
