function Observable(forEach) {
  this._forEach = forEach;
}

Observable.prototype = {
  forEach: function(onNext, onError, onCompleted) {
    // Are they passing in functions?
    if (typeof(arguments[0]) === "function") {
      return this._forEach({
        onNext: onNext,
        onError: onError         || function() {},
        onCompleted: onCompleted || function() {}
      });
    }
    // Are they passing an observer?
    else {
      return this._forEach(onNext);
    }
  },

  map: function(projectionFn) {
    let self = this;
    return new Observable(function forEach(observer) {
      return self.forEach(
        function onNext(x) { observer.onNext(projectionFn(x)) },
        function onError(e) { observer.onError(e) },
        function onCompleted() { observer.onCompleted() }
      )
    });
  },

  filter: function(testFn) {
    let self = this;
    return new Observable(function forEach(observer) {
      return self.forEach(
        function onNext(x) {
          if (testFn(x)) {
            observer.onNext(x)
          }
        },
        function onError(e) { observer.onError(e) },
        function onCompleted() { observer.onCompleted() }
      )
    });
  },

  take: function(count) {
    let self = this;
    let counter = 0;
    return new Observable(function forEach(observer) {
      let subscription = self.forEach(
        function onNext(x) {
          observer.onNext(x);
          counter++;
          if (counter === count) {
            observer.onCompleted();
            subscription.dispose();
          }
        },

        function onError(e) { observer.onError(e) },
        function onCompleted() { observer.onCompleted() }
      );

      return subscription;
    });
  }
}

// Wrap an observable around the events api
Observable.fromEvent = function(dom, eventName) {
  return new Observable(function forEach(observer) {
    let handler = (e) => observer.onNext(e);

    dom.addEventListener(eventName, handler);

    return {
      dispose: () => dom.removeEventListener(eventName, handler)
    }
  });
}

// Wrap an observable around the Proxy api
Observable.fromProxy = function(target) {
  return new Observable(function forEach(observer) {
    let handler = {
      get: function (target, key) {
        observer.onNext( target[key] );
      },

      set: function (target, key, value) {
        observer.onNext( target[key] = value );
      }
    };

    let p = Proxy.revocable(target, handler);

    observer.onNext(p.proxy);

    return {
      dispose: function() {
        p.revoke();
      }
    }
  });
};


// The button

let button = document.querySelector("button");

let clicks = Observable.fromEvent(button, "click");

clicks.forEach(x => console.log(x));


// The person proxy

let person = { name: "Jim" };

Observable
  .fromProxy(person)
  .forEach(function(proxy) {
    proxy.name = "PWND!"
  });
