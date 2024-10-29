const options = {
    // Required: API key
    key: '7JcvAFEe75AnbDqWSJiFeivDsRcIVIEC', // REPLACE WITH YOUR KEY !!!

    // Put additional console output
    verbose: true,

    // Optional: Initial state of the map
    lat: 16.1204926,
    lon: 107.1247684,
    zoom: 6,
};

// Initialize Windy API
windyInit(options, windyAPI => {
    // windyAPI is ready, and contain 'map', 'store',
    // 'picker' and other usefull stuff

    const { map } = windyAPI;
    // .map is instance of Leaflet map

    L.popup()
        .setLatLng([16.1204926, 107.1247684])
        .setContent('Viet Nam')
        .openOn(map);
		
	L.marker([21.1204926, 107.1247684]).bindPopup('Hello').addTo(map).on('click', function(e) {
		console.log(e.latlng);
		alert('aaa')
	});
	
	//BEGIN BVHUYEN TEST
	//var map = L.map('map', {
	//center: [3.235002, 101.694028],
	//maxZoom: 17,
	//zoom: 11,
	//zoomControl: false,
	//});

	var addressPoints = [
	['3.235002, 101.694028',
	'3.168844, 101.579014',
	'3.037544, 101.672055',
	'3.128822, 101.696603',
	'3.122308, 101.686818',
	'3.193697, 101.525628'],
	['3.056058, 101.781918',
	'3.063257, 101.699864',
	'3.011145, 101.676518',
	'3.067542, 101.874444',
	'3.140220, 101.586053']  
	];

	//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

	var colors = ['FF0000', '0000FF'];
	var markers = [];



	for(var i = 0; i < addressPoints.length; i++){
		markers[i] = [];
		for(var j = 0; j < addressPoints[i].length; j++){
			var latlng = addressPoints[i][j].split(', ');
			var marker = new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.8, color: '#'+colors[i]}).bindPopup('<table style="width: 100%"><tr><td>Tên trạm:</td><td><span>Địa điểm (sông/hồ)&nbsp;</span></td><td>Địa phương</td></tr><tr><td>Mã trạm:</td><td>Lưu vực</td><td>Mực nước lịch sử</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></table>');
			markers[i].push(marker);
		}
	}

	for(var i = 0; i < addressPoints.length; i++) {
		var xx = i;
		var cluster = new L.MarkerClusterGroup({
			iconCreateFunction: function(cl) {
				return new L.DivIcon({ html: '<div class="cluster layer'+xx+'">' + cl.getChildCount() + '</div>' });
			},
			maxClusterRadius: 50
		});
		for(var j = 0; j < markers[i].length; j++){
			cluster.addLayer(markers[i][j]);
		}
		map.addLayer(cluster);
	}



	//END BVHUYEN TEST
});