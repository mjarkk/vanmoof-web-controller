import { FormEvent, useMemo, useState } from "react"
import { Button } from "./Button"
import { Input } from "./Input"
import { BikeCredentials } from "../lib/bike"

interface AddBikeProps {
    updated: (credentials: Array<BikeCredentials>) => void
}

export function AddBike({ updated }: AddBikeProps) {
    const [name, setName] = useState('')
    const [mac, setMac] = useState('')
    const [encryptionKey, setEncryptionKey] = useState('')
    const [showAddBike, setShowAddBike] = useState(false)

    const invalidMac = useMemo(() => {
        if (mac.length === 0) {
            return true
        }

        const hexParts = mac.split(':')

        if (hexParts.length < 4) {
            return true
        }
        if (hexParts.some(part => part.length !== 2 || !/^[0-9A-F]{2}$/.test(part))) {
            return true
        }

        return false
    }, [mac])

    const canSubmit = !invalidMac && encryptionKey.length > 0 && name.length > 0

    const addCreds = (e: FormEvent) => {
        e.preventDefault()

        if (!canSubmit) {
            return
        }

        let bikes = []
        try {
            const rawBikeCredentials = localStorage.getItem('vm-bike-credentials')
            bikes = JSON.parse(rawBikeCredentials ?? "[]")
            if (!Array.isArray(bikes))
                bikes = []
        } catch (e) {
            // Ignore
        }

        const newBike: BikeCredentials = {
            mac,
            encryptionKey,
            userKeyId: 1,
            name,
            modelColor: null,
            links: null,
        }
        bikes.push(newBike)

        setName('')
        setMac('')
        setEncryptionKey('')
        setShowAddBike(false)

        localStorage.setItem('vm-bike-credentials', JSON.stringify(bikes))
        updated(bikes)
    }

    return <form className='addNewBike' onSubmit={addCreds}>
        {showAddBike ?
            <>
                <Input
                    id='name'
                    label="Bike name"
                    value={name}
                    onChange={setName}
                    placeholder='Mijn vanmoof'
                />
                <Input
                    id='mac'
                    label="MAC address"
                    value={mac}
                    onChange={setMac}
                    placeholder='FF:FF:FF:FF:FF:FF'
                    error={invalidMac ? 'Invalid MAC address must be in format FF:FF:FF:FF:FF:FF' : undefined}
                />
                <Input
                    id='encryptionKey'
                    label="Encryption key"
                    value={encryptionKey}
                    onChange={setEncryptionKey}
                    placeholder='aabbcc'
                />
                <div className="buttons">
                    <Button style={{ width: 'auto', flex: '1' }} type='button' secondary onClick={() => setShowAddBike(false)}>Back</Button>
                    <Button style={{ width: 'auto', flex: '1' }} type="submit" disabled={!canSubmit}>Add</Button>
                </div>
            </> : <>
                <Button onClick={() => setShowAddBike(true)}>Add a bike</Button>
            </>}
        <style jsx>{`
            .addNewBike {
                margin-top: 20px;
                margin-bottom: 20px;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .buttons {
                margin-top: 20px;
                display: flex;
                width: 100%;
                gap: 20px;
            }
        `}</style>
    </form>
}