import type { ReactNode } from "react"

export enum CalloutKind {
    Warning,
    Error,
}

interface CalloutProps {
    children?: ReactNode
    kind: CalloutKind
}

export function Callout({ children, kind }: CalloutProps) {
    const [icon, name] = kind == CalloutKind.Warning
        ? ['⚠️', 'warning']
        : ['🧨', 'error']

    return (
        <div className="callout">
            <div>
                {children}
            </div>
            <style jsx>{`
                .callout {
                    padding: 20px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                    max-width: 600px;
                    background-color: var(--${name}-box-bg-color);
                }
                .callout::before {
                    content: '${icon}';
                    padding-right: 10px;
                }
            `}</style>
        </div>
    )
}
