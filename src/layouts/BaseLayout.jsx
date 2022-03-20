
import { useState } from "react"
import { Outlet } from "react-router"
import { getUserInfo } from "../store"
import "./BaseLayout.scss"

import Footer from "./components/Footer"
import Header from "./components/Header"
import Profile from "./components/Profile"

function BaseLayout() {
    
    const [adminInfo] = useState(getUserInfo())

    return (
        <div className="baseLayout">
            <Header className="header">
                <div className="left">
                </div>
                <div className="right">
                    <Profile adminInfo={adminInfo} />
                </div>
            </Header>
            <main><Outlet /></main>
            <Footer />
        </div>
    )
}

export default BaseLayout;