import { FormEvent, useMemo, useState } from "react"
import { Button } from "./Button"
import { Input } from "./Input"
import { BikeCredentials } from "../lib/bike"
import { Modal, ModalConfirmOrDecline } from "./Modal"

interface AddBikeProps {
	updated: (credentials: Array<BikeCredentials>) => void
}

export function AddBike({ updated }: AddBikeProps) {
	const [name, setName] = useState("")
	const [mac, setMac] = useState("")
	const [encryptionKey, setEncryptionKey] = useState("")
	const [userKeyId, setUserKeyId] = useState("1")
	const [showAddBike, setShowAddBike] = useState(false)

	const invalidMac = useMemo(() => {
		if (mac.length === 0) {
			return true
		}

		const hexParts = mac.split(":")

		if (hexParts.length < 4) {
			return true
		}
		if (
			hexParts.some((part) => part.length !== 2 || !/^[0-9A-F]{2}$/.test(part))
		) {
			return true
		}

		return false
	}, [mac])

	const invalidUserKeyId = useMemo(() => {
		if (userKeyId.length === 0) {
			return true
		}

		const parsed = Number(userKeyId)
		if (!Number.isFinite(parsed)) {
			return true
		}
		if (!Number.isInteger(parsed)) {
			return true
		}
		if (parsed < 0 || parsed > 256) {
			return true
		}

		return false
	}, [userKeyId])

	const canSubmit =
		!invalidMac &&
		encryptionKey.length > 0 &&
		name.length > 0 &&
		!invalidUserKeyId

	const addCreds = (e: FormEvent) => {
		e.preventDefault()

		if (!canSubmit) {
			return
		}

		let bikes = []
		try {
			const rawBikeCredentials = localStorage.getItem("vm-bike-credentials")
			bikes = JSON.parse(rawBikeCredentials ?? "[]")
			if (!Array.isArray(bikes)) bikes = []
		} catch (e) {
			// Ignore
		}

		const newBike: BikeCredentials = {
			mac,
			encryptionKey,
			userKeyId: Number(userKeyId),
			name,
			modelColor: null,
			links: null,
		}
		bikes.push(newBike)

		setName("")
		setMac("")
		setEncryptionKey("")
		setShowAddBike(false)

		localStorage.setItem("vm-bike-credentials", JSON.stringify(bikes))
		updated(bikes)
	}

	return (
		<div>
			<Modal
				open={showAddBike}
				onClose={() => setShowAddBike(false)}
				title="Add a new bike"
			>
				<form className="addNewBike" onSubmit={addCreds}>
					<Input
						id="name"
						label="Bike name"
						value={name}
						onChange={setName}
						placeholder="My vanmoof"
					/>
					<Input
						id="mac"
						label="MAC address"
						value={mac}
						onChange={(v) => setMac(v.toUpperCase())}
						placeholder="FF:FF:FF:FF:FF:FF"
						error={
							invalidMac && mac.length !== 0
								? "Invalid MAC address must be in format FF:FF:FF:FF:FF:FF"
								: undefined
						}
					/>
					<Input
						id="encryptionKey"
						label="Encryption key"
						value={encryptionKey}
						onChange={setEncryptionKey}
						placeholder="aabbcc"
					/>
					<Input
						id="userKeyId"
						label="User key id (1 is most likely)"
						value={userKeyId}
						onChange={(v) => setUserKeyId(v.match(/[0-9]/g)?.join("") ?? "")}
						placeholder="Number"
						error={
							invalidUserKeyId
								? "Invalid user key id must be a number between 0 and 256"
								: undefined
						}
					/>
					<ModalConfirmOrDecline
						onCancel={() => setShowAddBike(false)}
						confirmIsSubmit
						disableConfirm={!canSubmit}
						confirmText="Add"
					/>
				</form>
			</Modal>
			<div className="center">
				<Button onClick={() => setShowAddBike(true)}>Add a bike</Button>
			</div>
			<style jsx>{`
				.addNewBike {
					margin-bottom: 20px;
					text-align: center;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
				.center {
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
		</div>
	)
}
