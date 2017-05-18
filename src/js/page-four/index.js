let fetchJsonp = require("fetch-jsonp");
let Observable = require("rxjs/Rx").Observable;

let searchInput = document.querySelector("#inputSearch");
let searchForm  = document.querySelector("form");

let searchInputs = Observable.fromEvent(inputSearch, "input");

function buildURL(term) {
  let apiURL = `https://en.wikipedia.org/w/api.php?`;
  let apiAction = `&action=opensearch`;
  let apiFormat = `&json`;
  let apiSearch = `&search=`;

  return apiURL   +
        apiAction +
        apiFormat +
        apiSearch + encodeURIComponent(term);
}

function getWikiSearchResults(term) {

  // TODO Rx.Observable.fromPromise(fetch('/users'));

  // Pass it the definition of forEach so we don't need to
  // create that object we did earlier.
  return Observable.create(function forEach(observer) {
    const url = buildURL(term);

    let cancelled = false;

    const canceler = function canceler(func) {
      if (!cancelled) {
        return func();
      }
    }

    fetchJsonp(url)
      .then(response => {
        return canceler(() => response.json())
      })
      .then(json     => {
        return canceler(() => observer.next(json[1]))
      })
      .catch(err     => {
        return canceler(() => observer.error(err))
      })
      .then(()       => {
        return canceler(() => observer.complete())
      })

    return function unsubscribe() {
      cancelled = true;
    }
  });
}

searchInputs.
  // Subscribe to the observable to get the data using forEach
  forEach((press) => {
    let searchTerm = press.target.value;

    if (searchTerm) {
      let observable = getWikiSearchResults(searchTerm);

      observable.subscribe({
        next:     (x) => console.log(x),
        error:    (x) => console.error(`Something happened: ${x}`),
        complete: ()  => console.log("Finished!"),
      });
    }
});
