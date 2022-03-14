import { formatResponse } from "../mock/shared"
import { mockDiagram } from "../mock/diagram"

export async function fetchDiagram() {    
    return new Promise(resolve => {
        setTimeout(
            () => resolve(formatResponse(mockDiagram())),
        2000)
    })
}