
import IO from 'socket.io'
//const redisAdapter  = require('socket.io-redis');
import DpPintuSocket from'./dpgame/pintu'

export function sockets( server ){
  // {adapter: redisAdapter({ host: '127.0.0.1', port: 6379 })}
  const io = IO(server)
  // 拼图socket
  DpPintuSocket.bind(io)
  return io
}
