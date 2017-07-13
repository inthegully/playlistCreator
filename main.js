$(document).ready(function() {

    function login(){
      var clientId = '1a3e921e1c1c47a0be21759f53566991';
      var responseType = '&response_type=token';
      var redirectURI = 'http://dimpledelltestsite.site44.com';

      var URL = 'https://accounts.spotify.com/authorize?client_id=' +
                clientId +
                responseType +
                '&redirect_uri=' +
                redirectURI;

      return window.location.replace(URL);
    }

    if(window.location.href.indexOf("access_token") == -1) {
      login();
    }else{
      var accessToken = getHashValue("access_token");

      function getHashValue(key){
        var matches = location.hash.match(new RegExp(key+"=([^&]*)"));
        return matches ? matches[1] : null;
      }
    }


    $('input').keypress(function(e) {
        if (e.which == 13) {
            var artistName = $('input').val();
            createPlaylist(artistName);

            $('input').val('');
            $('.allSongs').empty();
        }
    });

    function createPlaylist(artistName) {
        getArtist(artistName);

        function getArtist(artistName) {
            $.ajax({
                method: "GET",
                url: "https://api.spotify.com/v1/search?q=" + artistName + "&type=artist",
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                success: function(response) {
                    var artistId = response.artists.items[0].id
                    getRelatedArtists(artistId);
                }
            });
        }

        function getRelatedArtists(artistId) {
            $.ajax({
                method: "GET",
                url: "https://api.spotify.com/v1/artists/" + artistId + "/related-artists",
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                success: function(response) {
                    getTracks(response);
                }
            });
        }

        function getTracks(related) {
            for (var i = 0; i < 10; i++) {
                var relatedId = related.artists[i].id
                $.ajax({
                    method: "GET",
                    url: "https://api.spotify.com/v1/artists/" + relatedId + "/top-tracks?country=US",
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    },
                    success: function(response) {
                        postTrack(response);
                    }
                });
            }
        }

        function postTrack(relatedArtist) {
            var topTrack = relatedArtist.tracks[0]
            $('.allSongs').append("<div class='playlist'><a href=" + topTrack.uri + " class='song'>" + topTrack.name + " - " + topTrack.artists[0].name + "</a></div>")
        }
    }
});
