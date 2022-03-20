import { useEffect, useState } from "react"
import {  useNavigate, useLocation } from "react-router"
import { Spin } from "antd"

import { fetchAdmin } from "./services/admin"
import { fetchSetting } from "./services/shared"
import { setUserInfo, setSetting } from "./store"


import Layout from './layouts/components/Layout'
import AppRoute from "./AppRoute"

function App() {

  // 获取系统设置
  const navigate = useNavigate()
  useEffect(() => {
      async function fetchSystemInfo() {
          try {
              const setting = await fetchSetting()
              setSetting(setting)
          } catch (err) {
              console.error(err)
              navigate("/shared/505")
          }
      }
      fetchSystemInfo()
  }, [])

  const [loading, setLoading] = useState(true)
  // 登录后需重新获取用户信息
  const { state } = useLocation()
  let [uKey, setUKey] = useState(null)
  if (state && state.appKey !== uKey) {
      setUKey(state.appKey)
      setLoading(true)
  }

  // 获取系统设置和用户信息
  useEffect(() => {
    setLoading(true)
    async function fetchAdminInfo() {
        try {
            const admin = await fetchAdmin()
            setUserInfo(admin)
            setLoading(false)
        } catch (err) {
            setLoading(false)
        }
    }
    fetchAdminInfo()
  }, [uKey])

  return (
    <Layout>
          { loading ? <div className="loading"><Spin /></div> : <AppRoute /> }
     </Layout>
  )
}

export default App;
