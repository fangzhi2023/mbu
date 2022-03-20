import request from "../utils/request"

export async function login(data) {
    return request.post("/shared/login", data)
}

export async function fetchSetting() {
    return request.get("/shared/fetchSetting")
}

export async function fetchAuthorInfo(authroId) {
    return request.get("/shared/fetchAuthorInfo", {
        authroId
    })
}

export async function fetchAuthorShare(authroId) {
    return request.get("/shared/fetchAuthorShare", {
        authroId
    })
}