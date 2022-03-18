

import { useEffect, useState } from "react"
import { Spin } from "antd"
import Markdown from "./components/Markdown"

import { fetchArticle } from "../../services/article"
import { useLocation, useParams } from "react-router"

const style = {
    width: "100%", 
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}

function Article(props) {
    const { id } = useParams()
    const { state } = useLocation()

    let [uKey, setUKey] = useState(null)
    if (state && state.uKey !== uKey) {
        setUKey(state.uKey)
    }

    let [loading, setLoading] = useState(true)
    let [content, setContent] = useState("")

    useEffect(() => {
        setLoading(true)
        async function fetchArticleContent() {
            const data = await fetchArticle(id)
            setContent(data.content)
            setLoading(false)
        }
        fetchArticleContent()
    }, [id, uKey])

    const handleChange = getContent => {
        const content = getContent()
        console.log(content)
        window.a = content
    }

    const inEditing = props.status === "editing"

    return (
        <div style={style}>
            { loading ? <Spin tip="加载内容..." /> : <Markdown readOnly={!inEditing} value={content} onChange={handleChange} /> }
        </div>
    )
}

export default Article;