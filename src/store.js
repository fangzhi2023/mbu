/**
 * 临时数据管理
 */

import { delCookie, getCookie, setCookie } from "./utils/cookie"

const settingKey = "mbuSetting"
export function setSetting(setting) {
    window.localStorage.setItem(settingKey, JSON.stringify(setting))
}
export function getSetting() {
    try {
        return JSON.parse(window.localStorage.getItem(settingKey))
    } catch (err) {
        console.error(err)
        return null
    }
}

const userInfoKey = "mbuUserInfo"
export function setUserInfo(info) {
    window.localStorage.setItem(userInfoKey, JSON.stringify(info))
}
export function getUserInfo() {
    try {
        return JSON.parse(window.localStorage.getItem(userInfoKey))
    } catch (err) {
        console.error(err)
        return null
    }
}

const tokenKey = "token"
export function isLogin() {
    return !!getCookie(tokenKey)
}
export function login(token) {
    setCookie(tokenKey, token)
}
export function logout() {
    delCookie(tokenKey)
    window.localStorage.setItem(userInfoKey, null)
}