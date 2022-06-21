import { BikeCredentials } from '../lib/bike'
import { Button } from './Button'

interface BikeSelectorProps {
    options: Array<BikeCredentials>
    onSelect: (option: BikeCredentials, idx: number) => void
    title: string
}

export function BikeSelector({ options, onSelect, title }: BikeSelectorProps) {
    return (
        <div>
            <h2>{title}</h2>
            <div className='bikes'>
                {options.map((bike, idx) =>
                    <Button
                        key={idx}
                        style={{ padding: 0, margin: 10 }}
                        onClick={() => onSelect(bike, idx)}
                    >
                        <div
                            className='previewImage'
                            style={bike.links
                                ? { backgroundImage: `url('${bike.links.thumbnail}')` }
                                : undefined
                            }
                        />
                        <div className='detials'>
                            <h3>{bike.name}</h3>
                            <p>{bike.ownerName}</p>
                            <div className='meta'>
                                <p><span>id</span>{bike.id}</p>
                                <p><span>mac</span>{bike.mac}</p>
                            </div>
                        </div>
                    </Button>
                )}
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
                .previewImage {
                    height: 150px;
                    background-position: center;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-color: white;
                }
                .detials {
                    display: flex;
                    align-items: flex-start;
                    flex-direction: column;
                    padding: 20px;
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
        </div>
    )
}
