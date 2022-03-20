import request from "../utils/request"

export async function fetchArticleInfo(articleId) {   
    return request.get("/article/fetchArticleInfo", {
        params: { articleId }
    })
}

export async function fetchArticle(articleId) {   
    return request.get("/article/fetchArticle", {
        params: { articleId }
    })
}

export async function createArticleInfo(article) { 
    return request.post("/article/createArticleInfo", article)
}

export async function updateArticleInfo(article) { 
    return request.put("/article/updateArticleInfo", article)
}

export async function updateArticleContent(article) { 
    return request.put("/article/updateArticleContent", article)
}

export async function deleteArticle(article) { 
    return request.delete("/article/deleteArticle", article)
}

export async function fetchArticlesInfoBySuiteId(suiteId) {
    return request.get("/article/fetchArticlesInfoBySuiteId", {
        params: { suiteId }
    })
}
