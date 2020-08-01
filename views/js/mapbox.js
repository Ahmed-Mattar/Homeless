const baseURL = 'http://127.0.0.1:5000/';

const AllHomelessURL = baseURL + 'api/v1/homeless';

// sends a GET request to get all homeless and return all homeless Array
const getAllHomeless = async (url) => {
	let response = await fetch(AllHomelessURL);
	if (response.ok) {
		// if HTTP-status is 200-299
		let jsonResponse = await response.json();
		let homelessArray = jsonResponse.data.homeless;
		return homelessArray;
	} else {
		alert('HTTP-Error: ' + response.status);
	}
};

//getAllHomeless(AllHomelessURL);

let bounds = [
	[ 29.728682, 31.013514 ], // Southwest coordinates
	[ 30.098791, 31.298501 ] // Northeast coordinates
];

mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGFyOTkiLCJhIjoiY2tkYnplZHoyMDViMjJ5cW8yODNmd3J4eCJ9.l58gQF4r43yw9YuLQTBaDA';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mattar99/ckdc0dj0k2h1e1iqwdynszanc',
	center: [ 29.924526, 31.205753 ],
	zoom: 8,
	maxBounds: bounds
});

(async function() {
	let allHomeless = await getAllHomeless(AllHomelessURL);
	let allHomelessLocations = allHomeless.map((x) => x.location);

	for (let i = 0; i < allHomelessLocations.length; i++) {
		let lat = allHomelessLocations[i].coordinates[0];
		let lng = allHomelessLocations[i].coordinates[1];

		current = allHomeless[i];
		let html = `<h6>${current.name}</h6><p>medical care: ${current.medicalCare} <br> Gender: ${current.gender} <br>age: ${current.age}<br> Description: ${current.description}</p>`;
		let popup = new mapboxgl.Popup({ offset: 25 }).setHTML(html);

		new mapboxgl.Marker()
			.setLngLat([ lng, lat ])
			.setPopup(popup) // sets a popup on this marker
			.addTo(map);
	}

	// for (let i = 0; i < allHomelessLocations.length; i++) {
	// 	let lat = allHomelessLocations[i].coordinates[0];
	// 	let lng = allHomelessLocations[i].coordinates[1];

	// 	// add marker
	// 	new mapboxgl.Marker().setLngLat([ lng, lat ]).addTo(map);
	// 	// add popup
	// 	new mapboxgl.Popup({
	// 		offset: 30
	// 	})
	// 		.setLngLat([ lng, lat ])
	// 		.setHTML(`<p>${allHomeless[i]._id}</p>`)
	// 		.addTo(map);
	// }
})();
