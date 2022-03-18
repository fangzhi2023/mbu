import Mock from "mockjs"
import markdown from "./data/markdown"

const model = {
    "id|+1": 1,
    "parentId|+1": 1,
    "authorId": 1,
    "title": "@ctitle(25)",
    "description": "@csentence(120)",
}

export const mockArticleInfo = id => {
    const data = Mock.mock(model)
    if (id) data.id = id
    return data
}

export const mockArticle = () => {
    return markdown
}
