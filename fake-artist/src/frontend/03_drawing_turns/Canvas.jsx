import React, { PureComponent } from "react";
import * as Constants from "../../shared/Constants.js";
import PropTypes from "prop-types";
import * as communication from "../communication";
import * as GameConfig from "../../shared/GameConfig";

// brush settings for drawing on the canvas
const LINE_WIDTH = 5;
const LINE_JOIN = "round";
const CANVAS_ID = "draw-area";

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
    color: this.props.player.color,
    points: []
  };

  // interval that queries the canvas state from the server
  canvasFetchInterval = null;
  // interval that pushes updates on the currently drawn line to the server
  updateCurrentLineInterval = null;

  pollingActivePlayerInterval = null;


  constructor(props) {
    super(props);

    this.state = {
      canvasLines: []
    };

  }

  render() {
    // do not redraw on first render because this.canvas is set in the canvas ref
    if (this.canvas) {
      this.redrawCanvas();
    }

    return (
      <div>
        <canvas
          id={CANVAS_ID}
          width="600px" // must be set like this, css width/height scales instead of making the canvas larger/smaller
          height="450px"
          onMouseDown={event => { this.startDrawing(); this.draw(event); }}
          onMouseUp={this.stopDrawing}
          onMouseLeave={this.stopDrawing}
          onMouseMove={this.draw}
          ref={canvas => this.canvas = canvas} />
      </div>);
  }

  componentDidMount() {
    this.startFetchCycle();
    this.startPollingActivePlayer();
  }

  componentWillUnmount() {
    this.stopFetchCycle();
    this.stopUpdateCycle();
    this.stopPollingActivePlayer();
  }

  redrawCanvas = () => {
    console.log("redrawing canvas");

    const context = this.canvas.getContext("2d");
    // clear the canvas completely
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // set brush settings
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
    communication.finishDrawingTurn(
      line,
      this.props.player.id,
      json => {
        console.log(json);
        this.currentLine.points = [];
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
      this.props.player.id,
      json => {
        console.log(json);
      },
      error => {
        console.log(error);
      });
  };

  startDrawing = () => {
    if (!this.props.isMyTurn()) {
      console.log("It's not your turn");
      return;
    }

    // disable fetching while drawing
    this.stopFetchCycle();

    this.isDrawing = true;
    // reset currentLine reference
    this.currentLine = {
      color: this.props.player.color,
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

    // resets active player, otherwise the player is able to draw "phantom lines", that only he can see
    this.props.finishTurn();

    // send drawn line to server
    this.putCanvasLine(this.currentLine);
    console.log("line sent - finishing turn");

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
    context.strokeStyle = this.props.player.color;
    context.lineJoin = LINE_JOIN;
    context.lineWidth = LINE_WIDTH;

    // draw line
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.closePath();
    context.stroke();
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

  // start fetching what other people are drawing
  startFetchCycle = () => {
    if (!this.canvasFetchInterval) {
      this.canvasFetchInterval = setInterval(this.fetchCanvasState, GameConfig.CANVAS_UPDATE_INTERVAL_MS);
    }
  };

  // stop fetching what other people are drawing
  stopFetchCycle = () => {
    clearInterval(this.canvasFetchInterval);
    this.canvasFetchInterval = null;
  };

  // start posting your drawing to the server
  startUpdateCycle = () => {
    if (!this.updateCurrentLineInterval) {
      this.updateCurrentLineInterval = setInterval(this.updateCurrentLine, GameConfig.CANVAS_UPDATE_INTERVAL_MS);
    }
  }

  // stop posting your drawing to the server
  stopUpdateCycle = () => {
    clearInterval(this.updateCurrentLineInterval);
    this.updateCurrentLineInterval = null;
  }

  pollActivePlayer = () => {
    communication.pollActivePlayer(
      json => {
        if (json[Constants.RESPONSE_STATUS] === "fail") {
          //only ever fails if voting phase has started
          this.stopPollingActivePlayer();
          this.props.setActivePlayer(null);
          this.stopFetchCycle();
          this.savePicture()
            .then(() => {
              this.props.advancePhase();
            });
          return;
        }

        const activePlayer = json[Constants.GET_ACTIVE_PLAYER_ACTIVE_PLAYER];
        this.props.setActivePlayer(activePlayer);
      },
      error => {
        console.log(error);
      }
    )
  };

  savePicture = async () => {
    return new Promise(resolve => {
      communication.fetchCanvasStateForSaving(
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
      )
        .then(() => {
          // just to be safe, redraw canvas
          this.redrawCanvas();

          // convert canvas to img
          const base64Data = this.canvas.toDataURL("image/png");
          this.props.setPicture(base64Data);
          resolve();
        });
    })
  }

  startPollingActivePlayer = () => {
    if (this.pollingActivePlayerInterval === null) {
      this.pollingActivePlayerInterval = setInterval(this.pollActivePlayer, GameConfig.POLLING_INTERVAL_MS);
    }
  };

  stopPollingActivePlayer = () => {
    clearInterval(this.pollingActivePlayerInterval);
    this.pollingActivePlayerInterval = null;
  };

}

Canvas.propTypes = {
  player: PropTypes.object.isRequired,
  isMyTurn: PropTypes.func.isRequired,
  finishTurn: PropTypes.func.isRequired,
  setActivePlayer: PropTypes.func.isRequired,
  setPicture: PropTypes.func.isRequired
}

export default Canvas;