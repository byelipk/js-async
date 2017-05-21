const fetchJsonp = require("fetch-jsonp");
const Observable = require("rxjs/Rx").Observable;
const Tether     = require("tether");
const Velocity   = require("velocity-animate");

function displayDropdown() {
  resultsDropdown.style.display = "block";

  resultsDropdown.style.width = `${searchInputField.offsetWidth}px`;

  new Tether({
    element: resultsDropdown,
    target: searchInputField,
    attachment: 'top middle',
    targetAttachment: 'bottom middle'
  });
}

function buildURL(term) {
  let apiURL = `https://en.wikipedia.org/w/api.php?`;
  let apiAction = `&action=opensearch`;
  let apiFormat = `&json`;
  let apiSearch = `&search=`;
  let apiLimit  = `&limit=5`;

  return apiURL   +
        apiAction +
        apiLimit  +
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

    fetchJsonp(url)
      .then(resp => resp.json())
      .then(json => {
        if (!cancelled) {
          observer.next(json[1]);
          observer.complete();
        }
      })
      .catch(errv => observer.error())

    return function unsubscribe() {
      cancelled = true;
    }
  });
}


let searchToggleBtn       = document.querySelector("#search-toggle");
let searchToggleBtnClicks = Observable.fromEvent(searchToggleBtn, "click");

let searchInputField      = document.querySelector("#search-input");
let searchInputKeypresses = Observable.fromEvent(searchInputField, "keypress");

let resultsDropdown = document.querySelector("#results-dropdown");

let searchResultSet =

  searchInputKeypresses

    // {.'a'.'b'..'c'...'d'...'e'.'f'.........
    .throttleTime(20)

    // {.'a'......................'f'.........
    .map(press => {
      return press.target.value;
    })

    // {..'af'....'af'....'afb'...............
    .distinctUntilChanged()

    // {..'af'............'afb'...............
    .map(search => {
      return getWikiSearchResults(search).retry(3);
    })


    // NOTE
    // The three strategies for managing a collection of observables are:
    //
    // merge   {...['ardvark', 'abacus']....['abacus']...
    // concat  {...['ardvark', 'abacus']................['abacus']...
    // switch  {............................['abacus']...

    // {..
    // ...{...['ardvark', 'abacus']}  (dispose)
    // ............{...............['abacus']}
    // }
    .switch()

searchResultSet
  // ........................['abacus'].....
  .subscribe({

    next: results => {
      let nodes = results.map(result => {
        let text = document.createTextNode(result);
        let node = document.createElement("p");

        node.appendChild(text);

        return node;
      });

      while(resultsDropdown.firstChild) {
        resultsDropdown.removeChild(resultsDropdown.firstChild);
      }

      nodes.forEach(node => resultsDropdown.appendChild(node));

      displayDropdown()
    },

    error: err => console.error(err),

    complete: () => console.log("DONE")
  });





// NOTE
// Sanity check
// getWikiSearchResults("Terminator")
//   .subscribe(results => console.log(results))
