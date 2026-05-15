function setCookie(name, value, durationDays) {
  const d = new Date()

  d.setTime(d.getTime() + (durationDays * 24 * 60 * 60 * 1000))
  let expires = 'expires='+ d.toUTCString()

  document.cookie = name + '=' + value + ';' + expires + ';path=/'
}


function getCookie(name) {
  let cname = name + '='
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(';')

  for(let i = 0; i <ca.length; i++) {
    let c = ca[i]

    while(c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if(c.indexOf(cname) == 0) {
      return c.substring(cname.length, c.length)
    }
  }
  return ''
}

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}