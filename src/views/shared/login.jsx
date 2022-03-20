import { SafetyOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../../services/shared"
import { setToken, delToken } from "../../store"

function Login() {

    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const handleLogin = async values => {
        try {
            setLoading(true)
            const { token } = await login(values)
            delToken()
            setToken(token)
            message.success("登录成功")
            setTimeout(() => {
                navigate("/", { replace: true, state: { appKey: Date.now() } })
            }, 1000)
        } catch (error) {
            setLoading(false)
            message.warn(error.message)
        }
    }

    return (
        <Form 
            form={form}
            onFinish={handleLogin}>
            <Form.Item 
                name="phone"
                rules={[{ required: true, message: "请输入手机号" }]}>
                <Input placeholder="请输入手机号" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item 
                name="password" 
                rules={[{ required: true, message: "请输入密码" }]}>
                <Input type="password" placeholder="请输入密码" prefix={<SafetyOutlined />} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary" block loading={loading}>登录</Button>
            </Form.Item>
        </Form>
    )
}

export default Login;