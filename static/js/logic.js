// USGS GeoJSON URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Creating map object
// var myMap = L.map("map", {
//     center: [34.0522, -118.2437],
//     zoom: 8
//   });
  
// // Adding tile layer
// L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets",
//   accessToken: API_KEY
// }).addTo(myMap);

// chooseColor for marker color
function chooseColor(magnitude){
  if (magnitude > 5){
    return "red";
  }else if (magnitude > 4){
    return "darkorange";
  }else if (magnitude > 3){
    return "orange";
  }else if (magnitude > 2){
    return "yellow";
  }else if (magnitude > 1){
    return "yellowgreen";
  }else{
    return "lightgreen";
  }
}


function createCircleMarker( feature, latlng ){
  var color = chooseColor(feature.properties.mag);
  return L.circleMarker( latlng, {
    radius: (feature.properties.mag * 3.5),
    fillColor: color,
    color: color,
    weight: 1,
    opacity: 1,
    fillOpacity: 1
  } );
}

// Perform a GET request to the query URL
d3.json(url, function(usgs) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(usgs.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><hr>" +
      "<p>" + feature.properties.title + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: createCircleMarker,
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var satmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var greymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satmap,
    "Greyscale": greymap,
    "Outdoors": outdoorsmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      45.83, -138.98
    ],
    zoom: 3,
    layers: [satmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function() {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = ["0-1","1-2","2-3","3-4","4-5","5+"],
          labels = ["#90EE90","#9ACD32","#FFFF00","#FFA500","#FF8C00","#FF0000"];

      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background-color:' + labels[i] + ';"></i> ' + grades[i] + "<br>";
      }

      return div;
  };
  legend.addTo(myMap);
}
