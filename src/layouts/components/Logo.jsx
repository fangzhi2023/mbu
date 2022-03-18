
import { useNavigate } from "react-router"
import { Avatar } from "antd"

import "./Logo.scss"

import appConfig from "../../configs/app"

function Logo() {
    const navigate = useNavigate()
    const handleReturn = () => {
        navigate("/")
    }

    return (
        <div className="logo" onClick={handleReturn}>
            <Avatar size={32} src={appConfig.logo} />
            <span className="title mbu-sm-hide">{appConfig.name}</span>
        </div>
    )
}

export default Logo