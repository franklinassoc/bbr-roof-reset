// create map and add basemap tile layer
var map = L.map('map', {attributionControl: false})
map.setView([30.4, -91.1], 12);

// credits for basemap tile layer
var credits = L.control.attribution().addTo(map);
credits.addAttribution('&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>');

// make and add basemap layer from mapbox | Deactivated by James
// var mapbox_api_key = "pk.eyJ1IjoiZnJhbmthZG1pbiIsImEiOiJjajhvbW51NHYwNWI2MzNyejV4Y2s0aDN4In0.FSOtZl6iInZhjDUiS6Xscg"
// var dark_bm = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?'
//     +'access_token='+mapbox_api_key,
//     {maxNativeZoom:18,maxZoom:19}
// );
// dark_bm.addTo(map)

  /* Carto light-gray basemap tiles with labels */
  var light = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
  }).addTo(map); // EDIT - insert or remove ".addTo(map)" before last semicolon to display by default
   // controlLayers.addBaseLayer(light, 'Carto Light basemap')
   
// this could also be a real url, but it would need to contain your airtable api key
// example below uses a local file that is frequently updated on the server.
var url = "table-data.json";

// get table contents and create cluster layer from it
var markers = L.markerClusterGroup();
$.getJSON(url, function(result){
    $.each(result.records, function(index){
        var recordData = result.records[index]["fields"];
        var popupContent = `
        <div>
            <h3>${recordData['ID']}</h3>
            <h4>Contractor: ${recordData['Contractor Name']}</h4>
            <h4>Status: ${recordData['Case_Status']}</h4>
        </div>`;
        var marker = L.marker([recordData['latitude'], recordData['longitude']]);
        marker.bindPopup(popupContent, {
            width: "350px"
        });
        markers.addLayer(marker);
    });
    map.addLayer(markers);
});

$.getJSON(url, function(result) {
  geoLayer = L.geoJson(url, {
    style: function(feature) {
      var status = feature.properties.Case_Status;
      if (status >= 'Intake') {
        return {
          color: "white"
        }; 
      }
      else if (status >= 'Queued') {
        return {
          color: "lightgrey"
        };
      } else if (status >= 'In Process') {
        return {
          color: "yellow"
        };
      } else if (status >= 'Completed') {
        return {
          color: "darkblue"
        };
      } else if (status >= 'Approved') {
        return {
          color: "lightgreen"
        };
      } else if (status >= 'Follow-up Required') {
        return {
          color: "orange"
        };
      } else if (status >= 'Delayed') {
        return {
          color: "red"
        };
		} else { //cancelled, black
        return {
          color: "black"
        }
      }
    },

    onEachFeature: function(feature, layer) {

      var popupText = "<b>Case:</b> " + feature.properties.ID +
        "<br><b>Owner:</b> " + feature.properties.Owner +
        "<br><b>Status:</b> " + feature.properties.Case_Status ;

      layer.bindPopup(popupText, {
        closeButton: true,
        offset: L.point(0, -20)
      });
      layer.on('click', function() {
        layer.openPopup();
      });
    },

    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: Math.round(feature.properties.mag) * 3,
      });
    },
  }).addTo(map);
});
