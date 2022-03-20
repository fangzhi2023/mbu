import { isLogin } from "../store"
import request from "../utils/request"

export async function fetchAdmin() {
    if (isLogin()) {
        return request("/admin/fetchAdmin")
    } else {
        return Promise.reject("暂未登录")
    }
}