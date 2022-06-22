import { Bike } from '../lib/bike'
import { Api } from '../lib/api'
import { useState, FormEvent } from 'react'
import { FormError } from './Form'
import { Button } from './Button'

export function CurrentShares({ bike, api }: { bike: Bike, api: Api }) {
    interface InvitedArray {
        guid: string
        expiresAt: string
        startsAt: null
        endsAt: null
        duration: number
        role: string
        email: string
    }

    const [invited, setInvites] = useState<Array<InvitedArray>>([])

    const [successModal, setSuccessModal] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)

    const LoadInvites = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            setError(undefined)
            setSuccessModal(false)
            const shares = await api.getCurrentShares(bike.id)
            if (shares.invitations) {
                setInvites(shares.invitations)
                setSuccessModal(true)
            } else if (shares.error) {
                setError(shares.message)
            } else {
                setError(shares)
            }
        } catch (e) {
            setError(`${e}`)
        }
    }

    const RemoveInvite = async (event: FormEvent<HTMLFormElement>, guid: string) => {
        event.preventDefault()
        try {
            const res = await api.RemoveShareHolder(guid)
            setError(undefined)
            setSuccessModal(false)
            if (res.error) {
                setError(res.message)
            } else if (res.result) {
                const shares = await api.getCurrentShares(bike.id)
                if (shares.invitations) {
                    setInvites(shares.invitations)
                    setSuccessModal(true)
                } else if (shares.error) {
                    setError(shares.message)
                } else {
                    setError(shares)
                }
            } else {
                setError(res)
            }
        } catch (e) {
            setError(`${e}`)
        }
    }

    return (
        <div className='shareBike'>
            <h3>Currently shared with</h3>

            {successModal
                ? <div className='listContainer'>
                    {invited.length == 0
                        ? <p>No people found in your invitations list.</p>
                        : invited.map((d: InvitedArray, i, arr) =>
                            <form
                                key={d.email}
                                onSubmit={e => RemoveInvite(e, d.guid)}>

                                <li
                                    key={d.email}
                                    className="listItem"
                                >
                                    {d.email}
                                    <Button
                                        type="submit"
                                        style={
                                            {
                                                "margin": "1rem",
                                                "width": "160px",
                                            }
                                        }>
                                        Remove
                                    </Button>
                                </li>
                                {
                                    arr.length - 1 === i
                                        ? <div/>
                                        : <div className='awesomeLine' />
                                }
                            </form>
                        )
                    }
                </div>
                : <p>Click on the button below to obtain your share holders list.</p>
            }


            <form onSubmit={LoadInvites}>
                <Button
                    type="submit"
                    style={{ margin: "1rem" }
                    }>
                    Get shared list
                </Button>
            </form>

            <FormError error={error} />

            <style jsx>{`
                .shareBike {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    width: 600px;
                    max-width: 100%;
                }

                .listContainer {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }

                .listItem {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .awesomeLine {
                    border-top: 2px solid var(--disabled-text-color);
                }

            `}</style>
        </div>
    )
}