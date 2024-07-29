import { BikeCredentials } from '../lib/bike'
import { Button } from './Button'
import { MaterialMoreVert } from './icons/MaterialMoreVert'

interface BikeSelectorProps {
    options: Array<BikeCredentials>
    onSelect: (option: BikeCredentials, idx: number) => void
}

export function BikeSelector({ options, onSelect }: BikeSelectorProps) {
    return (
        <div>
            <h2>Select a bike to connect with</h2>
            <div className='bikes'>
                {options.map((bike, idx) =>
                    <Bike key={idx} bike={bike} onSelect={() => onSelect(bike, idx)} />
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
            `}</style>
        </div >
    )
}

export interface BikeProps {
    bike: BikeCredentials
    onSelect: () => void
}

function Bike({ bike, onSelect }: BikeProps) {
    return <Button
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
                {/* <MaterialMoreVert size={22} /> */}
            </div>
        </div>
        <style jsx>{`

        `}</style>
    </Button>
}