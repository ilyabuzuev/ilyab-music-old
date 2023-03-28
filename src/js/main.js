import { data } from "../data/data.js";

const songsList = document.getElementById('songsList');

let songs;
let dataSongs;
let playButton;
let pauseButton;
let albumPlayButton;
let albumPauseButton;
let playerPlayButton;
let playerPauseButton;
let playerPrevButton;
let playerNextButton;
let soundList;
let songDuration;
let durationSlider;
let currentSong;
let targetSong;
let isPlaying;

function formatSongTitle(song) {
  let formatedString = '';

  formatedString = `${(song.author).toLowerCase()}-${(song.title).toLowerCase()}`;
  formatedString = formatedString.replaceAll(' ', '_');
  
  return formatedString;
}

function renderSongs() {
  dataSongs = data.songList;

  dataSongs.forEach((song, index) => {
    songsList.innerHTML += `
      <li class="songs__item song" data-song-title=${formatSongTitle(song)} data-id=${index}>
        <div class="song__left">
          <div class="song__box">
            <img class="song__cover" src=${song.cover} alt=${song.author, "-", song.title}>
            <button class="song__button song__button-play button-reset">
              <svg class="song__play-icon" width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27 14.2679C28.3333 15.0377 28.3333 16.9623 27 17.7321L3 31.5885C1.66667 32.3583 0 31.396 0 29.8564V2.14359C0 0.603993 1.66667 -0.358258 3 0.411542L27 14.2679Z" fill="#333333"/>
              </svg>                        
            </button>
            <button class="song__button song__button-pause button-reset display-none">
              <svg class="song__pause-icon" width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="11.4074" height="32" rx="2" fill="#333333"/>
                <rect x="16.5927" width="11.4074" height="32" rx="2" fill="#333333"/>
              </svg>                    
            </button>
          </div>
          <div class="song__name">
            <h3 class="song__title">${song.title}</h3>
            <h4 class="song__author">${song.author}</h4>
          </div>
        </div>
        <div class="song__right">
          <p class="song__duration">${song.duration}</p>
        </div>
      </li>
    `   
  });
}

function createSoundList() {
  let soundList = [];

  songs.forEach(song => {
    soundList.push(new Audio(`./src/audio/${song.dataset.songTitle}.mp3`));
  });

  return soundList;
}

function songDurationUpdate(songID) {
  soundList[songID].addEventListener('timeupdate', () => {
    let currentSongTime = Math.floor(soundList[songID].currentTime);
    let seconds = currentSongTime % 60;
    let minutes = Math.floor(currentSongTime / 60);

    if (currentSongTime < 10) {
      songDuration[songID].innerHTML = `0:0${seconds}`;
    } else if (currentSongTime < 60) {
      songDuration[songID].innerHTML = `0:${seconds}`;
    } else {
      if (currentSongTime % 60 < 10) {
        songDuration[songID].innerHTML = `${minutes}:0${seconds}`;
      } else {
        songDuration[songID].innerHTML = `${minutes}:${seconds}`;
      }
    }

    sliderDurationUpdate(soundList[songID]);
  });
}

function songEndHandler(songID) {
  soundList[songID].addEventListener('ended', () => {
    next(songID);
  });
}

function play(songID) {
  soundList[songID].play();

  songs[songID].style.backgroundColor = '#ccc';

  isPlaying = true;

  currentSong = songID;

  setAlbumButtonIcon();
  songDurationUpdate(songID);
  songEndHandler(songID);
  setPlayerSongData(songID);
}

function pause(songID) {
  soundList[songID].pause();

  isPlaying = false;

  setAlbumButtonIcon();
}

function stop(songID) {
  soundList[songID].pause();
  soundList[songID].currentTime = 0;

  playButton[songID].classList.remove('display-none');
  pauseButton[songID].classList.add('display-none');

  songs[songID].style = '';

  setTimeout(() => {
    songDuration[songID].innerHTML = dataSongs[songID].duration;
  }, 10);
}

function next(songID) {
  songs[songID].style = '';

  +songID == soundList.length - 1 ? songID = 0 : songID = +songID + 1;

  stop(currentSong);
  play(songID);
}

function prev(songID) {
  songs[songID].style = '';

  +songID == 0 ? songID = soundList.length - 1 : songID = +songID - 1;

  stop(currentSong);
  play(songID);
}

function sliderDurationUpdate(currentSong) {
  let offset;

  offset = (currentSong.currentTime / currentSong.duration) * 100;

  durationSlider.style.width = offset + '%';
}

function albumButtonsClickHandler() {
  albumPlayButton.addEventListener('click', () => {
    !currentSong ? play(0) : play(currentSong);
  });

  albumPauseButton.addEventListener('click', () => {
    pause(currentSong);
  });
}

function songClickHandler() {
  soundList = createSoundList();

  songs.forEach(song => {
    song.addEventListener('click', () => {
      targetSong = song.dataset.id;

      if (currentSong == undefined) {
        play(targetSong);
      } else {
        if (currentSong == targetSong) {
          if (soundList[targetSong].paused) {
            play(targetSong);
          } else {
            pause(targetSong);
          }
        } else {
          stop(currentSong);
          play(targetSong);
        }
      }
    });
  });
}

function playerButtonsClickHandler() {
  playerPlayButton.addEventListener('click', () => {
    !currentSong ? play(0) : play(currentSong);
  });

  playerPauseButton.addEventListener('click', () => {
    pause(currentSong);
  });

  playerPrevButton.addEventListener('click', () => {
    prev(currentSong);
  });

  playerNextButton.addEventListener('click', () => {
    next(currentSong);
  });
}

function setPlayerSongData(songID) {
  const playbackTitle = document.querySelector('.playback__title');
  const playbackArtist = document.querySelector('.playback__artist');
  const playerDuration = document.querySelector('.player__duration');

  playbackTitle.textContent = dataSongs[songID].title;
  playbackArtist.textContent = dataSongs[songID].author;
  playerDuration.textContent = dataSongs[songID].duration;

  playbackTitle.dataset.songTitle = dataSongs[songID].title;
}

function setAlbumButtonIcon() {
  if (isPlaying) {
    playButton[currentSong].classList.add('display-none');
    albumPlayButton.classList.add('display-none');
    playerPlayButton.classList.add('display-none');

    pauseButton[currentSong].classList.remove('display-none');
    albumPauseButton.classList.remove('display-none');
    playerPauseButton.classList.remove('display-none');
  } else {
    playButton[currentSong].classList.remove('display-none');
    albumPlayButton.classList.remove('display-none');
    playerPlayButton.classList.remove('display-none');

    pauseButton[currentSong].classList.add('display-none');
    albumPauseButton.classList.add('display-none');
    playerPauseButton.classList.add('display-none');
  }
}

function main() {
  renderSongs();

  songs = document.querySelectorAll('.song');
  playButton = document.querySelectorAll('.song__button-play');
  pauseButton = document.querySelectorAll('.song__button-pause');
  songDuration = document.querySelectorAll('.song__duration');
  durationSlider = document.getElementById('durationSlider');
  albumPlayButton = document.getElementById('albumPlayButton');
  albumPauseButton = document.getElementById('albumPauseButton');
  playerPlayButton = document.getElementById('playerPlayButton');
  playerPauseButton = document.getElementById('playerPauseButton');
  playerPrevButton = document.getElementById('playerPrevButton');
  playerNextButton = document.getElementById('playerNextButton');

  songClickHandler();
  albumButtonsClickHandler();
  playerButtonsClickHandler();
}

main();
