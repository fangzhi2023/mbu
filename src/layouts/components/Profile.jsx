import { LoginOutlined } from "@ant-design/icons"
import { Avatar, Dropdown, Menu, Button } from "antd"
import { useNavigate } from "react-router"
import { delToken } from "../../store"

import "./Profile.scss"

function Profile(props) {

    const { adminInfo } = props

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
    const navigate = useNavigate()
    const handleClick = type => {
        switch(type) {
            case 'resume':
                navigate("/article")
                break;
            case 'logout':
                delToken()
                navigate("/shared/login")
                break;
        }
    }

    const handleLogin = () => {
        navigate("/shared/login")
    }

    return (
        <>
        { adminInfo && adminInfo.id 
            ? <Dropdown className="profile mbu-ss-hide" overlay={menu} placement="bottomRight" arrow>
                <span>
                <Avatar size={28} src={adminInfo.avatar} />
                <span className="name mbu-sm-hide">{ adminInfo.name || adminInfo.phone }</span>
                </span>
            </Dropdown>
            : <Button className="mbu-ss-hide" type="link" onClick={handleLogin} icon={<LoginOutlined />}><span className=" mbu-sm-hide">登录</span></Button>
        }
        </>
    )
}

export default Profile