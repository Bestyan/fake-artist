import React, { Component } from "react";
import * as Constants from "../Constants.js";

const LINE_WIDTH = 5;
const LINE_JOIN = "round";

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
      completedLines: []
    };

  }

  render() {
    // do not redraw on first render because this.canvas is set in the canvas ref
    if (this.canvas) {
      this.redrawCanvas();
    }

    // TODO: remove once x|y display is removed
    const { x, y } = this.state.mouse;

    return (
      <div>
        <canvas
          id="draw-area"
          width="600px" // must be set like this, css width/height scales instead of making the canvas larger/smaller
          height="450px"
          onMouseDown={event => { this.startDrawing(); this.draw(event); }}
          onMouseUp={this.stopDrawing}
          onMouseLeave={this.stopDrawing}
          onMouseMove={this.draw}
          ref={canvas => this.canvas = canvas} />
        <div>
          x: {x}<br />
          y: {y}
        </div>
      </div>);
  }

  componentDidMount() {
    this.startFetchCycle();
  }

  redrawCanvas = () => {
    console.log("redrawing canvas");

    const context = this.canvas.getContext("2d");
    // clear the canvas completely
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.lineJoin = LINE_JOIN;
    context.lineWidth = LINE_WIDTH;
    // draw the current state
    const { completedLines } = this.state;
    completedLines.forEach(line => {

      context.strokeStyle = "#FF0000"; // TODO: have the line color in the json
      context.beginPath();
      line.forEach((point, index) => {

        // the first point sets the starting point of the line
        if (index === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }

        // "lines" that consist of one point need a line to themselves and a closed path to appear
        // otherwise they are not drawn on the canvas
        if (line.length === 1) {
          context.lineTo(point.x, point.y);
          context.closePath();
        }

      });
      context.stroke();

    });
  };

  /**
   * request canvas state from server
   */
  fetchCanvasState = () => {
    console.log(`fetching from ${Constants.SERVER_ADDRESS}${Constants.GET_STATE}`);
    fetch(`${Constants.SERVER_ADDRESS}${Constants.GET_STATE}`, {
      method: "GET",
    })
      .then(response => response.json())
      .then(json => {

        this.setState({
          completedLines: json[Constants.GET_STATE_LINES]
        });
      })
      .catch(error => {
        // TODO display connection status somewhere
      });
  }

  /**
   * push new canvas line to server
   */
  putCanvasLine = (line) => {
    const requestBody = {
      [Constants.PUT_LINE_FINISHED_LINE]: line
    };

    //console.log("sending " + JSON.stringify(payload));

    fetch(`${Constants.SERVER_ADDRESS}${Constants.PUT_LINE}`, {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch(error => {
        // TODO: re-send
      });

  };

  /**
   * push state of currently drawn line to server
   */
  updateCurrentLine = () => {
    const requestBody = {
      [Constants.POST_LINE_INCOMPLETE_LINE]: this.currentLine
    };

    fetch(`${Constants.SERVER_ADDRESS}${Constants.POST_LINE}`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch(error => {
        // TODO
      });
  };

  startDrawing = () => {
    this.isDrawing = true;
    this.currentLine = [];

    const { completedLines } = this.state;
    completedLines.push(this.currentLine);

    this.setState({
      completedLines: completedLines
    });

    // disable fetching while drawing
    this.stopFetchCycle();
    // update the server on the currently drawn line
    this.startUpdateCycle();

  };

  stopDrawing = () => {
    // if drawing was disabled before, do not go through the line saving process
    if (!this.isDrawing) {
      return;
    }

    // further mouse movement doesnt draw on canvas
    this.isDrawing = false;

    // stop updating the server on currently drawn line
    this.stopUpdateCycle();

    // send drawn line to server
    this.putCanvasLine(this.currentLine);
    console.log("line sent");

    const { completedLines } = this.state;
    completedLines.push(this.currentLine);
    this.setState({
      completedLines: completedLines
    });

    this.startFetchCycle();
  };

  draw = (event) => {
    if (!this.isDrawing) {
      return;
    }

    // get coordinates
    const { startPoint, endPoint } = this.getLineCoordinates(event);
    this.currentLine.push(endPoint);

    // prepare drawing
    const context = this.canvas.getContext("2d");
    // set pen properties
    context.strokeStyle = "#FF0000";
    context.lineJoin = LINE_JOIN;
    context.lineWidth = LINE_WIDTH;

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

  /**
   * returns mouse coordinates relative to the canvas
   */
  getLineCoordinates = (event) => {
    // position of the canvas
    const { x: canvasX, y: canvasY } = this.canvas.getBoundingClientRect();
    // position of the mouse in browser window
    const { clientX: mouseX, clientY: mouseY } = event;

    const relativeMousePos = {
      x: mouseX - canvasX,
      y: mouseY - canvasY
    };

    const numberOfPoints = this.currentLine.length;

    // mouse position is where the line currently ends
    const endPoint = relativeMousePos;
    // if the line already has points, use the last one as startPoint
    // if it doesn't (e.g. when starting a new line), use the endPoint as startPoint
    const startPoint = numberOfPoints === 0 ? endPoint : this.currentLine[numberOfPoints - 1];

    return { startPoint, endPoint };
  };

  startFetchCycle = () => {
    if (!this.canvasFetchInterval) {
      this.canvasFetchInterval = setInterval(this.fetchCanvasState, 50);
    }
  };

  stopFetchCycle = () => {
    clearInterval(this.canvasFetchInterval);
    this.canvasFetchInterval = null;
  };

  startUpdateCycle = () => {
    if (!this.updateCurrentLineInterval) {
      this.updateCurrentLineInterval = setInterval(this.updateCurrentLine, 50);
    }
  }

  stopUpdateCycle = () => {
    clearInterval(this.updateCurrentLineInterval);
    this.updateCurrentLineInterval = null;
  }

}

export default Canvas;