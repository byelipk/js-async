const fetchJsonp = require("fetch-jsonp");
const Observable = require("rxjs/Rx").Observable;
const Tether     = require("tether");
const Velocity   = require("velocity-animate");

// Arrow button key codes
const LEFT  = 37;
const UP    = 38;
const RIGHT = 39;
const DOWN  = 40;

function createElementWithText(el, text) {
  let textNode = document.createTextNode(text);
  let element  = document.createElement(el);

  element.appendChild(textNode);

  return element;
}

function removeChildrenFrom(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function displayDropdown() {
  resultsDropdown.style.display = "block";
  resultsDropdown.style.width   = `${searchInputField.offsetWidth}px`;

  new Tether({
    element: resultsDropdown,
    target: searchInputField,
    attachment: 'top middle',
    targetAttachment: 'bottom middle'
  });
}

function hideDropdown() {
  resultsDropdown.style.display = "none";
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
  return Observable.create(function forEach(observer) {
    const url = buildURL(term);

    let cancelled = false;

    fetchJsonp(url)
      .then(resp => resp.json())
      .then(json => {
        if (!cancelled) {
          observer.next(json);
          observer.complete();
        }
      })
      .catch(errv => observer.error())

    return function unsubscribe() {
      cancelled = true;
    }
  });
}


// DOM Elements
let searchBtn = document.querySelector("#search-toggle");
let searchInputField  = document.querySelector("#search-input");
let searchForm        = document.querySelector("#search-form");
let resultsDropdown   = document.querySelector("#results-dropdown");

// Observables
let searchBtnClicks = Observable.fromEvent(searchBtn, "click");
let keypresses      = Observable.fromEvent(searchInputField, "input");
let blurs           = Observable.fromEvent(searchInputField, "blur");
let focuses         = Observable.fromEvent(searchInputField, "focus");

let searchFormOpens =
  searchBtnClicks
    .do(() => {
      console.log("Opening form...");

      searchBtn.classList.remove("d-block");  // hide button
      searchForm.classList.add("d-block");    // show form
      searchInputField.focus();               // focus on input
    });


let searchResultSet =
  // Map an opened search form to search results
  searchFormOpens
    .map(() => {
      // DOM Elements
      let closeBtn = document.querySelector("#close");

      // Observables
      let closeBtnClicks = Observable.fromEvent(closeBtn, "click");

      let searchFormCloses =
        closeBtnClicks
          .do(() => {
            searchBtn.classList.add("d-block");
            searchForm.classList.remove("d-block");
          });

      // We only care about key presses when someone
      // has clicked the search button.
      return keypresses

        // {.'a'.'b'..'c'...'d'...'e'.'f'.........
        .throttleTime(20)

        // {.'a'......................'f'.........
        .map(press => {
          return press.target.value.trim();
        })

        // {..'af'....'af'....'afb'...............
        .distinctUntilChanged()

        // {..'af'............'afb'...............
        .map(search => {
          if (search) {
            return getWikiSearchResults(search).retry(3);
          }
          else {
            return Observable.of([]);
          }
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

        .takeUntil(searchFormCloses)

    }).switch()

searchResultSet
  // ........................['abacus'].....
  .subscribe({
    next: data => {
      let search       = data[0];
      let results      = data[1];
      let descriptions = data[2];
      let urls         = data[3];

      if (results.length === 0) {
        removeChildrenFrom(resultsDropdown);

        let node = createElementWithText("p", "No results to display...");

        resultsDropdown.appendChild(node);
      }
      else {
        removeChildrenFrom(resultsDropdown);

        let nodes = results.map(result => createElementWithText("p", result));

        nodes.forEach(node => resultsDropdown.appendChild(node));
      }

      displayDropdown();
    },

    error: e => console.error(e),

    complete: () => console.log("DONE")
  });

blurs.subscribe(hideDropdown);

focuses.subscribe(() => {
  if (resultsDropdown.children.length > 0) {
    displayDropdown();
  }
});
