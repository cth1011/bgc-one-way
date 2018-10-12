mapboxgl.accessToken = 'pk.eyJ1IjoiY3RoMTAxMSIsImEiOiJjam1zeGxieXcwanVtM3dwOGM2MDYycHpsIn0.YprKfMh8soeZo9N3ooomhQ';
var afterMap = new mapboxgl.Map({
    container: 'after',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [121.0503,14.5489],
    zoom: 14
});
afterMap.on('load', function() {

  afterMap.addSource('jams', {
      "type": "geojson",
      "data": "https://storage.googleapis.com/waze-chris/jams_0917-0930.geojson"
  });
  afterMap.addSource('jams-before', {
      "type": "geojson",
      "data": "https://storage.googleapis.com/waze-chris/jams_0903-0916.geojson"
  });

    afterMap.addLayer({
        "id": "jams-heat",
        "type": "heatmap",
        "source": "jams",
        "maxzoom": 16,
        "paint": {
          // increase weight as diameter breast height increases
            "heatmap-weight": {
                "property": "delay",
                "type": "exponential",
                "stops": [
                  [1, 0],
                  [200, 1],
                  [400,2],
                  [600,3]
                ]
            },
          // increase intensity as zoom level increases
            "heatmap-intensity": {
                "stops": [
                    [9, 0],
                    [10, 2],
                    [15, 3]
                ]
            },
          // use sequential color palette to use exponentially as the weight increases
            "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(233, 74, 47,0)",
                0.25, "rgb(233, 74, 47)",
                0.5, "rgb(233, 74, 47)",
                1.0, "rgba(233, 74, 47, 0.8)"
            ],
            // increase radius as zoom increases
            "heatmap-radius": {
                "stops": [
                    [13, 5],
                    [15, 15]
                ]
            },
            // decrease opacity to transition into the circle layer
            "heatmap-opacity": {
                "default": 1,
                "stops": [
                    [19, 1],
                    [20, 1]
                ]
            },
        },
          "filter": ['==',['number',['get', 'hour']],12]
    }, 'waterway-label');
    afterMap.addLayer({
        "id": "jams-heat-before",
        "type": "heatmap",
        "source": "jams-before",
        "maxzoom": 16,
        "paint": {
          // increase weight as diameter breast height increases
            "heatmap-weight": {
                "property": "delay",
                "type": "exponential",
                "stops": [
                    [1, 0],
                    [200, 1],
                    [400,2],
                    [600,3]
                ]
            },
          // increase intensity as zoom level increases
            "heatmap-intensity": {
                "stops": [
                    [9, 0],
                    [10, 2],
                    [15, 3]
                ]
            },
          // use sequential color palette to use exponentially as the weight increases
            "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(180,180,180,0)",
                0.25, "rgb(180,180,180)",
                0.5, "rgb(180,180,180)",
                1.0, "rgba(180,180,180, 0.3)"
            ],
            // increase radius as zoom increases
            "heatmap-radius": {
                "stops": [
                    [13, 5],
                    [15, 15]
                ]
            },
            // decrease opacity to transition into the circle layer
            "heatmap-opacity": {
                "default": 1,
                "stops": [
                    [19, 1],
                    [20, 1]
                ]
            },
        },
          "filter": ['==',['number',['get', 'hour']],12]
    }, 'waterway-label');
});
// TIME SLIDER
document.getElementById('slider').addEventListener('input', function(e) {
  var hour = parseInt(e.target.value);
  // update the map
  afterMap.setFilter('jams-heat', ['==', ['number', ['get', 'hour']], hour]);
  afterMap.setFilter('jams-heat-before', ['==', ['number', ['get', 'hour']], hour]);

  // converting 0-23 hour to AMPM format
  var ampm = hour >= 12 ? 'PM' : 'AM';
  var hour12 = hour % 12 ? hour % 12 : 12;

  // update text in the UI
  document.getElementById('active-hour').innerText = hour12 + ampm;
});

//click on tree to view dbh in a popup
afterMap.on('click', 'alerts-marker', function (e) {
  new mapboxgl.Popup()
    .setLngLat(e.features[0].geometry.coordinates)
    .setHTML('<b>Type:</b> '+ e.features[0].properties.type)
    .addTo(afterMap);
});
