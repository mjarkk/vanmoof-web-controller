import type { BikeCredentials } from './bike'
import { createContext } from 'react'

export const API_KEY = 'fcb38d47-f14b-30cf-843b-26283f6a5819'

export interface ApiCredentials {
    token: string
    refreshToken: string
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

    async getBikeCredentials(): Promise<Array<BikeCredentials>> {
        const req = await fetch(`/api/my_vanmoof_com/getCustomerData?includeBikeDetails`, {
            headers: {
                'Api-Key': API_KEY,
                'Authorization': 'Bearer ' + this.credentials.token,
            }
        })

        if (req.status >= 400)
            throw await req.text()

        const resp = await req.json()

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

    async createBikeSharingInvitation(shareinfo: any): Promise<any> {
        let req = await fetch(`/api/api_vanmoof-api_com/createBikeSharingInvitation`, {
            method: 'POST',
            headers: {
                'Api-Key': API_KEY,
                'Authorization': 'Bearer ' + this.credentials.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(shareinfo)
        })

        if (req.status === 200) {
            return await req.json()
        } else {
            let text = await req.text()
            try {
                text = JSON.parse(text);
            } catch {}
            return text
        }
    }

    async getCurrentShares(bikeid: number | string): Promise<any> {
        let req = await fetch(`/api/api_vanmoof-api_com/getBikeSharingInvitationsForBike/${bikeid}`, {
            method: 'GET',
            headers: {
                'Api-Key': API_KEY,
                'Authorization': 'Bearer ' + this.credentials.token,
                'Content-Type': 'application/json'
            }
        })

        return await req.json()
    }

    async RemoveShareHolder(): Promise<any> {
        // let req = await fetch(`/api/api_vanmoof-api_com/getBikeSharingInvitationsForBike/${bikeid}`, {
        //     method: 'GET',
        //     headers: {
        //         'Api-Key': API_KEY,
        //         'Authorization': 'Bearer ' + this.credentials.token,
        //         'Content-Type': 'application/json'
        //     }
        // })

        // return await req.json()
        return "test"
    }

    storeCredentialsInLocalStorage() {
        localStorage.setItem('vm-api-credentials', JSON.stringify(this.credentials))
    }

}

export const ApiContext = createContext<Api>(new Api({ token: 'dummy', refreshToken: 'dummy' }))
