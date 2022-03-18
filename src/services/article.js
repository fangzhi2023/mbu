import { mockArticleInfo, mockArticle } from "../mock/article"

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
export async function createArticle() {
    return new Promise(resolve => {
        setTimeout(
            () => resolve({id: Date.now() + '' }),
        2000)
    })
}