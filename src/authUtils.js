export function getStoredUser() {
  try {
    const raw = localStorage.getItem('shinra_user')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}
