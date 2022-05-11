import Link from 'next/link'

interface FooterProps {
    noDonate?: boolean
}

export function Footer({ noDonate }: FooterProps) {
    return (
        <footer>
            <span>
                <b>NOT</b>{' an offical VanMoof service/product!, '}
                <a href="https://github.com/mjarkk/vanmoof-web-controller">Source code</a>
                {noDonate ? undefined : <>{', '} <Link href="/donate">
                    <a>Donate!</a>
                </Link></>}
            </span>
            <style jsx>{`
                footer {
                    display: flex;
                    flex: 1;
                    padding: 20px 2rem;
                    border-top: 1px solid var(--divider-color);
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
        </footer>
    )
}