import { mockArticleInfo, mockArticle, mockArticlesInfoBySuiteId } from "../mock/article"

export async function fetchArticleInfo(id) {
    return new Promise(resolve => {
        setTimeout(
            () => resolve(mockArticleInfo(id)),
        2000)
    })
}

export async function fetchArticle(id) {
    return new Promise(resolve => {
        setTimeout(
            () => resolve(mockArticle(id)),
        2000)
    })
}
export async function createArticleInfo(data) {
    return new Promise(resolve => {
        setTimeout(
            () => resolve({id: Date.now() + '' }),
        2000)
    })
}
export async function updateArticleInfo(data) {
    return new Promise(resolve => {
        setTimeout(
            () => resolve({id: Date.now() + '' }),
        2000)
    })
}
export async function updateArticleContent(data) {
    console.log(JSON.stringify(data.data))
    return new Promise(resolve => {
        setTimeout(
            () => resolve({id: Date.now() + '' }),
        2000)
    })
}

export async function fetchArticlesInfoBySuiteId(suiteId) {
    return new Promise(resolve => {
        setTimeout(
            () => resolve(mockArticlesInfoBySuiteId(suiteId)),
        2000)
    })
}