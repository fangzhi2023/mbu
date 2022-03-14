import Mock from "mockjs"

const model = {
    "name": "@cname(4)",
    "avatar": "@image",
}

export const mockAdmin = () => Mock.mock(model)