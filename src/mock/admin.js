import Mock from "mockjs"

const model = {
    "id": 1,
    "name": "@cname(4)",
    "avatar": "@image",
}

export const mockAdmin = () => Mock.mock(model)