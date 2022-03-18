

import { useEffect, useState, Fragment } from "react"
import { Outlet, useNavigate, useLocation } from "react-router"
import { Button, Divider, Modal, Popover, Spin } from "antd"
import { ReloadOutlined, EditOutlined, ShareAltOutlined, SaveOutlined, CloseOutlined, LoadingOutlined, ArrowLeftOutlined, RollbackOutlined, NodeCollapseOutlined, InfoCircleOutlined, LoginOutlined } from "@ant-design/icons"

import "./BaseLayout.scss"

import Header from "./components/Header"
import Profile from "./components/Profile";
import { fetchSuiteInfo } from "../services/suite"
import { fetchArticleInfo } from "../services/article"
import { fetchAdmin } from "../services/admin"
import { getUserInfo, setUserInfo } from "../store"
import Author from "./components/Author"
import eventBus from "../utils/event-bus"

function BaseLayout() {
    // 获取用户信息
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function fetchAdminInfo() {
            try {
                const data = await fetchAdmin()
                setUserInfo(data)
                setLoading(false)
            } catch (err) {
                setLoading(false)
            }
        }
        fetchAdminInfo()
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

    // 获取URL参数
    const { pathname } = useLocation()
    const regExp = pathname.match(/^\/(suite|article)\/?([0-9]+)?(\/edit)?/)
    let type = 'suite', id, isEditing
    if (regExp) {
        type = regExp[1]
        id = regExp[2]
        isEditing = !!regExp[3]
    }
    const [loading, setLoading] = useState(true)
    const [info,setInfo] = useState({})

    let [editable, setEditable] = useState(false)

    useEffect(() => {
        setLoading(true)
        async function fetchInfo() {
            let request = type === "suite" ? fetchSuiteInfo(id) : fetchArticleInfo(id)
            const data = await request
            
            editable = adminInfo && adminInfo.id === data.authorId
            if (!editable && isEditing) {
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
                        : <HeaderAction type={type} info={info} editable={editable} isEditing={isEditing} />
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
        navigate( `/suite/${info.parentId}`)
    }

    return (
        <div>
            { info.parentId 
            ? <Fragment>
                <Button onClick={handleReturn} type="link" size="small" title="返回上级目录" icon={<NodeCollapseOutlined />}></Button> 
                <Divider type="vertical" />
            </Fragment>
            : "" }
            <h3>{ info.title }</h3> 
            <Popover 
                placement="bottomLeft" 
                mouseEnterDelay={0.5} 
                title={info.title} 
                arrowPointAtCenter 
                overlayStyle={{width: "400px"}}
                content={<div style={{textIndent: "1em"}}>
                    {info.description}
                    { editable ? <Button type="link" size="small" icon={<EditOutlined />} /> : null }
                </div>}>
                <Button type="link" size="small" style={{color: "grey"}} icon={<InfoCircleOutlined />}></Button>
            </Popover>
            </div>
    )

}

function HeaderAction(props) {
    
    const [modal, contextHolder] = Modal.useModal()

    const { type, info, editable, isEditing } = props

    const navigate = useNavigate()

    const handleReload = () => {
        let path = `/${type}/${info.id}`
        if (isEditing) {
            path += "/edit"
        }
        navigate(path, { replace: true, state: { uKey: Date.now() } })
    }
    const handleEdit = () => {
        navigate( `/${type}/${info.id}/edit`, { replace: true })
    }
    const handleCancelEdit = () => {
        eventBus.publish("cancelEdit")
    }
    const handleSave = () => {
        const key = "key" + Date.now()
        eventBus.subscribe("saveSuccess", key2 => {
            if (key2 !== key) return
        })
        eventBus.publish("save", key)
    }

    return (
        <div className="action mbu-xs-hide">
            <ReloadOutlined onClick={handleReload} className="icon" />
            { editable 
                ? isEditing 
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