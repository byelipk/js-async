let Rx = require("rxjs/Rx");

let container = document.querySelector("#sprite-container");
let sprite    = document.querySelector("#drag");

let spriteMouseDowns          = Rx.Observable.fromEvent(sprite, "mousedown");
let spriteContainerMouseMoves = Rx.Observable.fromEvent(container, "mousemove");
let spriteContainerMouseUps   = Rx.Observable.fromEvent(container, "mouseup");

// For every mouse down event on the sprite, retrieve only those
// mouse move events that occur before the next mouse up event.
var spriteMouseDrags = spriteMouseDowns.
  concatMap((contactPoint) => {
    // Retrieve all mouse move events on container...
    return spriteContainerMouseMoves.
      // ...until a mouse up event occurs.
      takeUntil(spriteContainerMouseUps).
        map(movePoint => {
          // Return a new object with translated point values
          return {
            pageX: movePoint.pageX - contactPoint.offsetX,
            pageY: movePoint.pageY - contactPoint.offsetY
          }
        });
  });

spriteMouseDrags.
  forEach((dragPoint) => {
    sprite.style.left = dragPoint.pageX + "px";
    sprite.style.top  = dragPoint.pageY + "px";
  });
