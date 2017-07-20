let map, infowindow, service
let searchResults = []
const center = new google.maps.LatLng(37.7853448, -122.3975658)
let counter = 1
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
      position: google.maps.ControlPosition.TOP_LEFT
  },
  fullscreenControl: true
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), mapControls)
  service = new google.maps.places.PlacesService(map)
  infowindow = new google.maps.InfoWindow()
  service.nearbySearch(request, initialSearch)

  const input = document.getElementById('search-input')
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

  const trafficLayer = new google.maps.TrafficLayer()
  trafficLayer.setMap(map)

  const searchBox = new google.maps.places.SearchBox(input)

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds())
  })
  searchBox.addListener('places_changed', function() {
  const places = searchBox.getPlaces()

  if (places.length == 0) {
    return
  }

  searchResults.forEach(function(marker) {
    marker.setMap(null)
  })
  const bounds = new google.maps.LatLngBounds()

  places.forEach(function(place) {
    if (!place.geometry) {
      console.log("Returned place contains no geometry")
      return
    }
    let searchIcon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    }

    searchResults.push(new google.maps.Marker({
      map: map,
      icon: searchIcon,
      title: place.name,
      position: place.geometry.location
    }))

    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport)
    } else {
      bounds.extend(place.geometry.location)
    }
    google.maps.event.addListener(searchResults[0], 'click', function() {
      infowindow.setContent('<div><strong>' + place.name + '</strong><br><i>' + place.rating + ' star rating!</i>' + '<br>' + place.vicinity + '</div>')
      infowindow.open(map, this)
    })
  })
  map.fitBounds(bounds)
  })

}

function initialSearch(results, status) {
  let bounds = new google.maps.LatLngBounds
  let placesList = document.getElementById('places')

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i])
      placesList.innerHTML += '<li>' + results[i].name + '</li>'
      bounds.extend(results[i].geometry.location)
    }
    map.fitBounds(bounds)
  }
}

function createMarker(place, timeout) {
  let markerSpecs = {
    map: map,
    title: place.name,
    animation:google.maps.Animation.DROP,
    place: {
      placeId: place.place_id,
      location: place.geometry.location
    }
  }

  marker = new google.maps.Marker(markerSpecs)

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div><strong>' + place.name + '</strong><br><i>' + place.rating + ' star rating!</i>' + '<br>' + place.vicinity + '</div>')
    infowindow.open(map, this)
  })
  console.log(place)
}

google.maps.event.addDomListener(window, 'load', initMap)
