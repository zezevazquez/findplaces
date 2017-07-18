

var map;
var infowindow;
var center = new google.maps.LatLng(37.7853448, -122.3975658)
// var request = {
//   location: center,
//   radius: 8700,
//   types: ['bar']
// }

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 15
  });
  console.log('wtf is going on?');
  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: center,
    radius: 5500,
    type: ['bar']
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place, timeout) {
  marker = new google.maps.Marker({
    map: map,
    title: place.name,
    animation:google.maps.Animation.DROP,
    icon: typeof place.photos !== 'undefined' ? place.photos[0].getUrl({'maxWidth': 65, 'maxHeight': 65}) : '',
    place: {
        placeId: place.place_id,
        location: place.geometry.location
      }
  });

  google.maps.event.addListener(marker, 'click', function() {
  infowindow.setContent(place.name + ' - ' + place.rating + ' stars rating!');
  infowindow.open(map, this);
  });
}

google.maps.event.addDomListener(window, 'load', initMap);
