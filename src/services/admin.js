import { mockAuthor } from "../mock/author"
import { isLogin } from "../store"

export async function fetchAdmin() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isLogin()) {
                resolve(mockAuthor(1))
            } else {
                reject("暂未登录")
            }
        }, 2000)
    })
}