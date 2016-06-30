$(document).ready(function() {

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
