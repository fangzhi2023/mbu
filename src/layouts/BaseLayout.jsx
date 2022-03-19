

import { useEffect, useState, Fragment } from "react"
import { Outlet, useNavigate, useLocation } from "react-router"
import { Button, Divider, message, Popover, Spin } from "antd"
import { ReloadOutlined, EditOutlined, ShareAltOutlined, SaveOutlined, CloseOutlined, LoadingOutlined, NodeCollapseOutlined, InfoCircleOutlined, LoginOutlined } from "@ant-design/icons"

import "./BaseLayout.scss"

import Header from "./components/Header"
import Profile from "./components/Profile";
import { fetchSuiteInfo } from "../services/suite"
import { fetchArticleInfo } from "../services/article"
import { fetchAdmin } from "../services/admin"
import { getSetting, getUserInfo, setUserInfo, setSetting, isLogin } from "../store"
import Author from "./components/Author"
import eventBus from "../utils/event-bus"
import { fetchSetting } from "../services/shared"

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

function BaseLayout() {
    const navigate = useNavigate()

    // 获取用户信息
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function fetchSystemInfo() {
            try {
                const setting = await fetchSetting()
                setSetting(setting)
                try {
                    const admin = await fetchAdmin()
                    setUserInfo(admin)
                    setLoading(false)
                } catch (err) {
                    setLoading(false)
                }
            } catch (err) {
                console.err(err)
                navigate("/shared/505")
            }
        }
        fetchSystemInfo()
    }, [])

    return (
        <div className="baseLayout">
            { loading ? <div className="loading"><Spin /></div> : <ContentLayout /> }
        </div>
    )
}

function ContentLayout() {

    const [adminInfo] = useState(getUserInfo())

    const navigate = useNavigate()
    const handleLogin = () => {
        navigate("/shared/login")
    }
    
    // TODO：设计上存在问题，待改进
    let type = 'suite', editing = false, id
    const { pathname } = useLocation()
    const regExp = pathname.match(/^\/(suite|article)\/?([0-9]+)?(\/edit)?/)
    if (regExp) {
        type = regExp[1]
        editing = !!regExp[3]
        id = regExp[2]
    }
    if (!id) id = getDefaultId("suite")

    const [loading, setLoading] = useState(true)
    const [info,setInfo] = useState({})

    let [editable, setEditable] = useState(false)

    useEffect(() => {
        setLoading(true)
        async function fetchInfo() {
            let request = type === "suite" ? fetchSuiteInfo(id) : fetchArticleInfo(id)
            const data = await request

            editable = adminInfo && adminInfo.id === data.authorId
            if (!editable && editing) {
                navigate("/shared/401")
                return;
            }
            setEditable(editable)
            setInfo(data)
            setLoading(false)
        }
        fetchInfo()
    }, [id, type])

    return (
        <Fragment>
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
                    { adminInfo && adminInfo.id 
                            ? <Profile info={adminInfo} />
                            : <Button className="mbu-ss-hide" type="link" onClick={handleLogin} icon={<LoginOutlined />}><span className=" mbu-sm-hide">登录</span></Button>
                    }
                </div>
            </Header>
            <main className={!loading && !editable && type==="article" ? "author-margin" : ""}>
                { !loading && !editable ? <Author authorId={info.authorId} /> : "" } 
                <Outlet />
            </main>
        </Fragment>
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
                navigate(path, { replace: true, state: { uKey: Date.now() } })
            })
        } else {
            let path = `/${type}/${info.id}`
            navigate(path, { replace: true, state: { uKey: Date.now() } })
        }
    }
    const handleEdit = () => {
        navigate( `/${type}/${info.id}/edit`, { replace: true })
    }
    const handleCancelEdit = () => {
        eventBus.publish("checkChanged", null, () => {
            let path = `/${type}/${info.id}`
            navigate(path, { replace: true, state: { uKey: Date.now() } })
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

export default BaseLayout