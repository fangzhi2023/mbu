import Mock from "mockjs"

export const mockToken = () => Mock.mock({"token": "@string(40)"})

export const mockSetting = () => ({suiteId: 1, articleId: 11})
