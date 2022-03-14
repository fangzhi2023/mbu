
import Markdown from "./components/Markdown"

import { fetchDocument } from "../../services/document"
import { useEffect, useState } from "react";

function Document(props) {

    let [content, setContent] = useState("")

    useEffect(() => {
        async function fetchDocumentContent() {
            const { data } = await fetchDocument()
            setContent(data.content)
        }
        fetchDocumentContent()
    }, [])

    const handleChange = newContent => {
        console.log(newContent())
    }

    return (
        <Markdown readOnly={props.status !== "editing"} value={content} onChange={handleChange} />
    )
}

export default Document;