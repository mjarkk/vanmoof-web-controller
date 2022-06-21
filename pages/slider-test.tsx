import { useState } from "react";

function DurationSlider() {
    const [optionIdx, setOptionIdx] = useState(3)

    const options = [
        { value: 30, label: '30 minutes' },
        { value: 60, label: '1 hour' },
        { value: 60 * 2, label: '2 hours' },
        { value: 60 * 6, label: '6 hours' },
        { value: 60 * 12, label: '12 hours' },
        { value: 60 * 24, label: '1 day' },
        { value: 60 * 24 * 2, label: '2 days' },
        { value: 60 * 24 * 3, label: '3 days' },
        { value: 60 * 24 * 7, label: '1 week' },
        { value: 60 * 24 * 7 * 2, label: '2 weeks' },
    ]
    const selectedOption = options[optionIdx]

    return (
        <div>
            <label>Share bike for {selectedOption.label}</label>
            <br />
            <input
                type='range'
                min={0}
                max={options.length - 1}
                value={optionIdx}
                step={1}
                onChange={e => setOptionIdx(Number(e.target.value))}
            />
            <style jsx>{`

            `}</style>
        </div>
    )
}

export default function SliderTest() {
    return (
        <div>
            <DurationSlider />
            <style jsx>{`
                div {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }
            `}</style>
        </div>
    );
}
