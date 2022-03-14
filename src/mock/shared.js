import Mock from "mockjs"

export const formatResponse = (data, status = 200, message = "成功") => ({ data, status, message })

export const mockToken = () => Mock.mock({"token": "@string(40)"})
