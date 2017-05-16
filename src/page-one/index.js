var HelloWorld = require("./hello-world");
var Rx = require('rxjs/Rx');

let button    = document.querySelector("button");
let searchBox = document.querySelector("#search");
let form      = document.querySelector("form");

// Prevent submitting the form refreshing the page
Rx.Observable.fromEvent(form, "submit")
             .subscribe(ev => ev.preventDefault() );

let keypresses = Rx.Observable.
  fromEvent(searchBox, 'keypress').
  throttleTime(500).
  map(key =>
    Rx.Observable.interval(1000)
  ).switch();


let click = Rx.Observable.fromEvent(button, "click");

let result = keypresses.takeUntil(click);

result.subscribe(e => console.log(e));


// Sanity check
let hw = new HelloWorld();
hw.speak();
