
export const getDomain = () => {
  const host = window.location.host;
  const t = host.match(/[^.]*\.([^.]*\.[\w]*)/)
  return t ? t[1] : "localhost"
}

export const setCookie = (name, value, time, domain) => {
    if (!domain) {
      domain = getDomain()
    }
    // expire: s
    let exp = new Date()
    if (time) {
      exp.setTime(exp.getTime() + time * 1000)
    } else {
      exp.setTime(new Date(9999, 11, 29).getTime())
    }
    let cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
    cookie += ';path=/;domain=' + domain
    document.cookie = cookie
  }
  
  export const getCookie = (name) => {
    let arr,
      reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if ((arr = document.cookie.match(reg))) {
      return unescape(arr[2])
    }
    return null
  }
  
  export const delCookie = (name, domain) => {    
    if (!domain) {
      domain = getDomain()
    }
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)
    let cval = getCookie(name)
    if (cval !== null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() +';domain='+domain+';path=/';
    }
  }
  