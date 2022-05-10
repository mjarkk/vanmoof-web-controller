import { BikeContext } from '../lib/bike'
import { Button } from './Button'

export function SoundBoard() {
    return (
        <div className='soundboard'>
            <h3>Sound board</h3>
            <p className="label">Short</p>
            <div className="board">
                <SoundBtn id={0x1}>🔘 Click</SoundBtn>
                <SoundBtn id={0x2}>🧨 Error</SoundBtn>
                <SoundBtn id={0x3}>👍 Pling</SoundBtn>
                <SoundBtn id={0x6}>🤔 Cling clong</SoundBtn>
                <SoundBtn id={0xA}>🔔 Bell</SoundBtn>
                <SoundBtn id={0x16}>🔔 Normal bike bell</SoundBtn>
                <SoundBtn id={0x17}>🎉 Bell Tada</SoundBtn>
                <SoundBtn id={0xB}>😚 Whistle</SoundBtn>
                <SoundBtn id={0x18}>🚢 BOAT</SoundBtn>
                <SoundBtn id={0x14}>⚡️ Wuup</SoundBtn>
                <SoundBtn id={0x19}>🫤 Success but error</SoundBtn>
            </div>
            <p className="label">Long</p>
            <div className="board">
                <SoundBtn id={0x7}>🔋 Charding noise..</SoundBtn>
                <SoundBtn id={0xE}>🚨 Alarm</SoundBtn>
                <SoundBtn id={0xF}>🚨 Alarm stage 2</SoundBtn>
                <SoundBtn id={0x12}>🔋 Charging..</SoundBtn>
                <SoundBtn id={0x13}>🆕 Updating..</SoundBtn>
                <SoundBtn id={0x15}>🎉 Update complete</SoundBtn>
                <SoundBtn id={0x1A}>💥 Make wired noises</SoundBtn>
                {/* TODO add more bell sounds */}
            </div>
            <style jsx>{`
                .soundboard {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }

                .label {
                    color: var(--label-color);
                    margin: 0;
                    font-size: 0.9rem;
                }

                .board {
                    display: grid;
                    grid-template-columns: repeat(4, auto);
                    justify-content: center;
                    grid-gap: 10px;
                    margin: 10px 0;
                }

                @media screen and (max-width: 900px) {
                    .board {
                        grid-template-columns: repeat(3, auto);
                    }
                }

                @media screen and (max-width: 500px) {
                    .board {
                        grid-template-columns: repeat(2, auto);
                    }
                }

                @media screen and (max-width: 200px) {
                    .board {
                        grid-template-columns: repeat(1, auto);
                    }
                }
            `}</style>
        </div>
    )
}

function SoundBtn({ children, id }: { children: string, id: number }) {
    return (
        <BikeContext.Consumer>{bike =>
            <Button
                onClick={() => bike.playSound(id)}
                style={{
                    margin: 0,
                    width: '120px',
                    minHeight: '60px',
                    display: 'block',
                }}
            >
                {children}
            </Button>
        }</BikeContext.Consumer >
    )
}
