import { Bike } from '../lib/bike'
import { Button } from './Button'
import { useState, FormEvent } from 'react'
import { FormError } from './Form'
import { Api, API_KEY } from '../lib/api'

export function ShareBike({bike, api}: {bike: Bike, api: Api}) {
    const [successModal, setSuccessModal] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [shareinfo, setShareinfo] = useState({
        email: "",
        bikeId: bike.id,
        role: "user",
        duration: 1 // 86400 = 1 day, the current duration is just 1 second.
    })

    const ButtonStyling = {
        "margin": "1rem"
   }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            let req = await fetch(`/api/api_vanmoof_com/createBikeSharingInvitation`, {
                method: 'POST',
                headers: {
                    'Api-Key': API_KEY,
                    'Authorization': 'Bearer ' + api.credentials.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shareinfo)
            })

            if (req.status === 200) {
                const res = await req.json()
                console.log(res)
                setSuccessModal(true)
            } else {
                throw await req.text()
            }
        } catch (e) {
            setError(`${e}`)
        }
    }

    return (
        <div className='shareBike'>
            <h3>Share bike</h3>

            <form onSubmit={onSubmit}>
                <div className="inputGroup">
                    <label htmlFor="email">Email</label>
                    <input 
                        className = "input-mail"
                        type = "email" 
                        id = "email" 
                        name = "email" 
                        placeholder = "Enter email" 
                        value = { shareinfo.email } 
                        onChange = {
                            e => setShareinfo(v => ({
                                ...v, email: e.target.value
                            }))
                        }
                        required 
                    />

                    <p>How many days would you like to share your bike?</p>
                    <input 
                        className = "input-number"
                        type = "range" 
                        id = "days" 
                        name = "days" 
                        step = "1"
                        min  = "1" 
                        max = "10" 
                        list = "tickmarks"
                        onChange = { 
                            e => setShareinfo(v => ({
                                ...v, duration: Number(e.target.value)
                            }))
                        }
                        value = { shareinfo.duration }
                    />

                    <Button type="submit" style={ ButtonStyling }>
                        Share
                    </Button>
                </div>
                
            
                <FormError error={error} />
            </form>

            <style jsx>{`
                .shareBike {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }

                .label {
                    color: var(--label-color);
                    margin: 0;
                    font-size: 0.9rem;
                }

                .inputGroup {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .inputGroup label {
                    display: block;
                    font-size: 0.9rem;
                    color: var(--label-color);
                    padding-bottom: 4px;
                }

                .inputGroup .input-number {
                    width: 100%;
                }

                .inputGroup .input-mail {
                    width: 100%;
                    color: var(--text-color);
                    padding: 10px;
                    font-size: 0.9rem;
                    border: 2px solid var(--border-color);
                    background-color: transparent;
                }

                .inputGroup .input-mail:focus {
                    border: 2px solid var(--active-color);
                    outline: none;
                }

                .inputGroup .input-mail {
                    background-color: rgba(0, 0, 0, .07);
                    color: var(--disabled-text-color);
                }
            `}</style>
        </div>
    )
}