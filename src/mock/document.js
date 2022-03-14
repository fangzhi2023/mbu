import Mock from "mockjs"

const model = {
    "id": "@number(100)",
    "content": "@csentence(400)",
}

export const mockDocument = () => Mock.mock(model)
