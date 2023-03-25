import { data } from "../data/data.js";

const songsList = document.getElementById('songsList');

let songs;
let playButton;
let pauseButton;
let albumPlayButton;
let albumPauseButton;
let soundList;
let currentSong;
let currentPlayback = {};

function formatSongTitle(song) {
  let formatedString = '';

  formatedString = `${(song.author).toLowerCase()}-${(song.title).toLowerCase()}`;
  formatedString = formatedString.replaceAll(' ', '_');
  
  return formatedString;
}

function renderSongs() {
  let dataSongs;

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

function play(songID) {
  currentPlayback.songID = songID;

  playButton[songID].classList.add('display-none');
  pauseButton[songID].classList.remove('display-none');

  albumPlayButton.classList.add('display-none');
  albumPauseButton.classList.remove('display-none');

  songs[songID].style.backgroundColor = '#ccc';

  soundList[songID].play();
}

function pause(songID) {
  playButton[songID].classList.remove('display-none');
  pauseButton[songID].classList.add('display-none');

  albumPlayButton.classList.remove('display-none');
  albumPauseButton.classList.add('display-none');

  soundList[songID].pause();
}

function stop(songID) {
  soundList[songID].pause();
  soundList[songID].currentTime = 0;

  songs[currentPlayback.songID].style = '';
}

function checkSongPlayback() {
  return currentPlayback;
}

function listenAlbumButtonsClickHandler() {
  albumPlayButton.addEventListener('click', () => {
    if (currentPlayback.songID == undefined) {
      play(0);
    } else {
      play(currentPlayback.songID);
    }
  });

  albumPauseButton.addEventListener('click', () => {
    pause(currentPlayback.songID);
  });
}

function songClickHandler() {
  soundList = createSoundList();

  songs.forEach(song => {
    song.addEventListener('click', () => {
      currentSong = checkSongPlayback();

      if (currentSong.songID === undefined) {
        play(song.dataset.id);
      } else {
        if (+currentSong.songID === +song.dataset.id) {
          if (soundList[song.dataset.id].paused) {
            play(song.dataset.id);
          } else {
            pause(song.dataset.id);
          }
        } else {
          stop(currentSong.songID);
          play(song.dataset.id);
        }
      }
    });
  });
}

function main() {
  renderSongs();

  songs = document.querySelectorAll('.song');
  playButton = document.querySelectorAll('.song__button-play');
  pauseButton = document.querySelectorAll('.song__button-pause');
  albumPlayButton = document.getElementById('albumPlayButton');
  albumPauseButton = document.getElementById('albumPauseButton');

  listenAlbumButtonsClickHandler();

  songClickHandler();
}

main();
