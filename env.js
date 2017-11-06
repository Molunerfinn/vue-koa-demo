import * as dotenv from 'dotenv'
let path = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
dotenv.config({path, silent: true})
