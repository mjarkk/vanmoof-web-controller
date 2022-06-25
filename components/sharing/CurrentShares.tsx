import { Bike } from '../../lib/bike'
import type { Api, BikeShareEntry } from '../../lib/api'
import { useState, FormEvent } from 'react'
import { FormError } from '../Form'
import { Button } from '../Button'

export function CurrentShares({ bike, api }: { bike: Bike, api: Api }) {
    const [shares, setShares] = useState<Array<BikeShareEntry>>()
    const [error, setError] = useState<string | undefined>(undefined)

    const loadInvites = async () => {
        try {
            setError(undefined)
            setShares(undefined)
            const shares = await api.getCurrentShares(bike.id)
            setShares(shares)
        } catch (e) {
            setError(`${e}`)
        }
    }

    const removeInvite = async (event: FormEvent<HTMLFormElement>, guid: string) => {
        event.preventDefault()
        try {
            setError(undefined)
            setShares(undefined)
            await api.removeShareHolder(guid)
            const shares = await api.getCurrentShares(bike.id)
            setShares(shares)
        } catch (e) {
            setError(`${e}`)
        }
    }

    return (
        <div className='shareBike'>
            <h3>Currently shared with</h3>

            {shares !== undefined
                ? <div className='listContainer'>
                    {shares.length == 0
                        ? <p className='noShares'>You have not shared your bike</p>
                        : shares.map((d, idx) =>
                            <form
                                key={d.email}
                                onSubmit={e => removeInvite(e, d.guid)}
                            >
                                <li key={d.email} className="listItem">
                                    <p>{d.email}</p>
                                    <Button
                                        type="submit"
                                        style={{
                                            padding: 8,
                                        }}
                                    >Remove</Button>
                                </li>
                                {shares.length - 1 === idx
                                    ? undefined
                                    : <div className='divider' />
                                }
                            </form>
                        )
                    }
                </div>
                : <p>Click on the button below to obtain your share holders list.</p>
            }

            <div className='getSharedList'>
                <Button
                    type="submit"
                    style={{ margin: "1rem" }}
                    onClick={loadInvites}
                >Get shared list</Button>
            </div>

            <FormError error={error} />

            <style jsx>{`
                .shareBike {
                    width: 600px;
                    max-width: 100%;
                    padding: 0 20px;
                }

                h3 {
                    text-align: center;
                }

                .getSharedList {
                    display: flex;
                    justify-content: center;
                }

                .noShares {
                    text-align: center;
                }

                .listContainer {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }

                .listItem {
                    display: grid;
                    grid-template-columns: auto 120px;
                    align-items: center;
                    grid-gap: 10px;
                    padding: 10px;
                }

                p {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .divider {
                    border-top: 2px solid var(--disabled-text-color);
                }

            `}</style>
        </div>
    )
}
