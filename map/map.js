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
//    $.each(result.records, function(index){
//        var recordData = result.records[index]["fields"];
//        var popupContent = `
//        <div>
//            <h3>${recordData['caseID']}</h3>
//			<h4>Homeowner: ${recordData['Owner']}</h4>
//            <h4>Contractor: ${recordData['contractor_name']}</h4>
//            <h4>Status: ${recordData['Case_Status']}</h4>
//        </div>`;

// customize to pull from BBR roof reset json		
    $.each(result.Cases, function(index){
        var caseData = result.Cases[index]["fields"];
        var popupContent = `
        <div>
            <h3>${caseData['caseID']}</h3>
			<h4>Homeowner: ${caseData['Owner']}</h4>
            <h4>Contractor: ${caseData['contractor_name']}</h4>
            <h4>Status: ${caseData['Case_Status']}</h4>
        </div>`;

// locate the markers and 		
        var marker = L.marker([caseData['latitude'], caseData['longitude']]);
        marker.bindPopup(popupContent, {
            width: "350px"
        });
        markers.addLayer(marker);
    });
    map.addLayer(markers);
});
