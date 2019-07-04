import React from 'react';
import {PathLine} from 'react-svg-pathline';

class AnCanvas extends React.Component {
  constructor() {
    super();
    this.state = {
      drawing: false,
      points: [{x:0, y:0}],
    };
    this.addPoint = this.addPoint.bind(this);
  }

  onAdd(e) {
    this.addPoint(parseInt(this.refs.xval.value),parseInt(this.refs.yval.value));
  }

  addPoint(x, y) {
    const newPoints = this.state.points.slice();
    newPoints.push({x: x, y: y});
    this.setState({
      points: newPoints,
    });
    console.log(newPoints);
  }

  render() {
    return (
      <div className="AnCanvas">
        <svg>
          <PathLine
            points={this.state.points}
            stroke="red"
            strokeWidth="3"
            fill="none"
            r={10}
          />
        </svg>
        <input type="text" ref="xval" />
        <input type="text" ref="yval" />
        <button onClick={this.onAdd.bind(this)}></button>
      </div>
    );
  }
}

export default AnCanvas;
