export default function WalkthroughButton({ onClick, disabled, isPrimary, children }: {
    onClick: () => void,
    disabled?: boolean,
    isPrimary?: boolean,
    children: React.ReactNode
}) {
    return (
        <>
            <button
                onClick={onClick}
                disabled={disabled}
                className={isPrimary ? "primary" : ""}>{children}</button>

            <style jsx>{`
                button {
                    color: black;
                    font-size: 1em;
                    padding: 0.5rem;
                    border-radius: 5px;
                    border: none;
                    margin-right: 0.5rem;
                }

                button.primary {
                    background: #FCFE04;
                }

                button.primary[disabled] {
                    background: #868600;
                }
            `}</style>
        </>
    )
}