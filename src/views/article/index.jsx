

import { useEffect, useState } from "react"
import { Spin, message, Modal } from "antd"
import Markdown from "./components/Markdown"
import eventBus from "../../utils/event-bus"

import { fetchArticle, updateArticleContent } from "../../services/article"
import { useLocation, useParams, useNavigate } from "react-router"
import { getDefaultId } from "../../layouts/HeaderLayout"
import { ExclamationCircleOutlined } from "@ant-design/icons"

const style = {
    width: "100%", 
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
}

function Article(props) {
    const { editing } = props

    let { id } = useParams()
    if (!id) id = getDefaultId("article")

    const { state } = useLocation()

    let [uKey, setUKey] = useState(null)
    if (state && state.layoutKey !== uKey) {
        setUKey(state.layoutKey)
    }

    let [loading, setLoading] = useState(true)
    let [content, setContent] = useState("")
    let [isChanged, setIsChanged] = useState(null)
    let [newContent, setNewContent] = useState("")

    const navigate = useNavigate()
    useEffect(() => {
        setIsChanged(null)
        setLoading(true)
        async function fetchArticleContent() {
            try {
                const data = await fetchArticle(id)
                setContent(data.content)
                setLoading(false)
            } catch (err) {
                switch(err.code) {
                    case 401:
                        navigate("/shared/401")
                        return
                    case 404:
                        navigate("/shared/404")
                        return
                    default:
                        message.warn(err.message)
                }
            }
        }
        fetchArticleContent()
    }, [id, uKey, editing])

    useEffect(() => {
        const checkChangedSub = eventBus.subscribe("checkChanged", (params, cb) => {
            if(isChanged) {
                Modal.confirm({
                    title: '存在未保存内容',
                    icon: <ExclamationCircleOutlined />,
                    content: '如想中断当前操作，请点击右上角关闭图标',
                    closable: true,
                    okText: '保存后执行',
                    onOk: async () => {
                        try {
                            await updateArticleContent({ id, content: newContent })
                            setIsChanged(false)
                            cb && cb()
                        } catch (err) {
                            message.error("保存异常")
                        }
                    },
                    cancelButtonProps: { danger: true },
                    cancelText: '放弃保存',
                    onCancel: e => {
                        // 点击右上角关闭图标，则只是中断操作
                        if (e && e.triggerCancel) return
                        
                        // e == close
                        e()
                        setIsChanged(false)
                        cb && cb()
                    }
                });
                return
           }
           cb && cb()
        })
        const saveSub = eventBus.subscribe("save", async (params, cb) => {
            if (isChanged) {
                try {
                    await updateArticleContent({
                        id,
                        content: newContent
                    })
                    setIsChanged(false)
                    cb && cb()
                } catch (err) {
                    console.error(err)
                }
            } else {
                cb && cb()
            }
         })
         return ()  => {
            checkChangedSub.unsubscribe()
            saveSub.unsubscribe()
         }
    }, [isChanged, newContent])


    const handleChange = getContent => {
        // 跳过markdown初次渲染触发的onChange
        if (isChanged ===null) {
            setIsChanged(false)
        } else {
            const c = getContent()
            setNewContent(c)
            setIsChanged(true)
        }
    }

    return (
        <div style={style}>
            { loading ? <Spin tip="加载内容..." /> : <Markdown readOnly={!editing} value={content} onChange={handleChange} /> }
        </div>
    )
}

export default Article;