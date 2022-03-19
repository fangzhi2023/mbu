import { mockSuiteInfo, mockSuite, mockSuitesInfoByParentId } from "../mock/suite"

export async function fetchSuiteInfo(id) {    
    return new Promise(resolve => {
        setTimeout(
            () => resolve(mockSuiteInfo(id)),
        1000)
    })
}

export async function fetchSuite(id) {
    return new Promise(resolve => {
        setTimeout(
            () => resolve(mockSuite(id)),
        1000)
    })
}

export async function createSuiteInfo() {
    return new Promise(resolve => {
        setTimeout(
            () => resolve({ id: Date.now() + '' }),
        1000)
    })
}

export async function updateSuiteInfo() {
    return new Promise(resolve => {
        setTimeout(
            () => resolve({ id: Date.now() + '' }),
        1000)
    })
}

export async function updateSuiteData(data) {
    console.log(JSON.stringify(data.data))
    return new Promise(resolve => {
        setTimeout(
            () => resolve({ id: Date.now() + '' }),
        1000)
    })
}

export async function fetchSuitesInfoByParentId(parentId) {
    return new Promise(resolve => {
        setTimeout(
            () => resolve(mockSuitesInfoByParentId(parentId)),
        1000)
    })
}

