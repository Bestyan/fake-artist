import React, { Component } from "react";

/**
 * Canvas cannot have a border. Drawing logic depends on that.
 * TODO: write a test to ensure that it doesnt have a border
 */
class Canvas extends Component {
  isDrawing = false;

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
      drawHistory: []
    };

    this.setDraw = this.setDraw.bind(this);
    this.draw = this.draw.bind(this);
  }

  setDraw = isDrawing => {
    this.isDrawing = isDrawing;
  };

  draw = event => {
    if (!this.isDrawing) {
      return;
    }

    //small timesaver for typing ^-^
    const canvas = this.canvas;

    // position of the canvas
    const { x, y } = canvas.getBoundingClientRect();
    // position of the mouse in browser window
    const { clientX, clientY } = event;

    const relativeMousePos = {
      x: clientX - x,
      y: clientY - y
    };

    const drawHistory = this.state.drawHistory;
    drawHistory.push(relativeMousePos);

    const historyEntries = drawHistory.length;
    const startEntry = historyEntries - 2 >= 0 ? historyEntries - 2 : 0;
    const endEntry = historyEntries - 1;
    const lineStart = {
      x: drawHistory[startEntry].x,
      y: drawHistory[startEntry].y
    };
    const lineEnd = {
      x: drawHistory[endEntry].x,
      y: drawHistory[endEntry].y
    };

    // drawing
    const context = canvas.getContext("2d");
    // set pen properties
    context.strokeStyle = "#FF0000";
    context.lineJoin = "round";
    context.lineWidth = 5;
    
    // draw line
    context.beginPath();
    context.moveTo(lineStart.x, lineStart.y);
    context.lineTo(lineEnd.x, lineEnd.y);
    context.closePath();
    context.stroke();

    this.setState({
      mouse: relativeMousePos,
      drawHistory: drawHistory
    });
  };

  render() {
    const { x, y } = this.state.mouse;
    return (<div>
      <canvas
        id="draw-area"
        onMouseDown={event => { this.setDraw(true); this.draw(event); }}
        onMouseUp={event => this.setDraw(false)}
        onMouseLeave={event => this.setDraw(false)}
        onMouseMove={this.draw}
        ref={canvas => this.canvas = canvas} />
      <div>
        x: {x}<br />
        y: {y}
      </div>
    </div>);
  }
}

export default Canvas;