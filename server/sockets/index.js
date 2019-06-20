
import IO from 'socket.io'
const redisAdapter  = require('socket.io-redis');
import DpPintuSocket from'./dpgame/pintu'
import DpYiySocket from'./dpgame/yiy'
import DpQiandaoSocket from'./dpgame/qiandao'
export function sockets( server ){
  let path = process.env.SOCKETIO_PATH || '/socket.io'
  const adapter =  redisAdapter({ host: '127.0.0.1', port: 6379 })
  const io = IO(server, { transports: [ 'websocket' ],  path,  adapter  })
  console.log( "socket server bind path", path )
  // 拼图socket
  DpPintuSocket.bind(io)
  DpYiySocket.bind(io)
  DpQiandaoSocket.bind(io)
  return io
}
