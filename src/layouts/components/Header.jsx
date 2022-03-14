import "./Header.scss"

import Logo from "./Logo";
import Profile from "./Profile";

function Header(props) {
    return (
        <div className="header">
            <Logo />
            <div className="center">
                {props.children}
            </div>
            <Profile />
        </div>
    )
}

export default Header