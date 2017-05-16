var Rx = require('rxjs/Rx');

let input = document.querySelector("#search");
let button = document.querySelector("button");
let form = document.querySelector("form");

Rx.Observable.fromEvent(form, "submit").subscribe(e => {
  e.preventDefault();
  e.stopPropagation();
});

let clicks = Rx.Observable.fromEvent(button, "click");
let keypresses = Rx.Observable.fromEvent(input, "keypress");

keypresses.takeUntil(clicks)
          .forEach(press => {
            console.log(press);
          });
