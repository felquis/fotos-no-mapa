var accessToken = '146209834.9dd7e8f.c1c0737c0e0946438059cfeeeaa7b322';
var clientID = '9dd7e8f8c78c45f78f3c912ef09c8553';
var array;

var app = {

	instagramLocationSearch : function (lat, lng, map) {
		$.ajax({
			url : 'https://api.instagram.com/v1/locations/search?lat='+lat+'&lng='+lng+'&access_token='+accessToken+'',
			dataType : 'jsonp',
			success : function (res) {
				$.each(res.data, function (i, local) {
					map.addMarker({
						lat: local.latitude,
						lng: local.longitude,
						title: local.name,
						infoWindow: {
							content: '<div class="l'+local.id+(new Date()).getTime()+' marker" data-id="'+local.id+'" data-class=".l'+local.id+(new Date()).getTime()+'">'+local.name+'</div>'
						},
						click: function(marker) {

							// Encontra o elemento do maker e o seleciona
							var j$ = $(this.infoWindow.content);
							var $marker = $(j$.attr('data-class'));

							app.whenMarkerReady(j$.attr('data-class'), app.onClickInMarker);
						}
					});
				});
			},
			error : function (error) {
				console.log(error, 'Houve um erro, location search instagram');
			}
		});
	},

	whenMarkerReady : function (classe, callback) {
		var $select = $(classe);
		var time = setInterval(function () {
			if ($select.length === 0) {
				$select = $(classe);
			} else {
				callback($select);
				clearInterval(time);
			}
		}, 50);
	},

	onClickInMarker : function ($marker) {
		// Diz que esta carregando as fotos
		$marker.append('<span class="loading"><br>Carregando fotos!</span>');

		$.ajax({
			url: 'https://api.instagram.com/v1/locations/'+$marker.attr('data-id')+'/media/recent?access_token='+accessToken,
			dataType: 'jsonp',
			success : function (res) {

				var fotos = '<br>';

				$.each(res.data, function (i, foto) {
					if (i < 4) {
						fotos += '<a href="'+foto.link+'" target="_blank" title="Foto de '+foto.user.full_name+'"><img src="'+foto.images.thumbnail.url+'" width="40" height="40" alt=""></a>';
					}
				});

				$marker.find('.loading').fadeOut(function () {
					$(this).remove();
				});

				$marker.append(fotos);
			}
		});
	},

	gmapsGetPosition : function () {
		GMaps.geolocate({
		  success: function(position) {
		  	var lat = position.coords.latitude;
		  	var lng = position.coords.longitude;

		  	var map = new GMaps({
			  div: '#map',
			  lat: lat,
			  lng: lng,
			  zoom : 18
			});

		    map.setCenter(lat, lng);

		    map.drawOverlay({
			  lat: lat,
			  lng: lng,
			  content: '<div class="here">You\'re here</div>'
			});

		    app.instagramLocationSearch(lat, lng, map);
		  },
		  error: function(error) {
		    $('#map').html('Geolocation failed: '+error.message);
		  },
		  not_supported: function() {
		    $('#map').html("Your browser does not support geolocation");
		  },
		  always: function() {
		    $('#map').html("Done!");
		  }
		});
	}
}

// Script
$(function () {
	app.gmapsGetPosition();
});