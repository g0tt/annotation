import React from 'react';

class AnCanvas extends React.Component {
  constructor() {
    super();
    this.state = {
      drawing: false,
    };
  }

  getContext() {
    return this.refs.canvas.getContext('2d');
  }

  startDrawing(x, y) {
    this.setState({ drawing: true });
    const ctx = this.getContext();
    ctx.moveTo(x, y);
  }

  draw(x, y) {
    if (!this.state.drawing) {
      return;
    }
    const ctx = this.getContext();
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  endDrawing() {
    this.setState({ drawing: false });
  }

  render() {
    return (
      <div className="AnCanvas">
        <canvas
          id="canvas"
          ref="canvas"
          width="500px"
          height="500px"
          onMouseDown={e => this.startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
          onMouseUp={() => this.endDrawing()}
          onMouseLeave={() => this.endDrawing()}
          onMouseMove={e => this.draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
        />
      </div>
    );
  }
}

export default AnCanvas;
