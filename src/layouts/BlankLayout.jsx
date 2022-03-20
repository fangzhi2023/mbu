
import { Outlet } from "react-router"
import "./BlankLayout.scss"

import Footer from "./components/Footer"

function BlankLayout() {
    return (
        <div className="blankLayout">
            <main><Outlet /></main>
            <Footer />
        </div>
    )
}

export default BlankLayout