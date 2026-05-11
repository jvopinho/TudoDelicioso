export function parseCookies(cookieHeader: string | undefined): Map<string, string> {
  const cookies = new Map<string, string>()

  if(cookieHeader) {
    const cookiePairs = cookieHeader.split(';')

    for(const pair of cookiePairs) {
      const [key, value] = pair.split('=').map(part => part.trim())

      cookies.set(key, value)
    }
  }

  return cookies
}