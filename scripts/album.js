var createSongRow = function(songNumber, songName, songLength) {
        var template =
           '<tr class="album-view-song-item">'
         + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
         + '  <td class="song-item-title">' + songName + '</td>'
         + '  <td class="song-item-duration">' + songLength + '</td>'
         + '</tr>'
         ;

        var $row = $(template);

        var clickHandler = function() {
                var songNumber = parseInt($(this).attr('data-song-number'));

                if (currentlyPlayingSongNumber !== null) {
                    //Revert to song number for currently playing song bc user started playing new song
                    var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
                    currentlyPlayingCell.html(currentlyPlayingSongNumber);
                }

                if (currentlyPlayingSongNumber !== songNumber) {
                    // Switch from Play -> Pause button to indicate new song is playing.
                    $(this).html(pauseButtonTemplate);
                    currentlyPlayingSongNumber = songNumber;
                    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
                    updatePlayerBarSong();
                } else if (currentlyPlayingSongNumber === songNumber) {
                    //Switch from Pause -> Play button to pause currently playing songNumber
                    $(this).html(playButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPlayButton);  //Why are these defined down below and then called up here?
                    currentlyPlayingSongNumber = null;
                    currentSongFromAlbum = null;  //What is the purpose of this?
                }
        };

/*Why use 'data-song-number' here and '.data-song-number' down below in the Hover function??*/
        var onHover = function(event) {
            var songNumberCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('data-song-number'));

            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(playButtonTemplate)
            }
        };

        var offHover = function(event) {
            var songNumberCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('.data-song-number'));

            if (songNumber !== currentlyPlayingSongNumber) {
                songNumberCell.html(songNumber);
            }

            console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        };

        $row.find('.song-item-number').click(clickHandler);
        $row.hover(onHover, offHover);

        return $row;
};

var setCurrentAlbum = function(album) {

        currentAlbum = album;
        var $albumTitle = $('.album-view-title');
        var $albumArtist = $('.album-view-artist');
        var $albumReleaseInfo = $('.album-view-release-info');
        var $albumImage = $('.album-cover-art');
        var $albumSongList = $('.album-view-song-list');


        $albumTitle.text(album.title);
        $albumArtist.text(album.artist);
        $albumReleaseInfo.text(album.year + ' ' + album.label);
        $albumImage.attr('src', album.albumArtUrl);

        $album.SongList.empty();

        // #4
        for (var i = 0; i < album.songs.length; i++) {
          var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
           $albumSongList.append($newRow);
        }
    };

var trackIndex = function(album, song) {
        return album.songs.indexOf(song);

};


var nextSong = function() {
        var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        //Note that we're incrementing the song here
        currentSongIndex++;

        if (currentSongIndex >= currentAlbum.songs.length) {
            currentSongIndex = 0;
        }

        //Save the last song number before changing it
        var lastSongNumber = parseInt(currentlyPlayingSongNumber);

        //Set a new current song
        currentlyPlayingSongNumber = currentSongIndex + 1;
        currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

        //Update the player bar info
        updatePlayerBarSong();

        var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
        var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

        $nextSongNumberCell.html(pauseButtonTemplate);
        $lastSongNumberCell.html(lastSongNumber);

};


var previousSong = function() {
        var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        // Note that we're _decrementing_ the index here
        currentSongIndex--;

        if (currentSongIndex < 0) {
            currentSongIndex = currentAlbum.songs.length - 1;
        }

        // Save the last song number before changing it
        var lastSongNumber = parseInt(currentlyPlayingSongNumber);

        // Set a new current song
        currentlyPlayingSongNumber = currentSongIndex + 1;
        currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

        // Update the Player Bar information
        updatePlayerBarSong();

        $('.main-controls .play-pause').html(playerBarPauseButton);

        var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
        var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

        $previousSongNumberCell.html(pauseButtonTemplate);
        $lastSongNumberCell.html(lastSongNumber);
};


var updatePlayerBarSong = function() {
          $('.currently-playing .song-name').text(currentSongFromAlbum.title);
          $('.currently-playing .artist-name').text(currentAlbum.artist);
          $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

          $('.main-controls .play-pause').html(playerBarPauseButton);


};
          var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
          var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
          var playerBarPlayButton = <span class="ion-play"></span>
          var playerBarPauseButton = <span class="ion-pause"></span>

          // Store state of playing songs
          var currentlyPlayingSong = null;
          var currentAlbum = null;          //Why the null values?
          var currentlyPlayingSongNumber = null;
          var currentSongFromAlbum = null;

          var $previousButton = $('.main-controls .previous');
          var $nextButton = $('.main-controls .next');

$(document).ready(function() {
        setCurrentAlbum(albumPicasso);
        $previousButton.click(previousSong);
        $nextButton.click(nextSong);

});


    var albums = [albumPicasso, albumFunk, albumMarconi];
    var index = 1;
    albumImage.addEventListener("click", function(event){
      setCurrentAlbum(albums[index]);
      index++;
      if (index == albums.length) {
        index = 0;
      }
    });
