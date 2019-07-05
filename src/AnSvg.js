import React from 'react';

class AnCanvas extends React.Component {
  constructor() {
    super();
    this.state = {
      points: [],
      closed: false,
      mousePoint: null,
      movingPoint: null,
    };
  }

  componentDidMount() {
    this.props.logger.log("Reset: " + this.props.image);
    document.addEventListener('keydown', this.onSVGKeyDown.bind(this));
  }

  reset() {
    this.setState({
      points: [],
      closed: false,
      mousePoint: null,
      movingPoint: null,
    });
  }

  undo() {
    if (this.state.closed) {
      this.setState({
        closed: false,
      });
      this.props.logger.log("Undo(Open polygon)");
    } else {
      const newPoints = this.state.points.slice();
      newPoints.pop();
      this.setState({
        points: newPoints,
      });
      if (newPoints.length === 0) {
        this.props.logger.log("Undo(All clear)");
      } else {
        this.props.logger.log("Undo");
      }
    }
  }

  onPointClick(e) {
    console.log(e);
    if (this.state.points.length === 0) return;
    if (parseInt(e.target.getAttribute('cx')) === this.state.points[0].x &&  parseInt(e.target.getAttribute('cy')) === this.state.points[0].y) {
      this.setState({
        closed: true,
      });
    }
  }

  onSVGKeyDown = (e) => {
    console.log(e.keyCode)
    if (e.keyCode == 87) {
      const mousePt = this.state.mousePoint;
      const e = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: mousePt.x,
        clientY: mousePt.y,
      });
      if (this.state.points.length > 2 && !this.state.close && this.isNearFirstPoint()) {
        this.close(e);
      } else {
        this.onSVGMouseDown(e);
      }
    } else if (e.keyCode == 65) {
      this.undo();
    }
  }

  onSVGMouseDown = (e) => {
    console.log(this.state)
    if (this.state.closed || this.isNearFirstPoint()) return;
    var pt = this.refs.svg.createSVGPoint(), svgP, circle;
    pt.x = e.clientX;
    pt.y = e.clientY;
    svgP = pt.matrixTransform(this.refs.svg.getScreenCTM().inverse());
    this.addPoint(svgP.x, svgP.y);
  };

  onPointMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    //if (parseInt(e.target.getAttribute('cx')) === this.state.points[0].x &&  parseInt(e.target.getAttribute('cy')) === this.state.points[0].y) return;
    this.target = {
      x: parseInt(e.target.getAttribute('cx')),
      y: parseInt(e.target.getAttribute('cy')),
    }
    this.targetInitial = {
      x: parseInt(e.target.getAttribute('cx')),
      y: parseInt(e.target.getAttribute('cy')),
    }
    this.coords = {
      x: e.pageX,
      y: e.pageY
    }
    document.removeEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousemove', this.onPointMouseMove);
  };

  onPointMouseUp = () => {
    document.removeEventListener('mousemove', this.onPointMouseMove);
    document.addEventListener('mousemove', this.onMouseMove);
    this.coords = {};
    this.props.logger.log("Reshape: " + JSON.stringify(this.state.points));
  };

  onPointMouseMove = (e) => {
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;
    const oldX = this.target.x;
    const oldY = this.target.y;

    this.coords.x = e.pageX;
    this.coords.y = e.pageY;
    this.target.x -= xDiff;
    this.target.y -= yDiff;

    this.movePoint(oldX, oldY, this.target.x, this.target.y);
  };

  onMouseMove = (e) => {
    var pt = this.refs.svg.createSVGPoint(), svgP, circle;
    pt.x = e.clientX;
    pt.y = e.clientY;
    svgP = pt.matrixTransform(this.refs.svg.getScreenCTM().inverse());
    this.setState({
      mousePoint: {x: svgP.x, y: svgP.y}
    });
  };

  addPoint(x, y) {
    if (this.state.points.length === 0) {
      this.props.logger.log("Put start point: (" + x + ", " + y + ")");
    } else {
      this.props.logger.log("Put point: (" + x + ", " + y + ")");
    }
    const newPoints = this.state.points.slice();
    newPoints.push({x: x, y: y});
    this.setState({
      points: newPoints,
    });
  }

  removePoint(x, y) {
    const newPoints = this.state.points.slice().filter((item) => {
      return item.x !== x || item.y !== y;
    });
    this.setState({
      points: newPoints,
    });
  }

  movePoint(oldX, oldY, newX, newY) {
    const newPoints = this.state.points.map((item) => {
      if (item.x === oldX && item.y === oldY) {
        item.x = newX;
        item.y = newY;
      }
      return item;
    });
    this.setState({
      points: newPoints,
    });
  }

  isNearFirstPoint() {
    const mousePt = this.state.mousePoint;
    if (mousePt == null) return false;
    const firstPt = this.state.points[0];
    if (firstPt == null) return false;
    if ((mousePt.x - firstPt.x)**2 + (mousePt.y - firstPt.y)**2 < 100) {
      return true;
    } else {
      return false;
    }
  }

  close(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      closed: true
    });
    this.props.logger.log("Created polygon: " + JSON.stringify(this.state.points));
  }

  render() {
    const pl = (() => {
      if (this.state.points.length > 0 && !this.state.closed) {
        return (
          <polyline
            points={this.state.points.map((item) => item.x + "," + item.y).join(' ')}
            stroke="red"
            strokeWidth="3"
            fill="none"
          />
        );
      } else if (this.state.points.length > 0) {
        return (
          <polygon
            points={this.state.points.map((item) => item.x + "," + item.y).join(' ')}
            stroke="red"
            strokeWidth="3"
            fill="rgba(100, 100, 100, 0.8)"
          />
        );
      } else {
        return null;
      }
    })();
    const predict = (() => {
      if (this.state.points.length > 0 && !this.state.closed && this.state.mousePoint != null) {
        const lastPt = this.state.points[this.state.points.length - 1];
        const mousePt = this.state.mousePoint;
        return (
          <polyline
            points={lastPt.x + "," + lastPt.y + " " + mousePt.x + "," + mousePt.y}
            stroke="rgba(255, 0, 0, 0.7)"
            strokeWidth="3"
            fill="none"
          />
        );
      } else {
        return null;
      }
    })();
    const endCircle = (() => {
      const firstPt = this.state.points[0];
      const mousePt = this.state.mousePoint;
      if (mousePt === null || this.state.closed) return;
      if (this.state.points.length > 2 && !this.state.closed && this.state.mousePoint != null && this.isNearFirstPoint()) {
        return <circle
          cx={firstPt.x}
          cy={firstPt.y}
          r="12"
          stroke="black"
          fill="red"
          onClick={this.close.bind(this)}
        />
      } else {
        return <circle
          cx={mousePt.x}
          cy={mousePt.y}
          r="10"
          stroke="black"
          fill="rgba(255, 255, 255, 0.3)"
        />
      }
    })();
    return (
      <div className="AnCanvas" style={this.props.style}>
        <div style={{
            height:"100%",
            width: "100%",
            backgroundImage: `url(${process.env.PUBLIC_URL}${this.props.image})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundColor: "white",
            backgroundSize: "contain",
        }}
        >
        <svg
          ref="svg"
          style={{height:"100%", width: "100%", top: "0px", left: "0px", overflow: "hidden"}}
          onMouseDown={this.onSVGMouseDown.bind(this)}
          onKeyDown={this.onSVGKeyDown.bind(this)}
          onMouseMove={this.onMouseMove.bind(this)}>
          { pl }
          { predict }
          { this.state.points.map((i) => {
            return <circle
              cx={i.x}
              cy={i.y}
              style={{cursor: "grab"}}
              r="10"
              stroke="black"
              fill="white"
              //onClick={this.onPointClick.bind(this)}
              onMouseDown={this.onPointMouseDown.bind(this)}
              onMouseUp={this.onPointMouseUp.bind(this)}
            />
          })}
          { endCircle }
        </svg>
      </div>
      </div>
    );
  }
}

export default AnCanvas;
