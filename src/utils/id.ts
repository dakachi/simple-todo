// Simple nanoid-like ID generator
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export function generateId(size = 12): string {
  let id = ''
  const bytes = new Uint8Array(size)
  crypto.getRandomValues(bytes)
  
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] % alphabet.length]
  }
  
  return id
}
