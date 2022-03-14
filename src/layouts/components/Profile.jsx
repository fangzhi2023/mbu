import { Avatar } from "antd"

import "./Profile.scss"

function Profile() {
    return (
        <div className="profile">
            <Avatar size={28} />
            <span className="name">fangzhi2023</span>
        </div>
    )
}

export default Profile