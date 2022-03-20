import request from "../utils/request"

export async function fetchSuiteInfo(suiteId) {   
    return request.get("/suite/fetchSuiteInfo", {
        params: { suiteId }
    })
}

export async function fetchSuite(suiteId) {   
    return request.get("/suite/fetchSuite", {
        params: { suiteId }
    })
}

export async function createSuiteInfo(suite) { 
    return request.post("/suite/createSuiteInfo", suite)
}

export async function updateSuiteInfo(suite) { 
    return request.put("/suite/updateSuiteInfo", suite)
}

export async function updateSuiteData(suite) { 
    return request.put("/suite/updateSuiteData", suite)
}

export async function deleteSuite(suite) { 
    return request.delete("/suite/deleteSuite", suite)
}

export async function fetchSuitesInfoByParentId(parentId) {
    return request.get("/suite/fetchSuitesInfoByParentId", {
        params: { parentId }
    })
}

