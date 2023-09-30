import { albums } from "../data/data.js";

function getRandomIntegerNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatSongTitle(song) {
  const [title, artist] = [song.songTitle, song.songArtist];

  let formatedString = "";

  formatedString = `${artist.toLowerCase()}-${title.toLowerCase()}`;
  formatedString = formatedString.replaceAll(" ", "_");

  return formatedString;
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

function createAudioList() {
  let audioList = [];
  let albumCount = albums.length;
  let songCount;
  let song;

  for (let i = 0; i < albumCount; i++) {
    songCount = albums[i].albumSongs.length;

    for (let j = 0; j < songCount; j++) {
      song = albums[i].albumSongs[j];

      audioList.push(new Audio(`./src/audio/${formatSongTitle(song)}.mp3`));
    }
  }

  return audioList;
}

function displayAlbums() {
  const albumList = document.getElementById('albumList');

  let albumCount = albums.length;
  let album;

  if (albumCount > 0) {
    for (let index = 0; index < albumCount; index++) {
      album = albums[index];

      albumList.innerHTML += `
        <li class="albums__item album" data-album-id=${album.albumID}>
          <div class="album__header">
            <div class="album__cover cover-album">
              <img class="cover-album__img" src=${album.albumCover} alt="">
            </div>
            <div class="album__information">
              <h2 class="album__title">${album.albumTitle}</h2>
              <p class="album__tagline">${album.albumArtist} • ${album.albumReleaseYear}</p>
              <button class="album__button button-album button-reset" id="albumButton">
                <img class="button-album__img" src="./src/img/common/icon-play.svg" id="albumButtonImg">
                <p class="button-album__text">Слушать</p>
              </button>
            </div>
          </div>
          <span class="stroke display-none"></span>
          <div class="album__content content-album display-none">
            <ul class="content-album__list list-reset" id="albumContentList_${index}"></ul>
          </div>
          <div class="album__footer">
            <button class="album-content__button button-reset" id="showAlbumContentButton" data-button-id="${index}">Показать песни</button>
          </div>
        </li>
      `;

      displayAlbumSongs(album, index);
      showAlbumContent();
    }
  } else {
    albumList.innerHTML = '<p class="albums__message">Альбомы не найдены</p>'
  }
}

function displayAlbumSongs(album, id) {
  const albumContentList = document.getElementById(`albumContentList_${id}`);

  let songTitle;
  let songCount = album.albumSongs.length;
  let song;

  if (songCount > 0) {
    for (let index = 0; index < songCount; index++) {
      song = album.albumSongs[index];
      songTitle = song.songTitle.replaceAll("_", " ");

      albumContentList.innerHTML += `
        <li class="content-album__item song" data-song-title=${song.songTitle} data-song-artist=${song.songArtist} data-song-duration=${song.songDuration} data-song-id=${song.songID} data-song-cover=${song.songCover}>
          <div class="song__cover cover-song">
            <img class="cover-song__img" src=${song.songCover} alt=${song.songCover}>
            <button class="cover-song__button button-cover-song button-reset">
              <img class="button-cover-song__img" src="./src/img/common/icon-play.svg" alt="Слушать">
            </button>
            <div class="cover-song__animation animation-song-cover">
              <div class="animation-song-cover__item"></div>
              <div class="animation-song-cover__item"></div>
              <div class="animation-song-cover__item"></div>
              <div class="animation-song-cover__item"></div>
            </div>
          </div>
          <div class="song__information">
            <h3 class="song__title">${songTitle}</h3>
            <h4 class="song__artist">${song.songArtist}</h4>
          </div>
          <div class="song__duration duration-song">
            <p class="duration-song__text">${song.songDuration}</p>
          </div>
        </li>
      `
    }
  } else {
    albumContentList.innerHTML = '<p class="content-album__message">Песни не найдены</p>'
  }
}

function showAlbumContent() {
  const showAlbumContentButton = document.querySelectorAll('#showAlbumContentButton');
  const albumStrokes = document.querySelectorAll('.stroke');

  showAlbumContentButton.forEach((albumContentButton, index) => {
    albumContentButton.addEventListener('click', (e) => {
      const albums = document.querySelectorAll('.album');
      const currentAlbumContent = albums[e.target.dataset.buttonId].childNodes[5];

      showAlbumContentButton[index].classList.toggle('is-shown');

      if (showAlbumContentButton[index].classList.contains('is-shown')) {
        showAlbumContentButton[index].textContent = 'Скрыть песни';
      } else {
        showAlbumContentButton[index].textContent = 'Показать песни';
      }

      albumStrokes[index].classList.toggle('display-none');
      currentAlbumContent.classList.toggle('display-none');
    })
  })
}

function playSong(song) {
  let songID = song.dataset.songId;

  audioList[songID].play();

  isSongPlaying = true;

  currentSong = song;

  song.classList.add('playing');

  setAlbumButtonIcon();
  setSongButtonIcon();
  setPlayerButtonIcons();
  startSongAnimation();
  displaySongAnimation();

  songDurationUpdate();

  displayPlayer();
  displayPlayerSlider();
  setPlayerSongData(song);

  songEndHandler(songID);
}

function pauseSong(song) {
  let songID = song.dataset.songId;

  audioList[songID].pause();

  isSongPlaying = false;

  setAlbumButtonIcon();
  setSongButtonIcon();
  setPlayerButtonIcons();
  stopSongAnimation();
  displaySongAnimation();
}

function stopSong(song) {
  const songsDuration = document.querySelectorAll('.duration-song__text');

  let songID = song.dataset.songId;

  audioList[songID].pause();
  audioList[songID].currentTime = 0;

  song.classList.remove('playing');

  isSongPlaying = false;

  setAlbumButtonIcon();
  setSongButtonIcon();
  setPlayerButtonIcons();
  stopSongAnimation();
  displaySongAnimation();

  songsDuration[songID].textContent = song.dataset.songDuration;
}

function playNextSong() {
  const songList = getSongs();

  let nextSong;

  songList[currentSong.dataset.songId].classList.remove('playing');

  if (currentSong.dataset.songId == audioList.length - 1) {
    nextSong = songList[0];
  } else {
    nextSong = songList[+(currentSong.dataset.songId) + 1];
  }

  stopSong(currentSong);
  playSong(nextSong);
}

function playPreviousSong() {
  const songList = getSongs();

  let previousSong;

  songList[currentSong.dataset.songId].classList.remove('playing');

  if (currentSong.dataset.songId == 0) {
    previousSong = songList[audioList.length - 1];
  } else {
    previousSong = songList[+(currentSong.dataset.songId) - 1];
  }
  
  if (audioList[currentSong.dataset.songId].currentTime > 2) {
    audioList[currentSong.dataset.songId].currentTime = 0.0;
  } else {
    stopSong(currentSong);
    playSong(previousSong);
  }
}

function getSongs() {
  return document.querySelectorAll('.song');
}

function songEndHandler(songID) {
  audioList[songID].addEventListener("ended", () => {
    playNextSong(songID);
  })
}

function songClickHandler() {
  const songList = getSongs();

  let targetSongID;

  songList.forEach(song => {
    song.addEventListener('click', () => {
      targetSongID = song.dataset.songId;

      if (currentSong === undefined) {
        playSong(song);
      } else if (currentSong.dataset.songId === targetSongID && isSongPlaying === false) {
        playSong(song);
      } else if (currentSong.dataset.songId === targetSongID && isSongPlaying === true) {
        pauseSong(song);
      } else {
        stopSong(currentSong);
        playSong(song);
      }
    });
  })
}

function setSongButtonIcon() {
  const songsButtonImg = document.querySelectorAll('.button-cover-song__img');

  if (isSongPlaying) {
    songsButtonImg[currentSong.dataset.songId].src = `./src/img/common/icon-pause.svg`;
  } else {
    songsButtonImg[currentSong.dataset.songId].src = `./src/img/common/icon-play.svg`;
  }
}

function albumButtonClickHandler() {
  const albumButton = document.getElementById('albumButton');
  const songList = getSongs();

  albumButton.addEventListener('click', () => {
    setAlbumButtonIcon();

    if (currentSong === undefined) {
      playSong(songList[0]);
    } else if (currentSong !== undefined && isSongPlaying === false) {
      playSong(currentSong);
    } else if (currentSong !== undefined && isSongPlaying === true) {
      pauseSong(currentSong);
    }
  });
}

function setAlbumButtonIcon() {
  const albumButtonImg = document.getElementById('albumButtonImg');

  if (isSongPlaying) {
    albumButtonImg.src = `./src/img/common/icon-pause.svg`;
  } else {
    albumButtonImg.src = `./src/img/common/icon-play.svg`;
  }
}

function playerButtonsClickHandler() {
  const previousSongControl = document.getElementById('previousSongControl');
  const playSongControl = document.getElementById('playSongControl');
  const nextSongControl = document.getElementById('nextSongControl');

  previousSongControl.addEventListener('click', () => {
    playPreviousSong();
  });

  playSongControl.addEventListener('click', () => {
    if (audioList[currentSong.dataset.songId].paused) {
      playSong(currentSong);
    } else {
      pauseSong(currentSong);
    }
  });

  nextSongControl.addEventListener('click', () => {
    playNextSong();
  });
}

function setPlayerButtonIcons() {
  const controlsPlayIcon = document.getElementById('controlsPlayIcon');

  if (isSongPlaying) {
    controlsPlayIcon.src = `./src/img/common/icon-pause.svg`;
  } else {
    controlsPlayIcon.src = `./src/img/common/icon-play.svg`;
  }
}

function displayPlayer() {
  const player = document.getElementById('player');

  player.style.display = 'flex';
}

function displayPlayerSlider() {
  const playerSlider = document.getElementById('playerSlider');

  let sliderWidth;

  if (window.innerWidth > 1024) {
    sliderWidth = 100;
  } else if (window.innerWidth <= 1024 && window.innerWidth > 800) {
    sliderWidth = 100;
  }

  playerSlider.style.width = sliderWidth + '%';
}

function setCurrentSongDuration(duration) {
  const songsDuration = document.querySelectorAll('.duration-song__text');
  const playerDuration = document.getElementById('playerDuration');

  songsDuration[currentSong.dataset.songId].textContent = duration;
  playerDuration.textContent = duration;
}


function sliderDurationUpdate(currentSong) {
  const sliderProgress = document.getElementById('sliderProgress');

  let offset;

  offset = (currentSong.currentTime / currentSong.duration) * 100;

  sliderProgress.style.width = offset + "%";
}

function songDurationUpdate() {
  let convertedTime;

  audioList[currentSong.dataset.songId].addEventListener("timeupdate", () => {
    convertedTime = timeConversion(audioList[currentSong.dataset.songId].currentTime);

    setCurrentSongDuration(convertedTime);
    sliderDurationUpdate(audioList[currentSong.dataset.songId]);
  });
}

function setCurrentSongTime() {
  const playerSlider = document.getElementById('playerSlider');

  let position;
  let defaultDurationBoxWidth;

  playerSlider.addEventListener("click", (e) => {
    defaultDurationBoxWidth = playerSlider.clientWidth;
    position = audioList[currentSong.dataset.songId].duration / defaultDurationBoxWidth;

    audioList[currentSong.dataset.songId].currentTime = e.offsetX * position;
  });
}

function setPlayerSongData(song) {
  const playerTitle = document.getElementById('playerTitle'); 
  const playerArtist = document.getElementById('playerArtist');
  const playerCover = document.getElementById('playerCover');

  let songTitle = song.dataset.songTitle.replaceAll("_", " ");

  playerTitle.textContent = songTitle;
  playerArtist.textContent = song.dataset.songArtist;
  playerCover.src = song.dataset.songCover
}

function animateSong() {
  const songAnimationContainers = document.querySelectorAll('.cover-song__animation');

  let songAnimationBars = Array.from(songAnimationContainers[currentSong.dataset.songId].children);
  let randomIntegerNumber;

  songAnimationBars.forEach((bar, index) => {
    if (index == 0) {
      randomIntegerNumber = getRandomIntegerNumber(70, 90);
    }

    if (index == 1) {
      randomIntegerNumber = getRandomIntegerNumber(50, 75);
    }

    if (index == 2) {
      randomIntegerNumber = getRandomIntegerNumber(40, 70);
    }

    if (index == 3) {
      randomIntegerNumber = getRandomIntegerNumber(20, 60);
    }

    bar.style.height = randomIntegerNumber + "%";
  });
}

function startSongAnimation() {
  songAnimationInterval = setInterval(animateSong, 100);
}

function stopSongAnimation() {
  clearInterval(songAnimationInterval);
}

function displaySongAnimation() {
  const songAnimationContainers = document.querySelectorAll('.cover-song__animation');
  const songCoversImg = document.querySelectorAll('.cover-song__img');

  if (audioList[currentSong.dataset.songId].paused) {
    songAnimationContainers[currentSong.dataset.songId].style.display = 'none';
    songCoversImg[currentSong.dataset.songId].removeAttribute('style');
  } else {
    songAnimationContainers[currentSong.dataset.songId].removeAttribute('style');
    songCoversImg[currentSong.dataset.songId].style.filter = 'brightness(0.3)';
  }
}

function setSongVolume() {
  const songVolume = localStorage.getItem("songVolume");

  let deafultVolume = 60;

  if (songVolume == null) {
    localStorage.setItem("songVolume", deafultVolume);

    volumeValue.style.width = deafultVolume + "%";

    audioList.forEach((song) => {
      song.volume = deafultVolume / 100;
    });
  } else {
    volumeValue.style.width = songVolume + "%";
  }

  setVolumeIcon();
}

function setVolumeIcon() {
  const songVolume = localStorage.getItem("songVolume");
  const volumeButton = document.getElementById("volumeButton");

  audioList.forEach((song) => {
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

function updateSongVolume() {
  const songVolume = localStorage.getItem("songVolume");
  const volumeSlider = document.getElementById("volumeSlider");

  let targetValue;

  volumeSlider.addEventListener("click", (e) => {
    if (e.offsetX > 100) {
      targetValue = 100;
    } else if (e.offsetX < 5) {
      targetValue = 0;
    } else {
      targetValue = e.offsetX;
    }

    volumeValue.style.width = targetValue + "%";

    localStorage.setItem("songVolume", targetValue);

    audioList.forEach((song) => {
      song.volume = songVolume / 100;
    });

    setVolumeIcon();
  });
}

let currentSong;
let audioList;
let isSongPlaying;
let songAnimationInterval;

audioList = createAudioList();

displayAlbums();
songClickHandler();
albumButtonClickHandler();
playerButtonsClickHandler();
setCurrentSongTime();
setSongVolume();
updateSongVolume();