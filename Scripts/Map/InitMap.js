app.service("mapService", function ($http) {
    'use strict';

    // Initial map
    var mymap = null; 
    this.initMap = function(mapId) {
        mymap = L.map(mapId, {
            maxZoom: 15
        }).setView([21.248632, 104.118988], 8);

        var layer = L.esri.basemapLayer('Imagery').addTo(mymap);
        var layerLabels = L.esri.basemapLayer('Imagery' + 'Labels');
        mymap.addLayer(layerLabels);

        function setBasemap(basemap) {
            if (layer) {
                mymap.removeLayer(layer);
            }

            layer = L.esri.basemapLayer(basemap);

            mymap.addLayer(layer);

            if (layerLabels) {
                mymap.removeLayer(layerLabels);
            }

            if (basemap === 'ShadedRelief'
                || basemap === 'Oceans'
                || basemap === 'Gray'
                || basemap === 'Imagery'
            ) {
                layerLabels = L.esri.basemapLayer(basemap + 'Labels');
                mymap.addLayer(layerLabels);
            } else if (basemap.includes('Imagery')) {
                layerLabels = L.esri.basemapLayer('ImageryLabels');
                mymap.addLayer(layerLabels);
            }
        }

        var basemaps = document.getElementById('basemaps');

        basemaps.addEventListener('change', function () {
            setBasemap(basemaps.value);
        });

        // Load kml file
        fetch('/LocalFiles/kml/Province.kml')
            .then(res => res.text())
            .then(kmltext => {
                // Create new kml overlay
                const parser = new DOMParser();
                const kml = parser.parseFromString(kmltext, 'text/xml');
                const track = new L.KML(kml);
                mymap.addLayer(track);
            });

        var BING_KEY = 'AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L'
        var bing = new L.BingLayer(BING_KEY);
        mymap.addLayer(bing);
    }
});

