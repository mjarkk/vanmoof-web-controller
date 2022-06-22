import { useState, useEffect, useRef } from 'react'

const minute = 1
const hour = minute * 60
const day = hour * 24
const week = day * 7

interface ShareDurationSliderProps {
    onChangeMinutes?: (minutes: number) => void
}

export function ShareDurationSlider({ onChangeMinutes }: ShareDurationSliderProps) {
    const [optionIdx, setOptionIdx] = useState(4)
    const lastOnChangeValue = useRef<number>()

    const options = [
        { value: hour / 2, label: '30 minutes' },
        { value: hour, label: '1 hour', showLabel: true },
        { value: hour * 2, label: '2 hours' },
        { value: hour * 6, label: '6 hours' },
        { value: day / 2, label: '12 hours' },
        { value: day, label: '1 day', showLabel: true },
        { value: day * 2, label: '2 days' },
        { value: day * 3, label: '3 days' },
        { value: week, label: '1 week', showLabel: true },
        { value: week * 2, label: '2 weeks' },
    ]
    const selectedOption = options[optionIdx]

    useEffect(() => {
        const newValue = onChangeMinutes ? selectedOption.value : undefined
        if (onChangeMinutes && lastOnChangeValue.current !== newValue && newValue !== undefined) {
            onChangeMinutes(newValue)
        }
        lastOnChangeValue.current = newValue

    }, [selectedOption, onChangeMinutes])

    return (
        <div>
            <label>Share bike for <span>{selectedOption.label}</span></label>
            <br />
            <input
                type='range'
                min={0}
                max={options.length - 1}
                value={optionIdx}
                step={1}
                onChange={e => setOptionIdx(Number(e.target.value))}
            />
            <div className="labels">
                {options.map((option, idx) =>
                    <div className="line" style={option.showLabel ? undefined : { opacity: 0 }} key={idx}>
                        {option.showLabel
                            ? <div className="text">{option.label}</div>
                            : undefined}
                    </div>
                )}
            </div>
            <style jsx>{`
                label {
                    color: var(--label-color);
                    font-size: .9rem;
                }
                label span {
                    color: var(--text-color);
                }
                input {
                    width: 200px;
                }
                .labels {
                    width: 200px;
                    display: flex;
                    justify-content: space-around;
                }
                .labels .line {
                    width: 1px;
                    height: 4px;
                    background-color: var(--label-color);
                    opacity: 0.8;
                }
                .labels .text {
                    color: var(--text-color);
                    min-width: 60px;
                    font-size: .8rem;
                    transform: translate(-2px, 5px);
                }
            `}</style>
        </div>
    )
}
