import Mock from "mockjs"

const model = {
    id: 1,
    suiteId: 101,
    articleId: 102, 
    name: "@cname(4)",
    avatar: "@image",
}

export const mockAuthor = id => {
    const data = Mock.mock(model)
    if (id == 1) {
        data.id = 1
        data.suiteId = 1
        data.articleId = 1
        data.name = "温建壮"
    }

    return data
}