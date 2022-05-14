import Link from 'next/link'

interface FooterProps {
    noDonate?: boolean
}

export function Footer({ noDonate }: FooterProps) {
    return (
        <footer>
            <div>
                <a href="https://github.com/mjarkk/vanmoof-web-controller">Source code</a>
                {noDonate ? undefined : <Link href="/donate">
                    <a>Donate!</a>
                </Link>}
            </div>
            <div>
                <b>NOT</b> an offical VanMoof service/product!
            </div>
            <style jsx>{`
                footer {
                    padding: 20px 2rem 0 2rem;

                    border-top: 1px solid var(--divider-color);
                }
                div {
                    padding-bottom: 10px;
                    text-align: center;
                }
                a {
                    padding: 10px;
                    display: inline-block;
                    font-weight: bold;
                }
            `}</style>
        </footer>
    )
}