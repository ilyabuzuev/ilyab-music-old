import { data } from "../data/data.js";

const songButton = document.querySelector('.song__button')

function main() {
  let songList = data.songList;

  songButton.addEventListener('click', () => {
    console.log('click');
  })

  songList.forEach(song => {});
}

main();