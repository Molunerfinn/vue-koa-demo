import crypto from 'crypto'

export function generateCode(){
 var buf = crypto.randomBytes(16)
 return buf.toString('hex')
}
