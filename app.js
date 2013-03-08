var accessToken = '146209834.9dd7e8f.c1c0737c0e0946438059cfeeeaa7b322';
var clientID = '9dd7e8f8c78c45f78f3c912ef09c8553';
var array;

// Script
$(function () {
	$('#form').on('submit', function (e) {
		e.preventDefault();

		var val = $('#input-search').val().replace(/([^\w]|\d)+/g, '');

		$('#result').html('Buscando!');
		$('#input-search').val('#'+val);

		var url = 'https://api.instagram.com/v1/tags/'+ val +'/media/recent/?access_token='+ accessToken;

		$.ajax({
			url : url,
			dataType : 'jsonp',
			success : function (res) {
				array = res;

				console.log(res);

				$('#result').html('Criando HTML!');

				var html = $('<ul>'),
					str;

				if (res.meta.code != 200) {

					$('#result').html('Humm encontrei nenhuma foto :/ Tente outra hashtag!');

					return false;
				}

				if (res.data.length == 0) {

					$('#result').html('Não encontramos nenhuma foto com #'+val+ ' :( Tente outra hashtag :D');

					return false;
				}

				$.each(res.data, function (i, item) {
					str = $('<li>');
						str.append(item.user.full_name);
						str.append('<br>');

						str.append(item.likes.count +' likes');
						str.append('<br>');

						str.append('Filtro: ' + item.filter);
						str.append('<br>');

						str.append($('<img>').attr({
							src : item.images.thumbnail.url,
							width : item.images.thumbnail.width,
							height : item.images.thumbnail.height
						}));

					html.append(str);
				});

				$('#result').html(html);
			},
			error : function (error) {
				$('#result').html('Não encontramos nenhuma foto com #'+val+', tente outra hashtag');
			},

			complete: function(xhr, data) {
		        if (xhr.status == 0) {
					$('#result').html('Não encontramos nenhuma foto com #'+val+', tente outra hashtag');
		        }
		    }
		});
	});
});