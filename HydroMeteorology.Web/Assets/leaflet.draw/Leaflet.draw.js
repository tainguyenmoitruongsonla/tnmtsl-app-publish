/**
 * Leaflet.draw assumes that you have already included the Leaflet library.
 */
L.drawVersion = '0.4.2';
/**
 * @class L.Draw
 * @aka Draw
 *
 *
 * To add the draw toolbar set the option drawControl: true in the map options.
 *
 * @example
 * ```js
 *      var map = L.map('map', {drawControl: true}).setView([51.505, -0.09], 13);
 *
 *      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 *          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 *      }).addTo(map);
 * ```
 *
 * ### Adding the edit toolbar
 * To use the edit toolbar you must initialise the Leaflet.draw control and manually add it to the map.
 *
 * ```js
 *      var map = L.map('map').setView([51.505, -0.09], 13);
 *
 *      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 *          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 *      }).addTo(map);
 *
 *      // FeatureGroup is to store editable layers
 *      var drawnItems = new L.FeatureGroup();
 *      map.addLayer(drawnItems);
 *
 *      var drawControl = new L.Control.Draw({
 *          edit: {
 *              featureGroup: drawnItems
 *          }
 *      });
 *      map.addControl(drawControl);
 * ```
 *
 * The key here is the featureGroup option. This tells the plugin which FeatureGroup contains the layers that
 * should be editable. The featureGroup can contain 0 or more features with geometry types Point, LineString, and Polygon.
 * Leaflet.draw does not work with multigeometry features such as MultiPoint, MultiLineString, MultiPolygon,
 * or GeometryCollection. If you need to add multigeometry features to the draw plugin, convert them to a
 * FeatureCollection of non-multigeometries (Points, LineStrings, or Polygons).
 */
L.Draw = {};

/**
 * @class L.drawLocal
 * @aka L.drawLocal
 *
 * The core toolbar class of the API — it is used to create the toolbar ui
 *
 * @example
 * ```js
 *      var modifiedDraw = L.drawLocal.extend({
 *          draw: {
 *              toolbar: {
 *                  buttons: {
 *                      polygon: 'Draw an awesome polygon'
 *                  }
 *              }
 *          }
 *      });
 * ```
 *
 * The default state for the control is the draw toolbar just below the zoom control.
 *  This will allow map users to draw vectors and markers.
 *  **Please note the edit toolbar is not enabled by default.**
 */
L.drawLocal = {
	// format: {
	// 	numeric: {
	// 		delimiters: {
	// 			thousands: ',',
	// 			decimal: '.'
	// 		}
	// 	}
	// },
	draw: {
		toolbar: {
			// #TODO: this should be reorganized where actions are nested in actions
			// ex: actions.undo  or actions.cancel
			actions: {
				title: 'Cancel drawing',
				text: 'Huỷ'
			},
			finish: {
				title: 'Finish drawing',
				text: 'Kết thúc'
			},
			undo: {
				title: 'Delete last point drawn',
				text: 'Xoá điểm vừa thêm'
			},
			buttons: {
				polyline: 'Vẽ đoạn thẳng',
				polygon: 'Vẽ hình đa giác',
				rectangle: 'Vẽ hình chữ nhật',
				circle: 'Vẽ hình tròn',
				marker: 'Thêm 1 điểm',
				circlemarker: 'Thêm 1 điểm tròn'
			}
		},
		handlers: {
			circle: {
				tooltip: {
					start: 'Kéo thả chuột để vẽ hình tròn.'
				},
				radius: 'Radius'
			},
			circlemarker: {
				tooltip: {
					start: 'Bấm để thêm điểm tròn.'
				}
			},
			marker: {
				tooltip: {
					start: 'Bấm để thêm điểm.'
				}
			},
			polygon: {
				tooltip: {
					start: 'Click to start drawing shape.',
					cont: 'Click to continue drawing shape.',
					end: 'Click first point to close this shape.'
				}
			},
			polyline: {
				error: '<strong>Error:</strong> shape edges cannot cross!',
				tooltip: {
					start: 'Bấm để bắt đầu vẽ.',
					cont: 'Bấm để thêm điểm.',
					end: 'Click để kết thúc đoạn thẳng.'
				}
			},
			rectangle: {
				tooltip: {
					start: 'Kéo thả chuột để vẽ hình chữ nhật.'
				}
			},
			simpleshape: {
				tooltip: {
					end: 'Thả chuột để vẽ hình.'
				}
			}
		}
	},
	edit: {
		toolbar: {
			actions: {
				save: {
					title: 'Lưu thay đổi',
					text: 'Lưu'
				},
				cancel: {
					title: 'Huỷ chỉnh sửa',
					text: 'Cancel'
				},
				clearAll: {
					title: 'Xoá tất cả',
					text: 'Xoá tất cả'
				}
			},
			buttons: {
				edit: 'Edit layers',
				editDisabled: 'Không có hình để chỉnh sửa',
				remove: 'Xoá hình',
				removeDisabled: 'Không có hình để xoá'
			}
		},
		handlers: {
			edit: {
				tooltip: {
					text: 'Drag handles or markers to edit features.',
					subtext: 'Click cancel to undo changes.'
				}
			},
			remove: {
				tooltip: {
					text: 'Chọn đối tượng để xoá.'
				}
			}
		}
	}
};
