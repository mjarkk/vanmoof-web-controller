import { Bike } from '../lib/bike'
import { Api } from '../lib/api'
import { useState, FormEvent } from 'react'
import { FormError, FormSuccess } from './Form'
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

    return (
        <div className='shareBike'>
            <h3>Currently shared with</h3>

            <div className='listContainer'>
                {invited.length == 0
                    ? <p>No people found in your invitations list.</p>
                    : invited.map((d: InvitedArray) =>
                    <form
                        key={d.email}
                        onSubmit={LoadInvites}>

                        <li
                            key={d.email}
                            className="listItem"
                        >

                            {d.email}
                            <Button
                                type="submit"
                                style={{ margin: "1rem" }}
                            >
                                Remove
                            </Button>

                        </li>
                    </form>
                    )
                }
            </div>

            <form onSubmit={LoadInvites}>
                <Button
                    type="submit"
                    style={{ margin: "1rem" }
                    }>
                    Get shared list
                </Button>
            </form>

            <FormSuccess status={successModal} message={"Successfully obtained share holders."} />
            <FormError error={error} />

            <style jsx>{`
                .shareBike {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }

                .listContainer {
                    display: flex;
                    flex-direction: column;
                }

                .listItem {
                    display: flex;
                    justify-content: space-between;
                }

            `}</style>
        </div>
    )
}