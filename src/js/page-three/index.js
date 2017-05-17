let Rx = require("rxjs/Rx");

let container = document.querySelector("#sprite-container");
let button    = document.querySelector("button#drag");

let spriteMouseDowns          = Rx.Observable.fromEvent(button, "mousedown");
let spriteContainerMouseMoves = Rx.Observable.fromEvent(container, "mousemove");
let spriteContainerMouseUps   = Rx.Observable.fromEvent(container, "mouseup");

// For every mouse down event on the sprite, retrieve only those
// mouse move events that occur before the next mouse up event.
var spriteMouseDrags = spriteMouseDowns.
  concatMap((contactPoint) => {
    // Retrieve all mouse move events on container...
    return spriteContainerMouseMoves.
      /// ...until a mouse up event occurs.
      takeUntil(spriteContainerMouseUps);
  });

spriteMouseDrags.
  forEach((dragPoint) => {
    button.style.left = dragPoint.pageX + "px";
    button.style.top  = dragPoint.pageY + "px";
  });
