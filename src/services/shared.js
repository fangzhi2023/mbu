import { formatResponse, mockToken } from "../mock/shared"

export async function login() {    
    return new Promise(resolve => {
        setTimeout(
            () => resolve(formatResponse(mockToken())),
        2000)
    })
}