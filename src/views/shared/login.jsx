import { Button } from "antd";
import { useNavigate } from "react-router";
import { login } from "../../store";

function Login() {

    const navigate = useNavigate()
    const handleLogin = () => {
        login("tottotot")
        navigate("/")
    }

    return (
        <div>
            <Button onClick={handleLogin}>登录</Button>
        </div>
    )
}

export default Login;