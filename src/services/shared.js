import { mockToken } from "../mock/shared"

export async function login() {    
    return new Promise(resolve => {
        setTimeout(
            () => resolve(mockToken()),
        2000)
    })
}