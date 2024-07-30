import { MouseEventHandler, useState } from 'react'
import { BikeCredentials } from '../lib/bike'
import { Button } from './Button'
import { MaterialMoreVert } from './icons/MaterialMoreVert'
import { Modal, ModalConfirmOrDecline } from './Modal'

interface BikeSelectorProps {
    options: Array<BikeCredentials>
    onSelect: (option: BikeCredentials, idx: number) => void
    onDelete: (idx: number) => void
}

export function BikeSelector({ options, onSelect, onDelete }: BikeSelectorProps) {
    return (
        <div>
            <h2>Select a bike to connect with</h2>
            <div className='bikes'>
                {options.map((bike, idx) =>
                    <Bike
                        key={idx}
                        bike={bike}
                        onSelect={() => onSelect(bike, idx)}
                        onDelete={() => onDelete(idx)}
                    />
                )}
                {options.length === 0 && <p className='noBikes'>No bikes found</p>}
            </div>
            <style jsx>{`
                h2 {
                    text-align: center;
                }
                .bikes {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .noBikes {
                    text-align: center;
                    color: var(--label-color)
                }
                .previewImage {
                    height: 150px;
                    background-position: center;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-color: white;
                }
            `}</style>
        </div >
    )
}

export interface BikeProps {
    bike: BikeCredentials
    onSelect: () => void
    onDelete: () => void
}

function Bike({ bike, onSelect, onDelete }: BikeProps) {
    const [showOptions, setShowOptions] = useState(false)

    const clickOptions: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setShowOptions(true)
    }

    const onDeleteProxy = () => {
        setShowOptions(false)
        onDelete()
    }

    return <>
        <Button
            style={{ padding: 0, margin: 10 }}
            onClick={() => onSelect()}
        >
            {bike.links ?
                <div
                    className='previewImage'
                    style={{ backgroundImage: `url('${bike.links.thumbnail}')` }}
                />
                : undefined}
            <div className='detialsAndOptions'>
                <div className='detials'>
                    <h3>{bike.name}</h3>
                    {bike.ownerName && <p>{bike.ownerName}</p>}
                    <div className='meta'>
                        {bike.id &&
                            <p><span>id</span>{bike.id}</p>
                        }
                        <p><span>mac</span>{bike.mac}</p>
                    </div>
                </div>
                <div className='options'>
                    <button className='option' onClick={clickOptions}>
                        <MaterialMoreVert size={22} />
                    </button>
                </div>
            </div>
            <style jsx>{`
                .detialsAndOptions {
                    display: flex;
                    justify-content: space-between;
                    padding: 20px;
                }
                .detials {
                    display: flex;
                    align-items: flex-start;
                    flex-direction: column;
                }
                .detials p {
                    margin: 0;
                }
                .detials h3 {
                    margin: 1px 0;
                }
                .detials .meta {
                    font-size: 0.7rem;
                    color: var(--label-color);
                    padding-top: 10px;
                    display: flex;
                    align-items: flex-start;
                    flex-direction: column;
                }
                .detials .meta span::after {
                    content: ': ';
                }
                .option {
                    background-color: transparent;
                    border: none;
                    height: 44px;
                    width: 44px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
        </Button>
        <Modal open={showOptions} onClose={() => setShowOptions(false)} title={`Bike ${bike.name} options`}>
            <BikeOptions onDelete={onDeleteProxy} />
        </Modal>
    </>
}

interface BikeOptionsProps {
    onDelete: () => void
}

function BikeOptions({ onDelete }: BikeOptionsProps) {
    const [showDelete, setShowDelete] = useState(false)

    return <div>
        <Button onClick={() => setShowDelete(true)}>Delete bike</Button>

        <Modal open={showDelete} onClose={() => setShowDelete(false)} title='Delete bike'>
            Are you sure?
            <ModalConfirmOrDecline
                onCancel={() => setShowDelete(false)}
                onConfirm={() => {
                    onDelete()
                    setShowDelete(false)
                }}
                confirmText="Yes"
            />
        </Modal>
        <style jsx>{`
            .btns {
                display: flex;
            }    
        `}</style>
    </div>
}