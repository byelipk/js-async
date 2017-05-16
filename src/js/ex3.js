Array.prototype.concatAll = function() {
	var results = [];
	this.forEach(function(subArray) {
    subArray.forEach(m => results.push(m))
	});

	return results;
};

Array.prototype.concatMap = function(projectionFunctionThatReturnsArray) {
	return this.
		map(function(item) {
      return projectionFunctionThatReturnsArray(item)
		}).
		// apply the concatAll function to flatten the two-dimensional array
		concatAll();
};

var movieLists = [
    {
      name: "Instant Queue",
      videos : [
        {
          "id": 70111470,
          "title": "Die Hard",
          "boxarts": [
            { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/DieHard150.jpg" },
            { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/DieHard200.jpg" }
          ],
          "url": "http://api.netflix.com/catalog/titles/movies/70111470",
          "rating": 4.0,
          "bookmark": []
        },
        {
          "id": 654356453,
          "title": "Bad Boys",
          "boxarts": [
            { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/BadBoys200.jpg" },
            { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/BadBoys150.jpg" }

          ],
          "url": "http://api.netflix.com/catalog/titles/movies/70111470",
          "rating": 5.0,
          "bookmark": [{ id: 432534, time: 65876586 }]
        }
      ]
    },
    {
      name: "New Releases",
      videos: [
        {
          "id": 65432445,
          "title": "The Chamber",
          "boxarts": [
            { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/TheChamber150.jpg" },
            { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/TheChamber200.jpg" }
          ],
          "url": "http://api.netflix.com/catalog/titles/movies/70111470",
          "rating": 4.0,
          "bookmark": []
        },
        {
          "id": 675465,
          "title": "Fracture",
          "boxarts": [
            { width: 200, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture200.jpg" },
            { width: 150, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture150.jpg" },
            { width: 300, height: 200, url: "http://cdn-0.nflximg.com/images/2891/Fracture300.jpg" }
          ],
          "url": "http://api.netflix.com/catalog/titles/movies/70111470",
          "rating": 5.0,
          "bookmark": [{ id: 432534, time: 65876586 }]
        }
      ]
    }
  ];

  // Use one or more map, concatAll, and filter calls to create an array
  // with the following items:
  //
  // [
  //	 {"id": 675465,"title": "Fracture","boxart":"/Fracture150.jpg" },
  //	 {"id": 65432445,"title": "The Chamber","boxart":"/TheChamber150.jpg" },
  //	 {"id": 654356453,"title": "Bad Boys","boxart":"/BadBoys150.jpg" },
  //	 {"id": 70111470,"title": "Die Hard","boxart":"/DieHard150.jpg" }
  // ];

  _movieLists = movieLists.concatMap((list) => {
    return list.videos.concatMap((video) => {
      return video.boxarts.filter((box) => {
        return box.width === 150
      })
      .map((art) => {
        return {id: video.id, title: video.title, boxart: art.url}
      })
    })
  })


  console.log("ARRAYS:");
  console.log(_movieLists);



  var Rx = require('rxjs/Rx');

  _list = Rx.Observable.of(movieLists);

  _filtered = _list.map(obs =>
    obs.concatMap(list =>
      list.videos.concatMap(video =>
        video.boxarts
             .filter(box => box.width === 150)
             .map(art => {
               return {id: video.id, title: video.title, boxart: art.url}
             });
    ));
  );

  console.log()
  console.log("OBSERVABLES:");
  _filtered.subscribe(x => console.log(x))
