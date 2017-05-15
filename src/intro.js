// [1,2,3].forEach(x => console.log(x))

// console.log([1,2,3].map(x => x + 1));
//
// console.log([1,2,3].filter(x => x == 2));

const concatAll = (array) => {
  return array
    .filter(x => {
      if (x.length) { return x.length > 0; }
      else          { return true; }})
    .reduce((acc, x) => {
      x.forEach(i => acc.push(i));
      return acc; });
}


console.log(concatAll( [ [1], [2], [3,4], [], [5], [ [10] ] ] ));
// [1,2,3,4,5]
