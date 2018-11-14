/*jshint esversion: 6 */

// Map actions
(function(Module, $) {
	let objectMap = null;
	let waterColor = $('#objects-map').length ? "#93C6F0" : "#6EB1EB";

	let mapStyle = [{
			"featureType": "administrative",
			"elementType": "labels.text.fill",
			"stylers": [{
				"color": "#444444"
			}]
		},
		{
			"featureType": "landscape",
			"elementType": "all",
			"stylers": [{
				"color": "#f2f2f2"
			}]
		},
		{
			"featureType": "poi",
			"elementType": "all",
			"stylers": [{
				"visibility": "off"
			}]
		},
		{
			"featureType": "road",
			"elementType": "all",
			"stylers": [{
					"saturation": -100
				},
				{
					"lightness": 45
				}
			]
		},
		{
			"featureType": "road.highway",
			"elementType": "all",
			"stylers": [{
				"visibility": "simplified"
			}]
		},
		{
			"featureType": "road.arterial",
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "off"
			}]
		},
		{
			"featureType": "transit",
			"elementType": "all",
			"stylers": [{
				"visibility": "off"
			}]
		},
		{
			"featureType": "water",
			"elementType": "all",
			"stylers": [{
					"color": waterColor
				},
				{
					"visibility": "on"
				}
			]
		}
	];

	let map,
		locations = [],
		markers,
		markerCluster,
		mainCoord = [61.314687, 71.235451],
		gmarkers = [],
		countObjects = declOfNum(['объект', 'объекта', 'объектов'])

	let clusterStyles = [{
			textSize: 10,
			textColor: 'black',
			url: '/static/img/markers/m1.svg',
			height: 38,
			width: 16,
			anchor: [2, 0]
		},
		{
			textSize: 10,
			textColor: 'black',
			url: '/static/img/markers/m2.svg',
			height: 57,
			width: 23,
			anchor: [6, 0]
		},
		{
			textSize: 11,
			textColor: 'black',
			url: '/static/img/markers/m3.svg',
			height: 62,
			width: 26,
			anchor: [7, 0]
		},
		{
			textSize: 11,
			textColor: 'black',
			url: '/static/img/markers/m4.svg',
			height: 83,
			width: 33,
			anchor: [11, 0]
		},
		{
			textSize: 12,
			textColor: 'black',
			url: '/static/img/markers/m5.svg',
			height: 133,
			width: 50,
			anchor: [19, 0]
		}
	];

	function latLng2Point(latLng, map) {
		var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
		var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
		var scale = Math.pow(2, map.getZoom());
		var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
		return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
	}

	function point2LatLng(point, map) {
		var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
		var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
		var scale = Math.pow(2, map.getZoom());
		var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
		return map.getProjection().fromPointToLatLng(worldPoint);
	}

	let clusterInfoWindow,
		mcOptions = {
			gridSize: 50,
			styles: clusterStyles,
			maxZoom: 14,
			onMouseoverCluster: function(clusterIcon, event) {
				let count = parseInt(event.target.innerHTML),
					countW = countObjects(count),
					contentString = '<div class="map-info">' +
					`<div class="map-info__inner"><div>${count} ${countW} в этом регионе</div></div>` +
					'</div>';

				let info = new google.maps.MVCObject;

				let coord = latLng2Point(clusterIcon.center_, map);
				coord.y = coord.y - clusterIcon.height_ * 0.51;

				let coord2 = point2LatLng(coord, map);
				info.set('position', coord2);

				clusterInfoWindow = new InfoBubble({
					map: map,
					content: contentString,
					shadowStyle: 0,
					padding: 0,
					minWidth: 200,
					maxWidth: 250,
					minHeight: 40,
					maxHeight: 100,
					backgroundColor: 'rgb(255,255,255)',
					borderRadius: 2,
					arrowSize: 10,
					borderWidth: 1,
					borderColor: '#d2d1d1',
					disableAutoPan: true,
					hideCloseButton: true,
					arrowPosition: 50,
					backgroundClassName: 'map-info',
					arrowStyle: 0
				});

				clusterInfoWindow.close();
				clusterInfoWindow.open(objectMap, info);

				clusterIcon.triggerClusterClick = function() {
					var markerClusterer = this.cluster_.getMarkerClusterer();

					clusterInfoWindow.close();

					google.maps.event.trigger(markerClusterer, 'clusterclick', this.cluster_);

					if (markerClusterer.isZoomOnClick()) {
						this.map_.fitBounds(this.cluster_.getBounds());
					}
				};
			},
			onMouseoutCluster: function(clusterIcon, event) {
				clusterInfoWindow.close();
			}
		};



	function addMarker(marker) {
		let size = [15, 35];
		let image = {
			url: window.location.origin + '/static/img/svg/map-marker-clear.svg',
			scaledSize: new google.maps.Size(size[0], size[1]),
			origin: new google.maps.Point(0, 0)
		};

		let contentString = '<div class="map-info">' +
			`<div class="map-info__inner">${marker.title.trim()}</div>` +
			'</div>',
			infowindow = new InfoBubble({
				map: map,
				content: contentString,
				shadowStyle: 0,
				padding: 0,
				minWidth: 200,
				maxWidth: 320,
				minHeight: 52,
				maxHeight: 140,
				backgroundColor: 'rgb(255,255,255)',
				borderRadius: 2,
				arrowSize: 10,
				borderWidth: 1,
				borderColor: '#d2d1d1',
				disableAutoPan: true,
				hideCloseButton: true,
				arrowPosition: 50,
				backgroundClassName: 'map-info',
				arrowStyle: 0
			});

		let gmarker = new google.maps.Marker({
			id: marker.id,
			position: {
				lat: parseFloat(marker.coord[0]),
				lng: parseFloat(marker.coord[1])
			},
			service: marker.service,
			region: marker.region,
			year: marker.year,
			map: map,
			icon: image
		});

		gmarkers.push(gmarker);

		gmarker.addListener('click', function() {
			window.location.href = marker.link;
		});

		gmarker.addListener('mouseover', function(a, b) {
			infowindow.open(map, gmarker);
		});

		gmarker.addListener('mouseout', function() {
			infowindow.close();
		});
	}

	$.extend(Module, {
		init: function(params) {
			if (params.type === 'simple') {
				Module.initSimpleMap($('.js-map'));
			}

			if (params.type === 'object') {
				Module.initObjectsMap();
			}
		},
		initSimpleMap: function($maps) {
			let markerSize = [54, 58],
				image = {
					url: window.location.origin + '/static/img/svg/map-marker-black.svg',
					scaledSize: new google.maps.Size(markerSize[0], markerSize[1]),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(markerSize[0] * 0.20, markerSize[1] * 0.83)
				};

			$maps.each(function(index) {
				let $map = $(this),
					markerCoord = $map.data('marker-coord').split(','),
					mapInTab = $map.closest('.js-tabs-item.is-active').length;

				if ((!mapInTab && index !== 0) || $map.hasClass('initialized')) {
					return false;
				} else {
					$map.addClass('initialized');
				}

				let gMap = new google.maps.Map($map[0], {
					center: {
						lat: parseFloat(markerCoord[0]),
						lng: parseFloat(markerCoord[1])
					},
					zoom: 15,
					disableDoubleClickZoom: false,
					scrollwheel: false,
					disableDefaultUI: true,
					zoomControl: true,
					styles: mapStyle
				});

				let gmarker = new google.maps.Marker({
					position: {
						lat: parseFloat(markerCoord[0]),
						lng: parseFloat(markerCoord[1])
					},
					map: gMap,
					icon: image
				});
			});
		},
		initObjectsMap: function() {
			let mapElement = document.getElementById('objects-map');

			map = new google.maps.Map(mapElement, {
				center: {
					lat: mainCoord[0],
					lng: mainCoord[1]
				},
				zoom: 4,
				disableDoubleClickZoom: false,
				scrollwheel: false,
				disableDefaultUI: true,
				zoomControl: true,
				styles: mapStyle
			});

			objectMap = map;

			initObjectsActions();
		},
		createMarkers: function(array) {
			for (var i = 0; i < array.length; i++) {
				let location = {};
				location.lat = parseFloat(array[i].coord[0]);
				location.lng = parseFloat(array[i].coord[1]);
				locations.push(location);
				addMarker(array[i]);
			}

			markerCluster = new MarkerClusterer(objectMap, gmarkers, mcOptions);
		},
		filteringMarkers: function(categoryFilters) {
			let newMarkers = [];
			for (let i = 0; i < gmarkers.length; i++) {
				let marker = gmarkers[i];

				if ((marker.service.indexOf(categoryFilters[0]) !== -1 || categoryFilters[0] === 'all') &&
					(marker.region.indexOf(categoryFilters[1]) !== -1 || categoryFilters[1] === 'all') &&
					(marker.year === categoryFilters[2] || categoryFilters[2] === 'all')) {
					marker.setVisible(true);
					newMarkers.push(marker);
				} else {
					marker.setVisible(false);
				}
			}

			markerCluster.clearMarkers();
			markerCluster = new MarkerClusterer(objectMap, newMarkers, mcOptions);
		},
		refreshObjMap: function() {
			var latlng = new google.maps.LatLng(mainCoord[0], mainCoord[1]);

			if (objectMap) {
				google.maps.event.trigger(objectMap, 'resize');
				objectMap.setCenter(latlng);
			}
		}
	});

}(window.GoogleMap = window.GoogleMap || {}, $));
