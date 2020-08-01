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

(async function() {
	let allHomeless = await getAllHomeless(AllHomelessURL);
	let allHomelessLocations = allHomeless.map((x) => x.location);
})();

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
