import Mock from "mockjs"
import graphMapData from "./data/graph-map"
import mindMapData from "./data/mind-map"

const model = {
    "id|+1": 1,
    "parentId|+1": 1,
    "authorId": 1,
    "title": "@ctitle(25)",
    "description": "@csentence(120)",
}

export const mockSuiteInfo = id => {
    const dia = Mock.mock(model)
    if (id) { dia.id = id }
    return dia
}

const dataMap = {
    "graphMap": graphMapData,
    "mindMap": mindMapData
}

export const mockSuite = (id = 1) => { 
    const type = 'mindMap'   
    return {
        id,
        editor: type,
        data: dataMap[type]
    }
}