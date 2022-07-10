import type { Bike, BikeCredentials } from './bike'
import { createContext } from 'react'

export const API_KEY = 'fcb38d47-f14b-30cf-843b-26283f6a5819'

export interface ApiCredentials {
    token: string
    refreshToken: string
}

export interface BikeShareEntry {
    guid: string
    expiresAt: string
    startsAt: null
    endsAt: null
    duration: number
    role: string
    email: string
}

async function checkErrorAndUnwrap(req: Response): Promise<any> {
    const resp = await req.text()

    // Try parse the json or throw the resp
    let jsonResp
    try {
        jsonResp = JSON.parse(resp)
    } catch (e) {
        throw resp
    }

    // Always throw the error if that apears in the responsse
    if (jsonResp.error) throw jsonResp.error.toString()

    // Always throw if the response status is above equal or above 400
    if (req.status >= 400)
        return jsonResp.message.toString() || jsonResp.toString()

    return jsonResp
}

export class Api {
    /*
        TODO: Add support for the refresh token
    */

    private credentials: ApiCredentials

    constructor(credentials: ApiCredentials) {
        this.credentials = credentials
        if (!credentials.token || !credentials.refreshToken)
            throw 'login failed, missing token or refreshToken'
    }

    private get authHeader() {
        return {
            'Api-Key': API_KEY,
            'Authorization': 'Bearer ' + this.credentials.token,
        }
    }

    async getBikeCredentials(): Promise<Array<BikeCredentials>> {
        const req = await fetch(`/api/api_vanmoof-api_com/getCustomerData?includeBikeDetails`, {
            headers: this.authHeader,
        })
        const resp = await checkErrorAndUnwrap(req)

        const bikes = resp.data.bikeDetails
        if (bikes.length == 0)
            throw 'You don\'t have a bike connected to your account'

        return bikes.map((b: any): BikeCredentials => ({
            id: b.id,
            mac: b.macAddress,
            encryptionKey: b.key.encryptionKey,
            userKeyId: b.key.userKeyId,

            name: b.name,
            ownerName: b.ownerName,

            modelColor: b.modelColor,
            links: b.links,
        }))
    }

    async createBikeSharingInvitation(bike: Bike, email: string, durationInSeconds: undefined | number): Promise<void> {
        const body: any = {
            email,
            bikeId: bike.id,
            role: "user",
        }
        if (durationInSeconds !== undefined)
            body['duration'] = durationInSeconds

        let req = await fetch(`/api/api_vanmoof-api_com/createBikeSharingInvitation`, {
            method: 'POST',
            headers: {
                ...this.authHeader,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        return await checkErrorAndUnwrap(req)
    }

    async getCurrentShares(bikeid: number | string): Promise<Array<BikeShareEntry>> {
        let req = await fetch(`/api/api_vanmoof-api_com/getBikeSharingInvitationsForBike/${bikeid}`, {
            method: 'GET',
            headers: {
                ...this.authHeader,
                'Content-Type': 'application/json'
            }
        })
        const resp = await checkErrorAndUnwrap(req)
        return resp.invitations || []
    }

    async removeShareHolder(guid: string): Promise<any> {
        let req = await fetch(`/api/api_vanmoof-api_com/revokeBikeSharingInvitation/${guid}`, {
            method: 'POST',
            headers: {
                ...this.authHeader,
                'Content-Type': 'application/json'
            }
        })
        return await checkErrorAndUnwrap(req)
    }

    storeCredentialsInLocalStorage() {
        localStorage.setItem('vm-api-credentials', JSON.stringify(this.credentials))
    }

}

export const ApiContext = createContext<Api>(new Api({ token: 'dummy', refreshToken: 'dummy' }))
