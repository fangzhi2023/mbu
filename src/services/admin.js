import { formatResponse } from "../mock/shared"
import { mockAdmin } from "../mock/admin"

export async function fetchAdmin() {
    return new Promise(resolve => {
        setTimeout(
            () => resolve(formatResponse(mockAdmin())),
        2000)
    })
}