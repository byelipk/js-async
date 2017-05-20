const Observable = require("rxjs/Rx").Observable;

let stream = Observable.of(1,2,3,4,5);

let modified =
  stream
    .map(n => {
      return n + 2;
    })
    .reduce((acc, curr) => {
      acc.push(curr);
      return acc;
    }, [])

modified.forEach(x => console.log(x))
