import { Bike } from '../lib/bike'
import { Button } from './Button'
import { useState, FormEvent } from 'react'
import { FormError } from './Form'
import { Api } from '../lib/api'

export function ShareBike({bike, api}: {bike: Bike, api: Api}) {
    const [successModal, setSuccessModal] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [shareinfo, setShareinfo] = useState({
        email: "",
        bikeId: bike.id,
        role: "user",
        duration: 86400 // 86400 = 1 day but in seconds.
    })

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const result = await api.createBikeSharingInvitation(shareinfo)
            if(result.result) {
                // TODO: success popup
                console.log(result)
            } else if(result.message){
                setError(`${result.message}`)
            } else {
                setError(`${result}`)
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
                        className = "inputMail"
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
                        className = "inputNumber"
                        type = "range" 
                        id = "days" 
                        name = "days" 
                        step = "1"
                        min  = "1" 
                        max = "100" // currently a set max for the slider for higher numbers use the input box.
                        onChange = { 
                            e => setShareinfo(v => ({
                                ...v, duration: Number(e.target.value) * 86400
                            }))
                        }
                        value = { shareinfo.duration / 86400 }
                    />

                    <input
                        className = "inputCustom"
                        type = "number"
                        min = "1"
                        onChange = { 
                            e => setShareinfo(v => ({
                                ...v, duration: Number(e.target.value) * 86400
                            }))
                        }
                        value = { shareinfo.duration / 86400 }
                    />
                    <Button type="submit" style={{margin: "1rem"}}>
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

                .inputGroup .inputNumber {
                    width: 80%;
                }

                .inputGroup .inputCustom {
                    width: 20%;
                }

                .inputGroup .inputMail {
                    width: 100%;
                    color: var(--text-color);
                    padding: 10px;
                    font-size: 0.9rem;
                    border: 2px solid var(--border-color);
                    background-color: transparent;
                }

                .inputGroup .inputMail:focus {
                    border: 2px solid var(--active-color);
                    outline: none;
                }

                .inputGroup .inputMail {
                    background-color: rgba(0, 0, 0, .07);
                    color: var(--disabled-text-color);
                }
            `}</style>
        </div>
    )
}