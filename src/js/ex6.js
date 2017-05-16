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

// Reduce allows us to make comparisons because it gives us
// to items at the same time.
Array.prototype.reduce = function(combiner, initialValue) {
	var counter,
		accumulatedValue;

	// If the array is empty, do nothing
	if (this.length === 0) {
		return this;
	}
	else {
		// If the user didn't pass an initial value, use the first item.
		if (arguments.length === 1) {
			counter = 1;
			accumulatedValue = this[0];
		}
		else if (arguments.length >= 2) {
			counter = 0;
			accumulatedValue = initialValue;
		}
		else {
			throw "Invalid arguments.";
		}

		// Loop through the array, feeding the current value and the result of
		// the previous computation back into the combiner function until
		// we've exhausted the entire array and are left with only one value.
		while(counter < this.length) {
			accumulatedValue = combiner(accumulatedValue, this[counter])
			counter++;
		}

		return [accumulatedValue];
	}
};

Array.zip = function(left, right, combinerFunction) {
	var counter,
		results = [];

	for(counter = 0; counter < Math.min(left.length, right.length); counter++) {
    results.push(combinerFunction(left[counter],right[counter]));
  }

	return results;
};



var lists = [
  {
    "id": 5434364,
    "name": "New Releases"
  },
  {
    "id": 65456475,
    "name": "Thrillers"
  }
],
videos = [
  {
    "listId": 5434364,
    "id": 65432445,
    "title": "The Chamber"
  },
  {
    "listId": 5434364,
    "id": 675465,
    "title": "Fracture"
  },
  {
    "listId": 65456475,
    "id": 70111470,
    "title": "Die Hard"
  },
  {
    "listId": 65456475,
    "id": 654356453,
    "title": "Bad Boys"
  }
];

_results = lists.map(list => {
  let filtered = videos
    .filter(video => video.listId === list.id )
    .map(video => { return { id: video.id, title: video.title  } })

  return {
    name: list.name,
    videos: filtered
  }
})

console.log(_results)
