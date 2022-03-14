import "./Footer.scss"

import appConfig from "../../configs/app"

function Footer() {
    return (
        <footer className="footer">
            <label>{appConfig.name}</label>
            <small className="slogan">{appConfig.slogan}</small>
            <small>@ 2022</small>
        </footer>
    )
}

export default Footer