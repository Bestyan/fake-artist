import React, { Component } from "react";

/**
 * Canvas cannot have a border. Drawing logic depends on that.
 * TODO: write a test to ensure that it doesnt have a border
 */
class Canvas extends Component {
  // whether the user is currently drawing (holding the mouse down)
  isDrawing = false;
  // holds the coordinates of the line that is currently being drawn
  // [{x: 0, y: 0}, {...}]
  currentLine = [];

  constructor() {
    super();

    /**
     * TODO: remove mouse from state once drawing logic stands.
     */
    this.state = {
      mouse: {
        x: 0,
        y: 0
      },
      drawnLines: []
    };

    this.startDrawing = this.startDrawing.bind(this);
    this.stopDrawing = this.stopDrawing.bind(this);
    this.getLineCoordinates = this.getLineCoordinates.bind(this);
    this.draw = this.draw.bind(this);
  }

  startDrawing = () => {
    this.isDrawing = true;
    this.currentLine = [];
  }

  stopDrawing = () => {
    // further mouse movement doesnt draw on canvas
    this.isDrawing = false;
    const { drawnLines } = this.state;

    // add completed line to drawnLines state
    drawnLines.push(this.currentLine);

    this.setState({
      drawnLines: drawnLines
    });
  }

  draw = event => {
    if (!this.isDrawing) {
      return;
    }

    // small timesavers for typing ^-^
    const canvas = this.canvas;

    // get coordinates
    const { startPoint, endPoint } = this.getLineCoordinates(event);

    // prepare drawing
    const context = canvas.getContext("2d");
    // set pen properties
    context.strokeStyle = "#FF0000";
    context.lineJoin = "round";
    context.lineWidth = 5;

    // draw line
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.closePath();
    context.stroke();

    // TODO: remove when coordinate display is removed
    this.setState({
      mouse: endPoint
    });
  };

  render() {
    const { x, y } = this.state.mouse;
    return (<div>
      <canvas
        id="draw-area"
        width="600px" // must be set like this, css width/height scales instead of making the canvas larger/smaller
        height="450px"
        onMouseDown={event => { this.startDrawing(); this.draw(event); }}
        onMouseUp={event => this.stopDrawing()}
        onMouseLeave={event => this.stopDrawing()}
        onMouseMove={this.draw}
        ref={canvas => this.canvas = canvas} />
      <div>
        x: {x}<br />
        y: {y}
      </div>
    </div>);
  }

  getLineCoordinates = (event) => {
    // position of the canvas
    const { x, y } = this.canvas.getBoundingClientRect();
    // position of the mouse in browser window
    const { clientX, clientY } = event;

    const relativeMousePos = {
      x: clientX - x,
      y: clientY - y
    };

    const currentLine = this.currentLine;
    currentLine.push(relativeMousePos);

    const numberOfPoints = currentLine.length;
    const startPointIndex = numberOfPoints - 2 >= 0 ? numberOfPoints - 2 : 0;
    const endPointIndex = numberOfPoints - 1;

    const startPoint = {
      x: currentLine[startPointIndex].x,
      y: currentLine[startPointIndex].y
    };
    const endPoint = {
      x: currentLine[endPointIndex].x,
      y: currentLine[endPointIndex].y
    };

    return { startPoint, endPoint };
  };

}

export default Canvas;