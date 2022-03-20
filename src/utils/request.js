import axios from "axios"
import qs from "qs"
import config from "../configs/axios"
import { getToken } from "../store"

const instance = axios.create({
    baseURL: config.host + config.prex,  
    headers: {
        'Content-Type': "application/json"
    },
})

instance.interceptors.request.use(config => {

    config.headers.token = getToken()

    if (
        config.data &&
        config.headers['Content-Type'] ===
          'application/x-www-form-urlencoded;charset=UTF-8'
      ) {
        config.data = qs.stringify(config.data)
      }

    return config
})

instance.interceptors.response.use( 
    response => {
        const { data: { data, code, message } } = response
        if (code === 200) {
            return Promise.resolve(data)
        }
        return Promise.reject({ code, message })
    },
    error => {
        console.error(error)
        return Promise.reject({ code: 500, message: error.message })
    }
)

export default instance