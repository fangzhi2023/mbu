import { Avatar } from "antd"

import "./Logo.scss"

import appConfig from "../../configs/app"

function Logo() {
    return (
        <div className="logo">
            <Avatar size={32} src={appConfig.logo} />
            <span className="title">{appConfig.name}</span>
        </div>
    )
}

export default Logo