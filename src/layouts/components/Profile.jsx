import { Avatar, Dropdown, Menu } from "antd"
import { useNavigate } from "react-router"
import { logout } from "../../store"

import "./Profile.scss"

function Profile(props) {

    const navigate = useNavigate()
    const handleClick = type => {
        switch(type) {
            case 'resume':
                navigate("/article")
                break;
            case 'logout':
                logout()
                navigate("/shared/login")
                break;
        }
    }
    
    const menu = (
        <Menu style={{width: "100px"}}>
            <Menu.Item onClick={() => handleClick('resume')} key="resume" >
                我的简历
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={() => handleClick('logout')} key="logout" >
                登出
            </Menu.Item>
        </Menu>
    )

    const { info } = props
    return (
        <Dropdown className="profile mbu-ss-hide" overlay={menu} placement="bottomRight" arrow>
            <span>
            <Avatar size={28} src={info.avatar} />
            <span className="name mbu-sm-hide">{ info.name }</span>
            </span>
        </Dropdown>
    )
}

export default Profile