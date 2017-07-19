let map, infowindow, service;
let searchResults = [];
const center = new google.maps.LatLng(37.7853448, -122.3975658)
const request = {
  location: center,
  radius: 8700,
  types: ['bar']
}
const mapControls = {
  center: center,
  zoom: 15,
  mapTypeControl: true,
  mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.TOP_RIGHT
  },
  zoomControl: false,
  zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER
  },
  scaleControl: true,
  streetViewControl: true,
  streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP
  },
  fullscreenControl: true
}

function initMap() {
  const input = document.getElementById('pac-input');
  const searchBox = new google.maps.places.SearchBox(input);

  map = new google.maps.Map(document.getElementById('map'), mapControls)
  service = new google.maps.places.PlacesService(map)
  infowindow = new google.maps.InfoWindow()
  service.nearbySearch(request, callback)

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', function() {
  const places = searchBox.getPlaces();

  if (places.length == 0) {
    return;
  }

  searchResults.forEach(function(marker) {
    marker.setMap(null);
  });
  const bounds = new google.maps.LatLngBounds();

  places.forEach(function(place) {
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }
    let searchItem = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    searchResults.push(new google.maps.Marker({
      map: map,
      icon: searchItem,
      title: place.name,
      position: place.geometry.location
    }));

    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
    google.maps.event.addListener(searchResults[0], 'click', function() {
      infowindow.setContent('<div><strong>' + place.name + '</strong><br><i>' + place.rating + ' star rating!</i>' + '<br>' + place.vicinity + '</div>');
      infowindow.open(map, this);
    });
  });
  map.fitBounds(bounds);
  });

}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place, timeout) {
  let markerSpecs = {
    map: map,
    title: place.name,
    animation:google.maps.Animation.DROP,
    // icon: typeof place.photos !== 'undefined' ? place.photos[0].getUrl({'maxWidth': 65, 'maxHeight': 65}) : '',
    //cool feature, but it looks janky
    place: {
      placeId: place.place_id,
      location: place.geometry.location
    }
  }
  marker = new google.maps.Marker(markerSpecs);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div><strong>' + place.name + '</strong><br><i>' + place.rating + ' star rating!</i>' + '<br>' + place.vicinity + '</div>');
    infowindow.open(map, this);
  });
  console.log(place);
}
google.maps.event.addDomListener(window, 'load', initMap);
