export interface InputProps {
    id: string
    label?: string
    disabled?: boolean
    value?: string
    type?: string
    onChange?: (value: string) => void
    placeholder?: string
    error?: string
    min?: number
    max?: number
}

export function Input({ id, label, disabled, value, type, onChange, placeholder, error, min, max }: InputProps) {
    return <div className='formField'>
        {label &&
            <label htmlFor={id}>{label}</label>
        }
        <input
            disabled={disabled}
            id={id}
            value={value}
            type={type}
            onChange={onChange ? (e => onChange(e.target.value)) : undefined}
            placeholder={placeholder}
            min={min}
            max={max}
        />
        {error &&
            <p className="errorMsg">{error}</p>
        }
        <style jsx>{`
            .formField {
                max-width: 100%;
                width: 260px;
                margin-top: 15px;
            }

            .formField label {
                display: block;
                font-size: 0.9rem;
                color: var(--label-color);
                padding-bottom: 4px;
            }

            .formField input {
                width: 100%;
                color: var(--text-color);
                padding: 10px;
                font-size: 0.9rem;
                border: 2px solid var(--border-color);
                background-color: transparent;
            }

            .formField input:focus {
                border: 2px solid var(--active-color);
                outline: none;
            }

            .formField input[disabled] {
                background-color: rgba(0, 0, 0, .07);
                color: var(--disabled-text-color);
            }

            .formField .errorMsg {
                margin-top: 4px;
                font-size: 15px;
                color: var(--error-text-color);
            }
        `}</style>
    </div>
}