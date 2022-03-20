

import { useEffect, useState, Fragment } from "react"
import { Outlet, useNavigate, useLocation } from "react-router"
import { Button, Divider, message, Popover, Spin } from "antd"
import { ReloadOutlined, EditOutlined, ShareAltOutlined, SaveOutlined, CloseOutlined, LoadingOutlined, NodeCollapseOutlined, InfoCircleOutlined, LoginOutlined } from "@ant-design/icons"

import "./HeaderLayout.scss"

import Header from "./components/Header"
import Profile from "./components/Profile";
import { fetchSuiteInfo } from "../services/suite"
import { fetchArticleInfo } from "../services/article"
import { getSetting, getUserInfo, isLogin } from "../store"
import Author from "./components/Author"
import eventBus from "../utils/event-bus"

// 获取默认suiteId/articleId
export const getDefaultId = type => {
    let data = {}
    if (isLogin()) {
        data = getUserInfo()
    } else {
        data = getSetting()
    }
    return type === "article" ? data.articleId : data.suiteId
}

function HeaderLayout() {
    
    // TODO：设计上存在问题，待改进
    let type = 'suite', editing = false, id
    const { pathname } = useLocation()
    const regExp = pathname.match(/^\/(suite|article)\/?([\w]+)?(\/edit)?/)
    if (regExp) {
        type = regExp[1]
        editing = !!regExp[3]
        id = regExp[2]
    }
    if (!id) {
        id = type === "suite" ? getDefaultId("suite") : getDefaultId("article")
    }

    const [loading, setLoading] = useState(true)
    const [info,setInfo] = useState({})

    let [editable, setEditable] = useState(false)

    const [adminInfo] = useState(getUserInfo())
    console.log(id, adminInfo)

    const navigate = useNavigate()
    useEffect(() => {
        setLoading(true)
        async function fetchInfo() {
            try {
                let request
                if(type === "suite") {
                    request = fetchSuiteInfo(id)
                } else {
                    request = fetchArticleInfo(id)
                }
                const data = await request

                editable = adminInfo && adminInfo.id === data.authorId
                if (!editable && editing) {
                    navigate("/shared/401")
                    return;
                }
                setEditable(editable)
                setInfo(data)
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
        fetchInfo()
    }, [id, type])

    return (
        <div className="headerLayout">
            <Header className="header">
                <div className="left">                  
                    { loading
                        ? <LoadingOutlined title="标题加载中..." /> 
                        : <HeaderTitle info={info} editable={editable} />
                    }
                </div>
                <div className="right">
                    { loading
                        ? "" 
                        : <HeaderAction type={type} info={info} editable={editable} editing={editing} />
                    }
                    <Profile adminInfo={adminInfo} />
                </div>
            </Header>
            <main className={!loading && !editable && type==="article" ? "author-margin" : ""}>
                { !loading && !editable ? <Author authorId={info.authorId} /> : "" } 
                <Outlet />
            </main>
        </div>
    )
}

function HeaderTitle(props) {

    const { info, editable } = props

    const navigate = useNavigate()
    const handleReturn = () => {
        navigate( `/suite/${info.parentId || info.suiteId}`)
    }

    return (
        <div>
            { info.parentId || info.suiteId
            ? <Fragment>
                <Button onClick={handleReturn} type="link" size="small" title="返回上级模块" icon={<NodeCollapseOutlined />}></Button> 
                <Divider type="vertical" />
            </Fragment>
            : "" }
            <h3>{ info.title }</h3> 
            { editable || info.description ? <Popover 
                placement="bottomLeft" 
                mouseEnterDelay={0.5} 
                title={info.title} 
                arrowPointAtCenter 
                overlayStyle={{width: "400px"}}
                content={<div style={{textIndent: "1em"}}>
                    {info.description || '[暂无描述]'}
                    { editable ? <Button type="link" size="small" className="icon" icon={<EditOutlined />} /> : null }
                </div>}>
                <Button type="link" size="small" style={{color: "grey"}} icon={<InfoCircleOutlined />}></Button>
            </Popover> : null }
            </div>
    )

}

function HeaderAction(props) {

    const { type, info, editable, editing } = props

    const navigate = useNavigate()

    const handleReload = () => {
        if (editing) {
            eventBus.publish("checkChanged", null, () => {
                let path = `/${type}/${info.id}/edit`
                navigate(path, { replace: true, state: { layoutKey: Date.now() } })
            })
        } else {
            let path = `/${type}/${info.id}`
            navigate(path, { replace: true, state: { layoutKey: Date.now() } })
        }
    }
    const handleEdit = () => {
        navigate( `/${type}/${info.id}/edit`, { replace: true })
    }
    const handleCancelEdit = () => {
        eventBus.publish("checkChanged", null, () => {
            let path = `/${type}/${info.id}`
            navigate(path, { replace: true, state: { layoutKey: Date.now() } })
        })
    }
    const handleSave = () => {
        eventBus.publish("save", null, () => {
            message.success("保存成功")
        })
    }

    return (
        <div className="action mbu-xs-hide">
            <ReloadOutlined onClick={handleReload} className="icon" />
            { editable 
                ? editing 
                ? <Fragment>
                    <CloseOutlined onClick={handleCancelEdit} className="icon" />
                    <SaveOutlined onClick={handleSave} className="icon" />
                </Fragment>
                : <Fragment>
                    <EditOutlined onClick={handleEdit} className="icon mbu-sm-hide" />
                    <ShareAltOutlined className="icon" />
                </Fragment>
                : ""
            }
            <Divider type="vertical" />
        </div>
    )
}

export default HeaderLayout