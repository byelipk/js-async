require("babel-polyfill");

class Observable {

  fromEvent(dom, eventName) {
    // Return an observable object
    return {
      forEach: function forEach(observer) {
        let handler = (e) => observer.onNext(e);

        dom.addEventListener(eventName, handler);

        // Return a subscription object
        return {
          dispose: function dispose() {
            dom.removeEventListener(eventName, handler);
          }
        };
      }
    };
  }
}
