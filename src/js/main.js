import { data } from "../data/data.js";

const songs = document.querySelectorAll('.song');
const playButton = document.querySelectorAll('.song__button-play');
const pauseButton = document.querySelectorAll('.song__button-pause');

let soundList;
let currentPlayback = {};
  
soundList = createSoundList();

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

  songs[songID].style.backgroundColor = '#ccc';

  soundList[songID].play();
}

function pause(songID) {
  playButton[songID].classList.remove('display-none');
  pauseButton[songID].classList.add('display-none');

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

function main() {
  let currentSong;

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
          pauseButton[currentSong.songID].classList.add('display-none');
          playButton[currentSong.songID].classList.remove('display-none');

          stop(currentSong.songID);
          play(song.dataset.id);
        }
      }
    })
  });
}

main();
