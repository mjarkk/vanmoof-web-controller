import { Footer } from '../components/Footer'
import Link from 'next/link'

export default function DonationPage() {
    return (
        <div>
            <main>
                <h1>Donate</h1>
                <p>If you like the website and want to support me you can do so with the following links.</p>
                <div className='options'>
                    <DonateOption name="Paypal" link="https://paypal.me/mkopenga" />
                    <DonateOption name="Bunq" link="https://bunq.me/mjarkk" />
                </div>
                <p>If there is enough support i can maybe also add support for newer and/or older bikes</p>
                <Link href="/"><a>Back to homepage</a></Link>
            </main>
            <Footer noDonate />
            <style jsx>{`
                main {
                    padding: 4rem 2rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                p {
                    max-width: 400px;
                }
                .options {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                }
            `}</style>
        </div>
    )
}

function DonateOption({ name, link }: { name: string, link: string }) {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer">
            <h2>{name}</h2>
            <p>{link}</p>
            <style jsx>{`
                a {
                    display: block;
                    width: 250px; 
                    max-width: 100%;
                    overflow: hidden;
                    padding: 20px;
                    border: 2px solid var(--text-color);
                    margin: 10px;
                }
                h2 {
                    margin: 0;
                    color: var(--active-title-color);
                    text-decoration: none;
                }
                p {
                    margin: 0;
                    font-size: 0.9rem;
                    opacity: 0.9;
                }
            `}</style>
        </a>
    )
}