import { formatResponse } from "../mock/shared"
import { mockDocument } from "../mock/document"

export async function fetchDocument() {
    return new Promise(resolve => {
        setTimeout(
            () => resolve(formatResponse(mockDocument())),
        2000)
    })
}