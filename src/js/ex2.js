
var movieLists = [
    {
      name: "New Releases",
      videos: [
        {
          "id": 70111470,
          "title": "Die Hard",
          "boxart": "http://cdn-0.nflximg.com/images/2891/DieHard.jpg",
          "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
          "rating": 4.0,
          "bookmark": []
        },
        {
          "id": 654356453,
          "title": "Bad Boys",
          "boxart": "http://cdn-0.nflximg.com/images/2891/BadBoys.jpg",
          "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
          "rating": 5.0,
          "bookmark": [{ id: 432534, time: 65876586 }]
        }
      ]
    },
    {
      name: "Dramas",
      videos: [
        {
          "id": 65432445,
          "title": "The Chamber",
          "boxart": "http://cdn-0.nflximg.com/images/2891/TheChamber.jpg",
          "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
          "rating": 4.0,
          "bookmark": []
        },
        {
          "id": 675465,
          "title": "Fracture",
          "boxart": "http://cdn-0.nflximg.com/images/2891/Fracture.jpg",
          "uri": "http://api.netflix.com/catalog/titles/movies/70111470",
          "rating": 5.0,
          "bookmark": [{ id: 432534, time: 65876586 }]
        }
      ]
    }
  ];

Array.prototype.concatAll = function() {
	var results = [];
	this.forEach(function(subArray) {
    subArray.forEach(m => results.push(m))
	});

	return results;
};

var Rx = require('rxjs/Rx');

// Use map and concatAll to flatten the movieLists in a list of video ids.

let ids = movieLists.map(list =>
  list.videos.map(video => video.id)
).concatAll()

console.log("ARRAYS:")
console.log(ids)

console.log()
console.log("OBSERVABLES:")

let _lists = Rx.Observable.of(movieLists);

let _names = _lists.map(list => {
  return list.map(set => set.name)
});

let _ids = _lists.map(obs => {
  return obs.map(set =>
    set.videos.map(video => video.id)
  ).concatAll()
});

// _lists.subscribe(ids => console.log(ids))
// _names.subscribe(name => console.log(name))
_ids.subscribe(x => console.log(x))
