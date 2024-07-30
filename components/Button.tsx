import type { ReactNode, CSSProperties, MouseEventHandler } from "react"

interface ButtonProps {
    children?: ReactNode
    onClick?: MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
    positive?: boolean
    secondary?: boolean
    style?: CSSProperties
    type?: 'submit' | 'reset' | 'button'
}

export function Button({ children, onClick, disabled, positive, secondary, style, type }: ButtonProps) {
    const classNames = [
        positive ? 'postive' : undefined,
        secondary ? 'secondary' : undefined,
    ]

    return <button
        onClick={onClick}
        disabled={disabled}
        className={classNames.filter(Boolean).join(' ')}
        style={style}
        type={type}
    >
        {children}
        <style jsx>{`
            button {
                max-width: 100%;
                width: 260px;
                padding: 10px;
                border: 2px solid var(--border-color);
                font-size: 0.9rem;
                background-color: transparent;
                cursor: pointer;
            }
            button.positive {
                background-color: var(--positive-box-bg-color);
            }
            button.secondary {
                border-color: var(--secondary-border-color);
                color: var(--text-color);
            }
            button:focus {
                border: 2px solid var(--active-color);
                outline: none;
            }
            button[disabled] {
                background-color: rgba(0, 0, 0, .07);
                color: var(--disabled-text-color);
                cursor: default;
            }
        `}</style>
    </button>
}
