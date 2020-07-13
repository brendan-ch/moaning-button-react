import React from 'react';
import Sound from 'react-sound';
import './App.css';

import moanfile from './moaning-sound.mp3';

import { SocketIO, SocketIOFunctions } from './Socket';

function Bottom({ appearance, connected, connecting, count, onConnectDisconnect, onAppearanceChange }) {
  return (
    <header
        className="App-bottom"
        style={{ backgroundColor: appearance === "dark" ? "black" : "white" }}
      >
        <div className="Status">
          <p
            style={{ color: appearance === "dark" ? "white" : "black" , marginRight: 8}}
          >
            {
              connected ?
                count === 2 ?
                  "You are in the moaning room with 1 other person."
                :
                  "You are in the moaning room with " + (count - 1) + " other people."
              :
                connecting ?
                  "Joining the moaning room... "
                :
                  "You are not in the moaning room."
            }
          </p>
          <p 
            className="Small-button"
            onClick={onConnectDisconnect}
          >
            {connected ? "Leave" : "Join"}
          </p>
        </div>
        <p 
          className="Small-button"
          onClick={onAppearanceChange}
        >
          {
            appearance === "dark" ?
              "Light mode"
            :
              "Dark mode"
          }
        </p>
      </header>
  )
}

class App extends React.Component {
  // const [appearance, setAppearance] = useState(localStorage.getItem('appearance') || 'light');
  // const [connected, setConnected] = useState(false);
  // const [connecting, setConnecting] = useState(true);
  // const [count, setCount] = useState(0);
  // const [playing, setPlaying] = useState([]);

  constructor(props) {
    super();
    this.state = {
      appearance: localStorage.getItem('appearance') || 'light',
      connected: false,
      connecting: true,
      count: 0,
      playing: []
    }
  }

  componentDidMount() {
    SocketIO(this._onConnect, this._onDisconnect, this._onMoan, this._onUpdateCount);
    SocketIOFunctions.connect();
  }

  _onConnect = () => {
    this.setState({ connected: true, connecting: false });
    // setConnected(true);
    // setConnecting(false);
    console.log("Connected to moaning room.")
  };

  _onDisconnect = () => {
    // setConnected(false);
    this.setState({ connected: false });
    console.log("Disconnected from moaning room.");
  };

  _onConnectDisconnect = () => {  // when leave/join button is pressed
    if (this.state.connected) {
      SocketIOFunctions.disconnect();
    } else {
      this.setState({ connecting: true });
      SocketIOFunctions.connect();
    }
  }

  _onMoan = (value) => {
    this.setState({ playing: this.state.playing.concat([0]) });
    console.log("uuuuuuuuuuuaUAAAAAAAAAAAAAAAHHHHh");
    console.log(value);

    if (value > 0.999) {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    }
  };

  _onUpdateCount = (value) => {
    this.setState({ count: value });
    console.log(`Updated count to ${value}`);
  };

  _onAppearanceChange = () => {
    this.setState({ appearance: this.state.appearance === "light" ? "dark" : "light" });
    localStorage.setItem("appearance", this.state.appearance === "light" ? "dark" : "light");
    console.log("Changed appearance.");
  }

  // useEffect(() => {
  //   SocketIO(_onConnect, _onDisconnect, _onMoan, _onUpdateCount);
  //   SocketIOFunctions.connect();
  // }, [])
  render() {
    return (
      <div className="App">
        <header 
          className="App-header"
          style={{ backgroundColor: this.state.appearance === "dark" ? "black" : "white" }}
        >
          <div 
            className="Button"
            onClick={() => {
              // this.state.(playing.concat([0]));
              // console.log("");
              const number = Math.random();
              if (this.state.connected) {
                SocketIOFunctions.moan(number);
              } else {
                this._onMoan(number);
              }
            }}
          >
            <p className="Button-text">do the moan</p>
          </div>
        </header>
        <Bottom 
          appearance={this.state.appearance} 
          connected={this.state.connected}
          connecting={this.state.connecting}
          count={this.state.count}
          onAppearanceChange={this._onAppearanceChange}
          onConnectDisconnect={this._onConnectDisconnect} 
        />
        {this.state.playing.map(() => <Sound 
          url={moanfile}
          playStatus="PLAYING"
          onFinishedPlaying={() => {
            this.state.playing.pop();  // NEVER DO THIS
            console.log("Finished playing");
            console.log(this.state.playing);
          }} 
        /> )}
      </div>
    );
  }
}

export default App;
