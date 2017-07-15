var setSong = function(songNumber) {

        if (currentSoundFile) {
            currentSoundFile.stop();
        }

        currentlyPlayingSongNumber = parseInt(songNumber);
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
              formats: ['mp3'],
              preload: true
        });

        setVolume(currentVolume);
};

        var seek = function(time) {
            if (currentSoundFile) {
                currentSoundFile.setTime(time);
            }
        }

        var setVolume = function(volume) {
            if (currentSoundFile) {
                currentSoundFile.setVolume(volume);
            }
        };

var getSongNumberCell = function(number) {
        return $('song-item-number[data-song-number="' + number + '"]');

};

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
                  // Revert to song number for currently playing song because user started playing new song.
                  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

                  currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
                  currentlyPlayingCell.html(currentlyPlayingSongNumber);
              }

               if (currentlyPlayingSongNumber !== songNumber) {
                   // Switch from Play -> Pause button to indicate new song is playing.
                   setSong(songNumber);
                   currentSoundFile.play();
                   $(this).html(pauseButtonTemplate);

                   var $volumeFill = $('.volume .fill');
                   var $volumeThumb = $('.volume .thumb');
                   $volumeFill.width(currentVolume + '%');
                   $volumeThumb.css({left: currentVolume + '%'});

                   updatePlayerBarSong();
               } else if (currentlyPlayingSongNumber === songNumber) {

                          if (currentSoundFile.isPaused()) {
                              $(this).html(pauseButtonTemplate);
                              $('.main-controls .play-pause').html(playerBarPauseButton);
                              currentSoundFile.play();
                          } else {
                              $(this).html(playButtonTemplate);
                              $('.main-controls .play-pause').html(playerBarPlayButton);
                              currentSoundFile.pause();
                          }

               }

};




/*Why use 'data-song-number' here and '.data-song-number' down below in the Hover function??*/
        var onHover = function(event) {
            var songNumberCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('data-song-number'));

            if (songNumber !== setSong) {
                songNumberCell.html(playButtonTemplate)
            }
        };

        var offHover = function(event) {
            var songNumberCell = $(this).find('.song-item-number');
            var songNumber = parseInt(songNumberCell.attr('.data-song-number'));

            if (songNumber !== setSong) {
                songNumberCell.html(songNumber);
            }

            console.log("songNumber type is " + typeof songNumber + "\n and setSong type is " + typeof setSong);
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

        $albumSongList.empty();


        for (var i = 0; i < album.songs.length; i++) {
          var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
           $albumSongList.append($newRow);
        }
    };

var updateSeekBarWhileSongPlays = function() {
        if (currentSoundFile) {
            currentSoundFile.bind('timeupdate', function(event) {

                var seekBarFillRatio = this.getTime() / this.getDuration();
                var $seekBar = $('.seek-control .seek-bar');

                updateSeekPercentage($seekBar, seekBarFillRatio);
            });
        }

};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
        var offsetXPercent = seekBarFillRatio * 100;

        offsetXPercent = Math.max(0, offsetXPercent);
        offsetXPercent = Math.min(100, offsetXPercent);

        var percentageString = offsetXPercent + '%';
        $seekBar.find('.fill').width(percentageString);
        $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
        var $seekBars = $('.player-bar .seek-bar');

        $seekBars.click(function(event) {
            var offsetX = event.pageX - $(this).offset().left;
            var barWidth = $(this).width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
            setVolume(seekBarFillRatio * 100);
        }

            updateSeekPercentage($(this), seekBarFillRatio);
        });

        $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();

         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;

             if ($seekBar.parent().attr('class') == 'seek-control') {
               seek(seekBarFillRatio * currentSoundFile.getDuration());
             } else {
                 setVolume(seekBarFillRatio);
             }

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });

         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
};

var trackIndex = function(album, song) {
        return album.songs.indexOf(song);

};


var nextSong = function() {
        var currentSongIndex = trackIndex(currentAlbum, setSong);
        //Note that we're incrementing the song here
        currentSongIndex++;

        if (currentSongIndex >= currentAlbum.songs.length) {
            currentSongIndex = 0;
        }

        //Save the last song number before changing it
        var lastSongNumber = parseInt(setSong);

        //Set a new current song
        setSong = currentAlbum.songs[currentSongIndex];
        setSong = currentSongIndex + 1;
        currentSoundFile.play();

        //Update the player bar info
        updatePlayerBarSong();

        var $nextSongNumberCell = $('.song-item-number[data-song-number="' + setSong + '"]');
        var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

        $nextSongNumberCell.html(pauseButtonTemplate);
        $lastSongNumberCell.html(lastSongNumber);

};


var previousSong = function() {
        var currentSongIndex = trackIndex(currentAlbum, setSong);
        // Note that we're _decrementing_ the index here
        currentSongIndex--;

        if (currentSongIndex < 0) {
            currentSongIndex = currentAlbum.songs.length - 1;
        }

        // Save the last song number before changing it
        var lastSongNumber = parseInt(setSong);

        // Set a new current song
        setSong(currentSongIndex);
        currentSoundFile.play();


        // Update the Player Bar information
        updatePlayerBarSong();

        $('.main-controls .play-pause').html(playerBarPauseButton);

        var $previousSongNumberCell = $('.song-item-number[data-song-number="' + setSong + '"]');
        var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

        $previousSongNumberCell.html(pauseButtonTemplate);
        $lastSongNumberCell.html(lastSongNumber);
};


var updatePlayerBarSong = function() {
          $('.currently-playing .song-name').text(setSong.title);
          $('.currently-playing .artist-name').text(currentAlbum.artist);
          $('.currently-playing .artist-song-mobile').text(setSong.title + " - " + currentAlbum.artist);

          $('.main-controls .play-pause').html(playerBarPauseButton);


};
          var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
          var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
          var playerBarPlayButton = '<span class="ion-play"></span>';
          var playerBarPauseButton = '<span class="ion-pause"></span>';

          // Store state of playing songs
          var currentlyPlayingSong = null;
          var currentAlbum = null;          //Why the null values?
          var currentSoundFile = null;
          var setSong = null;
          var setSong = null;
          var currentVolume = 80;

          var $previousButton = $('.main-controls .previous');
          var $nextButton = $('.main-controls .next');
          var $playPause = $('.main-controls .play-pause');


$(document).ready(function() {
        setCurrentAlbum(albumPicasso);
        setupSeekBars();
        $previousButton.click(previousSong);
        $nextButton.click(nextSong);
        $playPause.click(togglePlayFromPlayerBar);

});

/*
    var albums = [albumPicasso, albumFunk, albumMarconi];
    var index = 1;
    albumImage.addEventListener("click", function(event){
      setCurrentAlbum(albums[index]);
      index++;
      if (index == albums.length) {
        index = 0;
      }
    });
    */
/*
Write a function so that users can play and pause a song from the bar, as shown in the demo above.
The function should be named togglePlayFromPlayerBar(), take no arguments, and have the following behavior:
If a song is paused and the play button is clicked in the player bar, it will
Change the song number cell from a play button to a pause button
Change the HTML of the player bar's play button to a pause button
Play the song
If the song is playing (so a current sound file exist), and the pause button is clicked
Change the song number cell from a pause button to a play button
Change the HTML of the player bar's pause button to a play button
Pause the song

*/

function togglePlayFromPlayerBar() {
      if (currentSoundFile.isPaused()) {
              getSongNumberCell(currentSongIndex).html(pauseButtonTemplate);
              $playPause.html(pauseButtonTemplate);
              currentSoundFile.play();

      } else {
              getSongNumberCell(currentSongIndex).html(playButtonTemplate);
              $playPause.html(playButtonTemplate);
              currentSoundFile.pause();
      }


}
