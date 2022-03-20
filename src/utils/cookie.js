
export const setCookie = (name, value, time, domain) => {
    // expire: s
    let exp = new Date()
    if (time) {
      exp.setTime(exp.getTime() + time * 1000)
    } else {
      exp.setTime(new Date(9999, 11, 29).getTime())
    }
    let cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ";path=/"
    if (domain) {
      cookie += ';domain=' + domain
    }
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
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)
    let cval = getCookie(name)
    if (cval !== null) {
      let cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ";path=/"
      if (domain) {
        cookie += ';domain=' + domain;
      }
      document.cookie = cookie;
    }
  }
  