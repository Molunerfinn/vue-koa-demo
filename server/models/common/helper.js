import crypto from 'crypto'

export function generateCode(){
 var buf = crypto.randomBytes(16)
 return buf.toString('hex')
}


// To prevent problems with case-insensitive filesystems, especially in combination
// with databases which treat indices as case-sensitive, all blob keys generated are going
// to only contain the base-36 character alphabet and will therefore be lowercase. To maintain
// the same or higher amount of entropy as in the base-58 encoding used by `has_secure_token`
// the number of bytes used is increased to 28 from the standard 24
export function generateUniqueSecureToken(){
  //SecureRandom.base36(28)
  let buf = crypto.randomBytes(24)
  // buffer do not support base36
  return buf.toString('base64')
}
