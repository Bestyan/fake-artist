import React, { Component } from "react";
import * as Constants from "../Constants.js";

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
  // holds the interval that queries the canvas state from the server
  canvasInterval = null;

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

  }

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

  onComponentMounted() {
    //this.canvasInterval = setInterval(this.fetchCanvasState, 50);
  }

  /**
   * request canvas state from server
   */
  fetchCanvasState = () => {
    fetch(`${Constants.SERVER_ADDRESS}/${Constants.FETCH_STATE}`, {
      method: "GET"
    })
    .then(response => response.json())
    .then(json => {
      this.setState({
        drawnLines: json.lines
      });
    });
  }

  /**
   * push new canvas line to server
   */
  putCanvasLine = (line) => {
    const payload = {
      line: line
    };

    //console.log("sending " + JSON.stringify(payload));

    fetch(`http://${Constants.SERVER_ADDRESS}/${Constants.PUT_LINE}`, {
      method: "PUT", 
      body: JSON.stringify(payload),
      headers: {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3001/*"
      }
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    });

  };

  startDrawing = () => {
    this.isDrawing = true;
    this.currentLine = [];
  };

  stopDrawing = () => {
    // if drawing was disabled before, do not go through the line saving process
    if(!this.isDrawing){
      return;
    }
    
    // further mouse movement doesnt draw on canvas
    this.isDrawing = false;
    const { drawnLines } = this.state;

    // send drawn line to server
    this.putCanvasLine(this.currentLine);
    console.log("line sent");

    // add completed line to drawnLines state
    drawnLines.push(this.currentLine);

    this.setState({
      drawnLines: drawnLines
    });
  };

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