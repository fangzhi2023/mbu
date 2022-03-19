import { mockToken, mockSetting } from "../mock/shared"
import { mockAuthor } from "../mock/author"

export async function login() {    
    return new Promise(resolve => {
        setTimeout(
            () => resolve(mockToken()),
        1000)
    })
}

export async function fetchSetting() {
    return new Promise(resolve => {
        setTimeout(
            () => resolve(mockSetting()),
        500)
    })
}

export async function fetchAuthor(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockAuthor(id))
        }, 1000)
    })
}