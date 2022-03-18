/**
 * 临时数据管理
 */

import { delCookie, getCookie, setCookie } from "./utils/cookie"

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