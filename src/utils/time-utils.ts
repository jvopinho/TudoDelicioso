export function timeAgo(timestamp: number) {
  const now = Date.now()
  const diff = now - timestamp

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if(seconds < 60) {
    return 'agora mesmo'
  }

  if(minutes < 60) {
    return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`
  }

  if(hours < 24) {
    return `há ${hours} hora${hours > 1 ? 's' : ''}`
  }

  if(days < 30) {
    return `há ${days} dia${days > 1 ? 's' : ''}`
  }

  if(months < 12) {
    return `há ${months} mês${months > 1 ? 'es' : ''}`
  }

  return `há ${years} ano${years > 1 ? 's' : ''}`
}