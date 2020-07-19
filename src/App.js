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
      {window.innerWidth >= 534 ?
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
            {connected || connecting ? "Leave" : "Join"}
          </p>
        </div>
      :
        null
      }
      
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
  constructor(props) {
    super();
    this.state = {
      appearance: localStorage.getItem('appearance') || 'light',  // stores appearance in browser's local storage
      connected: false,
      connecting: true,
      count: 0,  // number of people connected to server
    }

    this.playing = []
  }

  componentDidMount() {
    SocketIO(this._onConnect, this._onDisconnect, this._onMoan, this._onUpdateCount);
    SocketIOFunctions.connect();
  }

  _onConnect = () => {
    this.setState({ connected: true, connecting: false });
    console.log("Connected to moaning room.")
  };

  _onDisconnect = () => {
    this.setState({ connected: false });
    console.log("Disconnected from moaning room.");
  };

  _onConnectDisconnect = () => {  // when leave/join button is pressed
    if (this.state.connected || this.state.connecting) {
      SocketIOFunctions.disconnect();
    } else {
      this.setState({ connecting: true });
      SocketIOFunctions.connect();
    }
  }

  _onMoan = (value) => {
    // this.setState({ playing: this.state.playing.concat([0]) });
    this.playing.push({
      id: (Math.round(value * 100000000)).toString(),
      status: "PLAYING",
      position: 0,
    });
    console.log("uuuuuuuuuuuaUAAAAAAAAAAAAAAAHHHHh");
    console.log(value);

    if (value > 0.999) {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    }
    this.forceUpdate();  // forces render of moans
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
          {window.innerWidth < 534 ? 
            <div className="Mobile-status">
              <p>
                {
                  this.state.connected ?
                    this.state.count === 2 ?
                      "You are in the moaning room with 1 other person."
                    :
                      "You are in the moaning room with " + (this.state.count - 1) + " other people."
                  :
                    this.state.connecting ?
                      "Joining the moaning room... "
                    :
                      "You are not in the moaning room."
                }
              </p>
              <p className="Small-button">{this.state.connected ? "Leave" : "Join"}</p>
            </div>
          :
            null
          }
        </header>
        <Bottom 
          appearance={this.state.appearance} 
          connected={this.state.connected}
          connecting={this.state.connecting}
          count={this.state.count}
          onAppearanceChange={this._onAppearanceChange}
          onConnectDisconnect={this._onConnectDisconnect} 
        />
        {this.playing.map((item) => <Sound 
          url={moanfile}
          playStatus={item.status}
          position={item.position}
          onPlaying={(object) => {
            const index = this.playing.findIndex((element) => element.id === item.id);
            this.playing[index] = {...this.playing[index], position: object.position};

            // this.forceUpdate();
          }}
          onFinishedPlaying={() => {
            const index = this.playing.findIndex((element) => element.id === item.id);
            this.playing.splice(index, 1);
            console.log("Modified playing state");
            console.log(this.playing);

            if (this.playing.length === 0) {
              this.forceUpdate();
            }
          }} 
        /> )}
      </div>
    );
  }
}

export default App;
