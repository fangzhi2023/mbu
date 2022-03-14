
import { Outlet, Routes, Route, useParams, useNavigate } from "react-router"
import "./BaseLayout.scss"

import { Divider } from "antd"
import { ReloadOutlined, EditOutlined, ShareAltOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons"

import Header from "./components/Header"
import Search from "./components/Search"

function BaseLayout(props) {
    return (
        <div className="baseLayout">
            <Header className="header">
                <div className="left">
                    <h3>文档标题</h3>
                    <Divider type="vertical" />
                    <Search className="search" />
                </div>
                <div className="right">
                    <ReloadOutlined className="icon" />
                    <Routes>
                        <Route path="/:type/:id" element={<ViewOperations /> }>
                        </Route>
                        <Route path="/:type/:id/edit" element={<EditOperations />}>
                        </Route>
                    </Routes>
                    <Divider type="vertical" />
                </div>
            </Header>
            <main><Outlet /></main>
        </div>
    )
}

function ViewOperations() {
    const {type, id} = useParams()
    const navigator = useNavigate()

    const handleEdit = () => {
        console.log("okk", `/${type}/${id}/edit`)
        navigator({
            to: `/${type}/${id}/edit`,
            option: {
                replace: true
            }
        })
    }

    return (
        <span>
            <EditOutlined onClick={handleEdit} className="icon" />
            <ShareAltOutlined className="icon" />
        </span>
    )
}

function EditOperations() {
    return (
        <span>
            <CloseOutlined className="icon" />
            <SaveOutlined className="icon" />
        </span>
    )
}

export default BaseLayout;