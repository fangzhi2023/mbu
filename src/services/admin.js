import { mockAdmin } from "../mock/admin"
import { isLogin } from "../store"

export async function fetchAdmin() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isLogin()) {
                resolve(mockAdmin())
            } else {
                reject("暂未登录")
            }
        }, 2000)
    })
}
export async function fetchAuthor(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockAdmin(id))
        }, 2000)
    })
}