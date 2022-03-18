import { mockSuiteInfo, mockSuite } from "../mock/suite"

export async function fetchSuiteInfo(id) {    
    return new Promise(resolve => {
        setTimeout(
            () => resolve(mockSuiteInfo(id)),
        2000)
    })
}

export async function fetchSuite(id) {
    return new Promise(resolve => {
        setTimeout(
            () => resolve(mockSuite(id)),
        2000)
    })
}

export async function createSuite() {
    return new Promise(resolve => {
        setTimeout(
            () => resolve({ id: Date.now() + '' }),
        2000)
    })
}