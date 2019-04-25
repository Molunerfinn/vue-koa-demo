
const PintuSocketEvent={
  OpenGameEvent: "OpenGameEvent",
  GetGamePlayersEvent:"GetGamePlayersEvent",
 	StartGameEvent: "StartGameEvent",
  ResetGameEvent:"ResetGameEvent",
	GameStartingEvent:"GameStartingEvent",  // data: countTime
	GameRunningEvent:"GameRunningEvent",
	GameEndEvent:"GameEndEvent",
}

export default class DpPintuSocket{
	// bind on connection
	static async bind(io) {
    const dynamicNsp = io.of(/^\/channel-dppintu-\w+$/).on('connect', (socket) => {
      const newNamespace = socket.nsp; // newNamespace.name === '/dynamic-101'
      console.log( "newNamespace = ", newNamespace.name)
      // broadcast to all clients in the given sub-namespace
      newNamespace.emit('hello');
    });

	}
}
