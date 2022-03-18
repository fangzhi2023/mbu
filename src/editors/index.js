export const editors = [
    {
        id: "graphMap",
        name: "关系图",
        description: "展示关系数据图"
    },
    {
        id: "mindMap",
        name: "思维导图",
        description: "展示思维导图数据图"
    }
]

export const editorMap = {}
editors.forEach(editor => {
    editorMap[editor.id] = editor
})

export const dynamicLoad = async type => {
    if (!editorMap[type]) {
        console.error(`不存在类型:${type}的编辑器`)
        return
    }
    const name = type[0].toUpperCase() + type.slice(1)
    return import(`./${name}.jsx`)
}
