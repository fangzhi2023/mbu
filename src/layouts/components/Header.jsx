import "./Header.scss"

import Logo from "./Logo";

function Header(props) {
    return (
        <div className="mbu-header">
            <Logo />
            <div className="content">
                {props.children}
            </div>
        </div>
    )
}

export default Header