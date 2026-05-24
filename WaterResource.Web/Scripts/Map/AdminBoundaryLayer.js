window.MapAdminBoundary = (function () {
  function ensureBoundaryPane(map) {
    var paneName = "adminBoundaryPane";
    if (!map.getPane(paneName)) {
      map.createPane(paneName);
      map.getPane(paneName).style.zIndex = 420;
    }
    return paneName;
  }

  function createBoundaryStyle() {
    return {
      color: "#222",
      weight: 1,
      opacity: 1,
      fillColor: "#fff",
      fillOpacity: 0.01,
    };
  }

  function getDisplayName(properties) {
    if (!properties) return "Don vi hanh chinh";
    return (
      properties.ten_hien_thi ||
      properties.TenHienThi ||
      properties.ten_xa ||
      properties.TenXa ||
      properties.CommuneName ||
      properties.name ||
      properties.Name ||
      "Don vi hanh chinh"
    );
  }

  function getProvinceName(properties) {
    if (!properties) return "";
    return (
      properties.ten_tinh || properties.TenTinh || properties.ProvinceName || ""
    );
  }

  function markBoundaryLayer(layer) {
    layer.options.isAdministrativeBoundary = true;
    return layer;
  }

  function ensureLabelPane(map) {
    var paneName = "adminBoundaryLabelPane";
    if (!map.getPane(paneName)) {
      map.createPane(paneName);
      map.getPane(paneName).style.zIndex = 430;
      map.getPane(paneName).style.pointerEvents = "none";
    }
    return paneName;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getLayerCenter(layer) {
    if (layer.getBounds) {
      return layer.getBounds().getCenter();
    }
    if (layer.getLatLng) {
      return layer.getLatLng();
    }
    return null;
  }

  function addGeoJsonBoundary(map, url) {
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Cannot load GeoJSON: " + url);
        return res.json();
      })
      .then(function (geojson) {
        var paneName = ensureBoundaryPane(map);
        var labelPaneName = ensureLabelPane(map);
        var labelLayer = L.layerGroup();
        var minLabelZoom = 11;
        var layer = L.geoJSON(geojson, {
          pane: paneName,
          style: createBoundaryStyle,
          onEachFeature: function (feature, lyr) {
            var p = feature.properties || {};
            var name = getDisplayName(p);
            var provinceName = getProvinceName(p);
            var center = getLayerCenter(lyr);
            markBoundaryLayer(lyr);
            lyr.bindPopup(
              "<b>" +
                name +
                "</b>" +
                (p.ma_xa ? "<br/>Ma xa: " + p.ma_xa : "") +
                (p.Code ? "<br/>Ma: " + p.Code : "") +
                (provinceName ? "<br/>Tinh: " + provinceName : ""),
            );
            if (center) {
              var label = L.marker(center, {
                pane: labelPaneName,
                interactive: false,
                icon: L.divIcon({
                  className: "admin-boundary-label",
                  html: escapeHtml(name),
                }),
              });
              markBoundaryLayer(label);
              labelLayer.addLayer(label);
            }
          },
        });

        markBoundaryLayer(layer);
        markBoundaryLayer(labelLayer);
        layer.addTo(map);
        function updateLabelVisibility() {
          if (map.getZoom() >= minLabelZoom) {
            if (!map.hasLayer(labelLayer)) {
              labelLayer.addTo(map);
            }
          } else if (map.hasLayer(labelLayer)) {
            map.removeLayer(labelLayer);
          }
        }

        updateLabelVisibility();
        map.on("zoomend", updateLabelVisibility);
        return layer;
      });
  }

  function addKmlBoundary(map, url) {
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Cannot load KML: " + url);
        return res.text();
      })
      .then(function (kmltext) {
        var parser = new DOMParser();
        var kml = parser.parseFromString(kmltext, "text/xml");
        var layer = new L.KML(kml, {
          pane: ensureBoundaryPane(map),
        });
        markBoundaryLayer(layer);
        layer.addTo(map);
        return layer;
      });
  }

  function addAdminBoundaryLayer(map, options) {
    options = options || {};
    var geoJsonUrl =
      options.geoJsonUrl || "/LocalFiles/kml/xa-phuong-son-la.geojson";
    var kmlUrl = options.kmlUrl || "/LocalFiles/kml/Province_New.kml";
    var fallbackKmlUrl =
      options.fallbackKmlUrl || "/LocalFiles/kml/Province.kml";

    return addGeoJsonBoundary(map, geoJsonUrl)
      .catch(function () {
        return addKmlBoundary(map, kmlUrl);
      })
      .catch(function () {
        console.warn(
          "Fallback to Province.kml. Replace it with official merged administrative boundary data.",
        );
        return addKmlBoundary(map, fallbackKmlUrl);
      });
  }

  return {
    addAdminBoundaryLayer: addAdminBoundaryLayer,
  };
})();
