import { BikeContext } from '../lib/bike'
import { Button } from './Button'

export function SoundBoard() {
    return (
        <div className='soundboard'>
            <h3>Sound board</h3>
            <p className="label">Short</p>
            <div className="board">
                <SoundBtn id={0x1}>๐ Click</SoundBtn>
                <SoundBtn id={0x2}>๐งจ Error</SoundBtn>
                <SoundBtn id={0x3}>๐ Pling</SoundBtn>
                <SoundBtn id={0x6}>๐ค Cling clong</SoundBtn>
                <SoundBtn id={0xA}>๐ Bell</SoundBtn>
                <SoundBtn id={0x16}>๐ Normal bike bell</SoundBtn>
                <SoundBtn id={0x17}>๐ Bell Tada</SoundBtn>
                <SoundBtn id={0xB}>๐ Whistle</SoundBtn>
                <SoundBtn id={0x18}>๐ข BOAT</SoundBtn>
                <SoundBtn id={0x14}>โก๏ธ Wuup</SoundBtn>
                <SoundBtn id={0x19}>๐ซค Success but error</SoundBtn>
            </div>
            <p className="label">Long</p>
            <div className="board">
                <SoundBtn id={0x7}>๐ Charding noise..</SoundBtn>
                <SoundBtn id={0xE}>๐จ Alarm</SoundBtn>
                <SoundBtn id={0xF}>๐จ Alarm stage 2</SoundBtn>
                <SoundBtn id={0x12}>๐ Charging..</SoundBtn>
                <SoundBtn id={0x13}>๐ Updating..</SoundBtn>
                <SoundBtn id={0x15}>๐ Update complete</SoundBtn>
                <SoundBtn id={0x1A}>๐ฅ Make wired noises</SoundBtn>
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
