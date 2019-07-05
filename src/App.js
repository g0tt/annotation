import React from 'react';
import './App.css';
import AnSvg from './AnSvg.js';

class App extends React.Component {
  constructor() {
    super();
    this.images = [
      "/images/image0.jpg",
      "/images/image1.jpg",
      "/images/image2.jpg",
      "/images/image3.jpg",
      "/images/image4.jpg",
      "/images/image5.jpg",
      "/images/image6.jpg",
      "/images/image7.jpg",
      "/images/image8.jpg",
    ];
    this.state = {
      task: 0,
      logText: "",
      logger: {
        log: ((text) => {
          console.log(text)
          const timestamp = "[" + (new Date()).getTime() + "]";
          const logText = this.state.logText + timestamp + text + "\n";
          this.setState({
            logText: logText
          }, this.scrollLogToBottom.bind(this));
        }).bind(this)
      }
    };
  }

  scrollLogToBottom() {
    this.refs.log.scrollTop = this.refs.log.scrollHeight;
  }


  nextImage() {
    if (this.state.task + 1 < this.images.length) {
      console.log("hoge")
      this.state.logger.log("Next: " + this.images[this.state.task + 1]);
      this.setState({
        task: this.state.task + 1
      });
      this.refs.ansvg.reset();
    }
  }

  prevImage() {
    if (this.state.task > 0) {
      this.state.logger.log("Prev: " + this.images[this.state.task - 1]);
      this.setState({
        task: this.state.task - 1
      });
      this.refs.ansvg.reset();
    }
  }

  reset() {
    this.refs.ansvg.reset();
    this.state.logger.log("Reset");
  }

  undo() {
    this.refs.ansvg.undo();
    this.state.logger.log("Undo");
  }

  render() {
    return (
      <div className="App" style={{
        backgroundColor: "#aaaaff",
        padding: "5px",
        overflow: "hidden",
      }}>
        <AnSvg
          ref="ansvg"
          logger={this.state.logger}
          image={this.images[this.state.task]}
          style={{
            height: "700px",
            width: "700px",
            float: "left",
          }}
        />
        <div style={{
          float: "right",
          display: "block",
          width: "auto",
          height: "100%",
          marginRight: "20px"
        }}>
          Task: {this.images[this.state.task]}
          <div style={{marginBottom: "10px"}}>
            <button onClick={this.prevImage.bind(this)}>Prev</button>
            <button onClick={this.nextImage.bind(this)}>Next</button>
            <button onClick={this.reset.bind(this)}>Reset</button>
          </div>
          <textarea value={this.state.logText} ref="log" style={{
            width: "200px",
            height:"300px",
            resize: "none",
          }} readOnly /><br/><br/><br/>
          <span style={{fontSize: "2em"}}>
            [Hotkey]<br />
            W: Add a point<br />
            A: Undo<br /><br />
          </span>
          <button style={{
            fontSize: "3em",
          }} onClick={this.undo.bind(this)}>Undo</button>
        </div>
      </div>
    );
  }
}

export default App;
