import { data } from "../data/data.js";

const songsList = document.getElementById('songsList');

let songs;
let player;
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
let durationBox;
let currentSong;
let isPlaying;
let playbackTitle;
let playbackArtist;
let playerDuration;
let songAnimation;
let songAnimationInterval;
let songCover;
let songVolume;
let volumeValue;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatSongTitle(song) {
  const [title, artist] = [song.title, song.artist];  

  let formatedString = '';

  formatedString = `${(artist).toLowerCase()}-${(title).toLowerCase()}`;
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
            <img class="song__cover" src=${song.cover} alt=${song.artist, "-", song.title}>
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
            <div class="song__animation animation-song display-none" id="songAnimation">
              <div class="animation-song__item animation-song__item-1"></div>
              <div class="animation-song__item animation-song__item-2"></div>
              <div class="animation-song__item animation-song__item-3"></div>
              <div class="animation-song__item animation-song__item-4"></div>
            </div>
          </div>
          <div class="song__name">
            <h3 class="song__title">${song.title}</h3>
            <h4 class="song__author">${song.artist}</h4>
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

function timeConversion(currentTime) {
  let currentSongTime = Math.floor(currentTime);
  let seconds = currentSongTime % 60;
  let minutes = Math.floor(currentSongTime / 60);
  let convertedTime;

  if (currentSongTime < 10) {
    convertedTime = `0:0${seconds}`;
  } else if (currentSongTime < 60) {
    convertedTime = `0:${seconds}`;
  } else {
    if (currentSongTime % 60 < 10) {
      convertedTime = `${minutes}:0${seconds}`;
    } else {
      convertedTime = `${minutes}:${seconds}`;
    }
  }

  return convertedTime;
}

function setCurrentSongDuration(duration) {
  songDuration[currentSong].textContent = duration;
  playerDuration.textContent = duration;
}

function songDurationUpdate() {
  let convertedTime;

  soundList[currentSong].addEventListener('timeupdate', () => {
    convertedTime = timeConversion(soundList[currentSong].currentTime);

    setCurrentSongDuration(convertedTime);
    sliderDurationUpdate(soundList[currentSong]);
  });
}

function songEndHandler(songID) {
  soundList[songID].addEventListener('ended', () => {
    next(songID);
  });
}

function play(songID) {
  soundList[songID].play();

  isPlaying = true;

  currentSong = songID;

  songs[songID].style.backgroundColor = '#ccc';

  player.classList.remove('visually-hidden');

  startSongAnimation();
  setAlbumButtonIcon();
  songDurationUpdate();
  songEndHandler(songID);
  setPlayerSongData(songID);
}

function pause(songID) {
  soundList[songID].pause();

  isPlaying = false;

  setAlbumButtonIcon();
  stopSongAnimation();
}

function stop(songID) {
  soundList[songID].pause();
  soundList[songID].currentTime = 0;

  playButton[songID].classList.remove('display-none');
  pauseButton[songID].classList.add('display-none');

  songAnimation[songID].classList.add('display-none');

  songCover[currentSong].style = '';

  songs[songID].style = '';

  setTimeout(() => {
    songDuration[songID].innerHTML = dataSongs[songID].duration;
  }, 10);

  stopSongAnimation();
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
  let targetSong;

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
  playbackTitle.textContent = dataSongs[songID].title;
  playbackArtist.textContent = dataSongs[songID].artist;

  playbackTitle.dataset.songTitle = dataSongs[songID].title;

  // playbackTitle.addEventListener('mouseover', (e) => {
  //   setTimeout(() => {
  //     console.log(e);
  //   }, 500);
  // }); 
}

function setAlbumButtonIcon() {
  if (isPlaying) {
    playButton[currentSong].classList.add('display-none');
    albumPlayButton.classList.add('display-none');
    playerPlayButton.classList.add('display-none');

    pauseButton[currentSong].classList.remove('display-none');
    albumPauseButton.classList.remove('display-none');
    playerPauseButton.classList.remove('display-none');

    songAnimation[currentSong].classList.remove('display-none');

    songCover[currentSong].style.filter = 'brightness(0.3)';
  } else {
    playButton[currentSong].classList.remove('display-none');
    albumPlayButton.classList.remove('display-none');
    playerPlayButton.classList.remove('display-none');

    pauseButton[currentSong].classList.add('display-none');
    albumPauseButton.classList.add('display-none');
    playerPauseButton.classList.add('display-none');

    songAnimation[currentSong].classList.add('display-none');

    songCover[currentSong].style = '';
  }
}

function setCurrentSongTime() {
  let position;
  let defaultDurationBoxWidth;

  if (window.innerWidth > 1024) {
    defaultDurationBoxWidth = 300;
  } else if (window.innerWidth <= 1024 && window.innerWidth > 470) {
    defaultDurationBoxWidth = 200;
  } else {
    defaultDurationBoxWidth = 100;
  }

  durationBox.style.width = defaultDurationBoxWidth + 'px';  

  window.addEventListener('resize', (e) => {
    if (window.innerWidth > 1024) {
      defaultDurationBoxWidth = 300;
    } else if (window.innerWidth <= 1024 && window.innerWidth > 590) {
      defaultDurationBoxWidth = 200;
    } else {
      defaultDurationBoxWidth = 100;
    }

    durationBox.style.width = defaultDurationBoxWidth + 'px';
  });

  durationBox.addEventListener('click', (e) => {
    position = (soundList[currentSong].duration / defaultDurationBoxWidth);

    soundList[currentSong].currentTime = e.offsetX * position;
  });
}

function animateSong() {
  let randomNumber;

  Array.from(songAnimation[currentSong].children).forEach((bar, index) => {
    if (index == 0) {
      randomNumber = getRandomInt(70, 90);
    }

    if (index == 1) {
      randomNumber = getRandomInt(50, 75);
    }
    
    if (index == 2) {
      randomNumber = getRandomInt(40, 70);
    }

    if (index == 3) {
      randomNumber = getRandomInt(20, 60);
    }

    bar.style.height = randomNumber + '%';
  });
}

function startSongAnimation() {
  songAnimationInterval = setInterval(animateSong, 100);
}

function stopSongAnimation() {
  clearInterval(songAnimationInterval);
}

function setSongVolume() {
  let deafultVolume = 60;

  songVolume = localStorage.getItem('songVolume');

  if (songVolume == null) {
    localStorage.setItem('songVolume', deafultVolume);

    volumeValue.style.width = deafultVolume + '%';

    soundList.forEach(song => {
      song.volume = deafultVolume / 100;
    });
  } else {
    volumeValue.style.width = songVolume + '%';
  }

  setVolumeIcon();
}

function setVolumeIcon() {
  const volumeButton = document.getElementById('volumeButton');

  songVolume = localStorage.getItem('songVolume');

  soundList.forEach(song => {
    song.volume = songVolume / 100;
  });

  if (songVolume > 5 && songVolume < 40) {
    volumeButton.innerHTML = `
      <svg class="volume-player__icon volume-player__icon-low" width="53" height="41" viewBox="0 0 34 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.3747 13.2033H5.74987C4.75534 13.2033 3.80155 13.5984 3.09831 14.3016C2.39507 15.0049 2 15.9586 2 16.9532V24.4529C2 25.4474 2.39507 26.4012 3.09831 27.1045C3.80155 27.8077 4.75534 28.2028 5.74987 28.2028H11.3747V13.2033Z" stroke="#333" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.3746 28.2028L26.0366 38.7399C26.5798 39.1158 27.2127 39.3415 27.8712 39.3941C28.5297 39.4468 29.1904 39.3246 29.7865 39.0399C30.4329 38.7495 30.9839 38.2819 31.3754 37.6912C31.767 37.1005 31.9832 36.411 31.9989 35.7025V5.70357C32.0149 5.03017 31.8493 4.36488 31.5194 3.77761C31.1894 3.19035 30.7074 2.7028 30.124 2.36619C29.5279 2.08147 28.8672 1.95926 28.2087 2.01194C27.5502 2.06462 26.9173 2.29031 26.3741 2.66618L11.3746 13.2033" stroke="#333" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  } else if (songVolume >= 40 && songVolume < 80) {
    volumeButton.innerHTML = `
      <svg class="volume-player__icon volume-player__icon-medium" width="53" height="41" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.5216 13.3789H5.80863C4.79852 13.3789 3.82978 13.7802 3.11552 14.4944C2.40127 15.2087 2 16.1774 2 17.1875V24.8048C2 25.8149 2.40127 26.7837 3.11552 27.4979C3.82978 28.2122 4.79852 28.6134 5.80863 28.6134H11.5216V13.3789Z" stroke="black" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.5215 28.6134L26.4132 39.3156C26.965 39.6974 27.6078 39.9266 28.2766 39.9801C28.9454 40.0336 29.6165 39.9095 30.2219 39.6203C30.8785 39.3254 31.438 38.8504 31.8357 38.2505C32.2334 37.6506 32.453 36.9502 32.469 36.2306V5.76158C32.4853 5.07763 32.317 4.40191 31.9819 3.80544C31.6468 3.20897 31.1573 2.71378 30.5646 2.3719C29.9592 2.08272 29.2882 1.9586 28.6194 2.0121C27.9506 2.0656 27.3078 2.29483 26.756 2.67659L11.5215 13.3788" stroke="black" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M40.0862 15.2832C41.4102 16.8839 42.0893 18.9211 41.9905 20.9962C42.0893 23.0712 41.4102 25.1084 40.0862 26.7091" stroke="black" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  } else if (songVolume >= 80) {
    volumeButton.innerHTML = `
      <svg class="volume-player__icon volume-player__icon-high" width="53" height="41" viewBox="0 0 53 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.3984 13.2317H5.75937C4.76232 13.2317 3.80611 13.6278 3.10109 14.3328C2.39608 15.0378 2 15.994 2 16.9911V24.5098C2 25.5069 2.39608 26.4631 3.10109 27.1681C3.80611 27.8731 4.76232 28.2692 5.75937 28.2692H11.3984V13.2317Z" stroke="#333" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.3984 28.2692L26.0976 38.833C26.6422 39.2098 27.2767 39.4361 27.9368 39.4889C28.597 39.5417 29.2594 39.4192 29.8569 39.1338C30.505 38.8426 31.0574 38.3738 31.4499 37.7817C31.8425 37.1895 32.0592 36.4982 32.075 35.7879V5.71296C32.0911 5.03785 31.925 4.37087 31.5942 3.78212C31.2635 3.19337 30.7802 2.70458 30.1953 2.36712C29.5977 2.08168 28.9353 1.95916 28.2752 2.01197C27.615 2.06479 26.9805 2.29105 26.4359 2.66787L11.3984 13.2317" stroke="#333" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M47.1124 9.47235C49.7263 12.6324 51.0668 16.6541 50.8718 20.7505C50.8153 25.3933 49.5173 29.9364 47.1124 33.9083" stroke="#333" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M39.5938 15.1114C40.9007 16.6914 41.571 18.7022 41.4734 20.7504C41.571 22.7986 40.9007 24.8094 39.5938 26.3895" stroke="#333" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  } else {
    volumeButton.innerHTML = `
      <svg class="volume-player__icon volume-player__icon-mute" width="53" height="41" viewBox="0 0 52 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.2729 13.0817H5.70916C4.72543 13.0817 3.78199 13.4725 3.08639 14.1681C2.39079 14.8637 2 15.8071 2 16.7909V24.2092C2 25.1929 2.39079 26.1363 3.08639 26.8319C3.78199 27.5275 4.72543 27.9183 5.70916 27.9183H11.2729V13.0817Z" stroke="black" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.2728 27.9183L25.7756 38.3411C26.313 38.7128 26.939 38.9361 27.5903 38.9882C28.2416 39.0403 28.8952 38.9194 29.4848 38.6378C30.1242 38.3506 30.6692 37.888 31.0565 37.3038C31.4438 36.7195 31.6576 36.0374 31.6732 35.3366V5.66337C31.6891 4.99727 31.5252 4.33921 31.1989 3.75832C30.8725 3.17743 30.3957 2.69517 29.8186 2.36221C29.229 2.08058 28.5755 1.95971 27.9241 2.01181C27.2728 2.06392 26.6468 2.28716 26.1095 2.65895L11.2728 13.0817" stroke="black" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M50.219 14.9362L39.0916 26.0637" stroke="black" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M39.0916 14.9362L50.219 26.0637" stroke="black" stroke-width="2.85714" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
}

function showVolumeMenu() {
  const volumeButton = document.getElementById('volumeButton');
  const volumeMenu = document.getElementById('volumeMenu');

  volumeButton.addEventListener('click', () => {
    volumeMenu.classList.toggle('display-none');
  });
}

function updateSongVolume() {
  const volumeSlider = document.getElementById('volumeSlider');

  let targetValue;

  volumeSlider.addEventListener('click', (e) => {
    if (e.offsetX > 100) {
      targetValue = 100;
    } else if (e.offsetX < 5) {
      targetValue = 0;
    } else {
      targetValue = e.offsetX;
    }

    volumeValue.style.width = targetValue + '%';

    localStorage.setItem('songVolume', targetValue);

    soundList.forEach(song => {
      song.volume = songVolume / 100;
    });

    setVolumeIcon();
  });
}

function main() {
  renderSongs();

  songs = document.querySelectorAll('.song');
  player = document.getElementById('player');
  playButton = document.querySelectorAll('.song__button-play');
  pauseButton = document.querySelectorAll('.song__button-pause');
  songDuration = document.querySelectorAll('.song__duration');
  durationSlider = document.getElementById('durationSlider');
  durationBox = document.getElementById('durationBox');
  albumPlayButton = document.getElementById('albumPlayButton');
  albumPauseButton = document.getElementById('albumPauseButton');
  playerPlayButton = document.getElementById('playerPlayButton');
  playerPauseButton = document.getElementById('playerPauseButton');
  playerPrevButton = document.getElementById('playerPrevButton');
  playerNextButton = document.getElementById('playerNextButton');
  playbackTitle = document.querySelector('.playback__title');
  playbackArtist = document.querySelector('.playback__artist');
  playerDuration = document.querySelector('.player__duration');
  songAnimation = document.querySelectorAll('.song__animation');
  songCover = document.querySelectorAll('.song__cover');
  volumeValue = document.getElementById('volumeValue');

  songClickHandler();
  albumButtonsClickHandler();
  playerButtonsClickHandler();
  setCurrentSongTime();
  setSongVolume();
  showVolumeMenu();
  updateSongVolume();
}

main();
