import React, { PureComponent } from "react";
import * as Constants from "../Constants.js";
import PropTypes from "prop-types";
import * as communication from "./communication";

const LINE_WIDTH = 5;
const LINE_JOIN = "round";
const SYNC_INTERVAL_MS = 500;

/**
 * Canvas cannot have a border. Drawing logic depends on that.
 * TODO: write a test to ensure that it doesnt have a border
 */
class Canvas extends PureComponent {
  // whether the user is currently drawing (holding the mouse down)
  isDrawing = false;
  /* holds the coordinates of the line that is currently being drawn
   * {
   *  color: "#FF0000",
   *  points: [{x: 0, y: 0}, {...}]
   * }
   */
  currentLine = {
    color: this.props.color,
    points: []
  };
  // interval that queries the canvas state from the server
  canvasFetchInterval = null;
  // interval that pushes updates on the currently drawn line to the server
  updateCurrentLineInterval = null;


  constructor(props) {
    super(props);

    /**
     * TODO: remove mouse from state once drawing logic stands.
     */
    this.state = {
      mouse: {
        x: 0,
        y: 0
      },
      canvasLines: []
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
    const { canvasLines } = this.state;
    canvasLines.forEach(line => {

      context.strokeStyle = line.color;
      context.beginPath();
      line.points.forEach((point, index) => {

        // the first point sets the starting point of the line
        if (index === 0) {
          context.moveTo(point.x, point.y);
        } else {
          context.lineTo(point.x, point.y);
        }

        // "lines" that consist of one point need a line to themselves and a closed path to appear
        // otherwise they are not drawn on the canvas
        if (line.points.length === 1) {
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
    communication.fetchCanvasState(
      json => {
        const lines = json[Constants.GET_STATE_LINES];
        // in case it's a delayed fetch and drawing has started in the meantime
        if (this.currentLine.points.length > 0) {
          lines.push(this.currentLine);
        }

        this.setState({
          canvasLines: lines
        });
      },
      error => {
        console.log(error);
        // TODO display connection status somewhere
      }
    );
  }

  /**
   * push new canvas line to server
   */
  putCanvasLine = (line) => {
    communication.putCanvasLine(
      line,
      json => {
        console.log(json);
      },
      error => {
        console.log(error);
        // TODO: re-send
      }
    );
  };

  /**
   * push state of currently drawn line to server
   */
  updateCurrentLine = () => {
    communication.updateCurrentLine(
      this.currentLine,
      json => {
        console.log(json);
      },
      error => {
        console.log(error);
      });
  };

  startDrawing = () => {
    // disable fetching while drawing
    this.stopFetchCycle();

    this.isDrawing = true;
    // reset currentLine reference
    this.currentLine = {
      color: this.props.color,
      points: []
    };

    const { canvasLines } = this.state;
    canvasLines.push(this.currentLine);
    // trigger render
    this.setState(this.state);

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

    this.startFetchCycle();
  };

  draw = (event) => {
    if (!this.isDrawing) {
      return;
    }

    // get coordinates
    const { startPoint, endPoint } = this.getLineCoordinates(event);
    this.currentLine.points.push(endPoint);
    // trigger a re-render
    this.setState(this.state);

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

    const relativeMousePosition = {
      x: mouseX - canvasX,
      y: mouseY - canvasY
    };

    const numberOfPoints = this.currentLine.points.length;

    // mouse position is where the line currently ends
    const endPoint = relativeMousePosition;
    // if the line already has points, use the last one as startPoint
    // if it doesn't (e.g. when starting a new line), use the endPoint as startPoint
    const startPoint = numberOfPoints === 0 ? endPoint : this.currentLine.points[numberOfPoints - 1];

    return { startPoint, endPoint };
  };

  startFetchCycle = () => {
    if (!this.canvasFetchInterval) {
      this.canvasFetchInterval = setInterval(this.fetchCanvasState, SYNC_INTERVAL_MS);
    }
  };

  stopFetchCycle = () => {
    clearInterval(this.canvasFetchInterval);
    this.canvasFetchInterval = null;
  };

  startUpdateCycle = () => {
    if (!this.updateCurrentLineInterval) {
      this.updateCurrentLineInterval = setInterval(this.updateCurrentLine, SYNC_INTERVAL_MS);
    }
  }

  stopUpdateCycle = () => {
    clearInterval(this.updateCurrentLineInterval);
    this.updateCurrentLineInterval = null;
  }

}

Canvas.propTypes = {
  color: PropTypes.string.isRequired
}

export default Canvas;