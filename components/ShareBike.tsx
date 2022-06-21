import { Bike, BikeContext } from '../lib/bike'
import { Button } from './Button'
import { useState, FormEvent } from 'react'
import { FormError } from './Form'
import { Api, ApiContext, API_KEY } from '../lib/api'

// Private key don't share this with anyone
var token = ""

export function ShareBike({bike, api}: {bike: typeof Bike, api: typeof Api}) {
    const [successModal, setSuccessModal] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [shareinfo, setShareinfo] = useState({
        "email": "",
        "bikeId": 0,
        "role": "user",
        "duration" : 1 
    })

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            let req = await fetch(`/api/api_vanmoof_com/createBikeSharingInvitation`, {
                method: 'POST',
                headers: {
                    'Api-Key': API_KEY,
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shareinfo)
            })

            if (req.status >= 400) {
                throw await req.text()
            }

            const res = await req.json()

            if (req.status === 200) {
                console.log(res)
                setSuccessModal(true)
            }

        } catch (e) {
            setError(`${e}`)
        }
    }

    return (
        <div className='ShareBike'>
            <BikeContext.Consumer>
                {(bike) => {
                    if (bike) {
                        if(shareinfo.bikeId === 0) {
                            setShareinfo(v => ({...v, bikeId: Number(bike.id)}))
                        } else {
                            return <h3>Share bike {bike.id}</h3>;
                        }
                    } else {
                        return <h3>To use the function below, please login again.</h3>;
                    }
                }}
            </BikeContext.Consumer>

            <ApiContext.Consumer>
                {(api) => {
                    if (api) {
                        token = api.credentials.token
                        if(token !== "") {
                            return
                        } else {
                            return <h3>To use the function below, please login again.</h3>;
                        }
                    } else {
                        return <h3>To use the function below, please login again.</h3>;
                    }
                }}
            </ApiContext.Consumer>

            <form onSubmit={onSubmit}>
                <div className="input-group">
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

                    <Button type="submit">
                        Share
                    </Button>
                </div>
                
            
                <FormError error={error} />
            </form>

            <style jsx>{`
                .ShareBike {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }

                .label {
                    color: var(--label-color);
                    margin: 0;
                    font-size: 0.9rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .input-group label {
                    display: block;
                    font-size: 0.9rem;
                    color: var(--label-color);
                    padding-bottom: 4px;
                }

                .input-group .input-number {
                    width: 100%;
                }

                .input-group .input-mail {
                    width: 100%;
                    color: var(--text-color);
                    padding: 10px;
                    font-size: 0.9rem;
                    border: 2px solid var(--border-color);
                    background-color: transparent;
                }

                .input-group .input-mail:focus {
                    border: 2px solid var(--active-color);
                    outline: none;
                }

                .input-group .input-mail {
                    background-color: rgba(0, 0, 0, .07);
                    color: var(--disabled-text-color);
                }
            `}</style>
        </div>
    )
}