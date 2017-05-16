var HelloWorld = require("./hello-world");
var Rx = require('rxjs/Rx');

let button    = document.querySelector("button");
let searchBox = document.querySelector("#search");
let form      = document.querySelector("form");

// Prevent submitting the form refreshing the page
Rx.Observable.fromEvent(form, "submit")
             .subscribe(ev => ev.preventDefault() );


 let buttonClicks = Rx.Observable.fromEvent(button, "click");

 buttonClicks.
   take(1).
   forEach(function(click) {
     click.preventDefault();
     alert("Button was clicked. Stopping traversal.");
   });

 // Sanity check
 let hw = new HelloWorld();
 hw.speak();
