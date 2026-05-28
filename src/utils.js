export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U'
  const parts = name.trim().split(' ').filter(p => p.length > 0)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
}
