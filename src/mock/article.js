import markdownMap from "./data/markdown"

export const mockArticleInfo = id => { 
    if (markdownMap[id]) {
        return { ...markdownMap[id], data: null }
    }
    return { ...markdownMap[100], data: null }
}

export const mockArticle = (id) => { 
    if (markdownMap[id]) {
        return markdownMap[id]
    }
    return markdownMap[100]
}

export const mockArticlesInfoBySuiteId = suiteId => { 
    const list = Object.values(markdownMap)
    return list.filter(item => item.suiteId === suiteId).map(item => {
        return { ...item, data: null }
    })
}