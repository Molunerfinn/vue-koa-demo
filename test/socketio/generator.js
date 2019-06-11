// npm install -g iamisti/websocket-bench
// websocket-bench   -g .\test\socketio\generator.js -a 2 -c 2 http://localhost:8080/channel-dppintu-eee759bdda4590892e02be1bd9b13b86


function MessageGenerator(client){
  this.messageIndex = 0
  this.messages = ['ResetGameEvent','GameEndEvent']
  this.client = client
}

MessageGenerator.prototype.next = function(){
  let msg =  this.messages[this.messageIndex]
  this.client.emit(msg, { hello: 'world' });
  console.log( " current message is ", msg )

  this.messageIndex++
}

module.exports = {
      /**
       * Before connection (optional, just for faye)
       * @param {client} client connection
       */
      beforeConnect : function(client) {
        // Example:
        // client.setHeader('Authorization', 'OAuth abcd-1234');
        // client.disable('websocket');
      },

      /**
       * On client connection (required)
       * @param {client} client connection
       * @param {done} callback function(err) {}
       */
      onConnect : function(client, done) {
        // Faye client
        // client.subscribe('/channel', function(message) { });

        // Socket.io client
        // client.emit('test', { hello: 'world' });

        // Primus client
        // client.write('Sailing the seas of cheese');

        // WAMP session
        // client.subscribe('com.myapp.hello').then(function(args) { });

        done();
      },

      /**
       * Send a message (required)
       * @param {client} client connection
       * @param {done} callback function(err) {}
       */
      sendMessage : function(client, done) {
        // Example:
        // client.emit('test', { hello: 'world' });
        // client.publish('/test', { hello: 'world' });
        // client.call('com.myapp.add2', [2, 3]).then(function (res) { });
        return new MessageGenerator( client )
        //done();
      },

      /**
       * WAMP connection options
       */
      options : {
        path: '/sockets/dppintu',
        transports: ['websocket']
      }
   };
