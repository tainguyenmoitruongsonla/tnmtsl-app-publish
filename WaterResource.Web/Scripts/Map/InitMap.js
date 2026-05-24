app.service("mapService", function ($http) {
  "use strict";

  // Initial map
  var mymap = null;
  this.initMap = function (mapId) {
    mymap = L.map(mapId, {
      maxZoom: 15,
    }).setView([21.248632, 104.118988], 8);

    var layer = L.esri.basemapLayer("Imagery").addTo(mymap);
    var layerLabels = null;

    var zoomInfo = L.control({ position: "bottomleft" });
    zoomInfo.onAdd = function () {
      this._div = L.DomUtil.create("div", "map-zoom-info");
      this.update();
      return this._div;
    };
    zoomInfo.update = function () {
      this._div.innerHTML = "Zoom: " + mymap.getZoom();
    };
    zoomInfo.addTo(mymap);
    mymap.on("zoomend", function () {
      zoomInfo.update();
    });

    function setBasemap(basemap) {
      if (layer) {
        mymap.removeLayer(layer);
      }

      layer = L.esri.basemapLayer(basemap);

      mymap.addLayer(layer);

      if (layerLabels) {
        mymap.removeLayer(layerLabels);
      }

      layerLabels = null;
    }

    var basemaps = document.getElementById("basemaps");

    basemaps.addEventListener("change", function () {
      setBasemap(basemaps.value);
    });

    MapAdminBoundary.addAdminBoundaryLayer(mymap);
  };
});
