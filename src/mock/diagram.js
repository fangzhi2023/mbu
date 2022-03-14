import Mock from "mockjs"

const model = {
    "title": "@cname(20)",
    "description": "@csentence(120)",
}

export const mockDiagram = () => Mock.mock(model)