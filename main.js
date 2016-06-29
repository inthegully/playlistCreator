$(document).ready(function() {
    $('input').keypress(function(e) {
        if (e.which == 13) {
            var artistName = $('input').val();
            var artistId;
            getArtist();

            function getArtist() {
                $.ajax({
                    method: "GET",
                    url: "https://api.spotify.com/v1/search?q=" + artistName + "&type=artist",
                    success: function(response) {
                        artistId = response.artists.items[0].id
                        getRelatedArtists();
                    }
                });
            }
            function getRelatedArtists(){
              $.ajax({
                method: "GET",
                url: "https://api.spotify.com/v1/artists/" + artistId + "/related-artists",
                success: function(response) {
                    for (var i = 0; i < 10; i++) {
                      var relatedId = response.artists[i].id
                      $.ajax({
                        method: "GET",
                        url: "https://api.spotify.com/v1/artists/" + relatedId + "/top-tracks?country=US",
                        success: function(response) {
                          var topTrack = response.tracks[0]
                          $('.allSongs').append("<div class='playlist'><a href=" + topTrack.uri + " class='song'>" + topTrack.name + " - " + topTrack.artists[0].name + "</a></div>")
                        }
                      });
                    }
                }
              });
            }
            $('input').val('');
            $('.allSongs').empty();
        }
    });
});
