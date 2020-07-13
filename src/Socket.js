import io from 'socket.io-client';
const socket = io("https://moaning-button.herokuapp.com");
// socket.connect();

const SocketIO = (onConnect, onDisconnect, onMoan, onUpdateCount) => {
  console.log("Doing stuff");

  socket.on('connect', () => {
    onConnect();
    console.log("Connected to server.");
  })

  socket.on('disconnect', () => {
    onDisconnect();
    console.log("Disconnected from server.");
  })

  socket.on('updateCount', (numPeople) => {
    onUpdateCount(numPeople);
  })

  socket.on('moanOut', (value) => {
    onMoan(value);
    console.log("Moan value:", value)
  })
}

const SocketIOFunctions = {
  connect: () => {
    socket.connect();
  },
  disconnect: () => {
    socket.disconnect();
  },
  moan: (value) => {
    socket.emit("moanIn", value);
  }
}

export { SocketIO, SocketIOFunctions  };