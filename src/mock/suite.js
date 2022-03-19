import graphMapData from "./data/graph-map"
import mindMapData from "./data/mind-map"

export const mockSuiteInfo = id => { 
    if (graphMapData[id]) {
        return { ...graphMapData[id], data: null }
    }    
    if (mindMapData[id]) {
        return { ...mindMapData[id], data: null }
    }
    return { ...graphMapData[100], data: null }
}

export const mockSuite = (id) => { 
    if (graphMapData[id]) {
        return graphMapData[id]
    }    
    if (mindMapData[id]) {
        return mindMapData[id]
    }
    return graphMapData[100]
}

export const mockSuitesInfoByParentId = parentId => { 
    const list = [...Object.values(graphMapData), ...Object.values(mindMapData)]
    return list.filter(item => item.parentId === parentId).map(item => {
        return { ...item, data: null }
    })
}
