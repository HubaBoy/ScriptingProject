let songs = [];

const container = document.getElementById('container');
const bottomContainer = document.getElementById('bottom-container');
const audioElement = document.getElementById('audio');
const addButton = document.getElementById('add');
let onAdd = false;

function appendCard(i) {
  let newdiv = document.createElement('div');
  let img = document.createElement('img');
  let p = document.createElement('p');
  
  newdiv.className = 'card';
  img.src = songs[i].img;
  p.textContent = songs[i].name;
  
  container.appendChild(newdiv);
  newdiv.appendChild(img);
  newdiv.appendChild(p);
  
  newdiv.addEventListener('click', function() {
    // Deactivate all songs
   if(!onAdd)
    { songs.forEach(song => song.isActive = false);
    
    // Activate the current song
    songs[i].isActive = true;
    
    renderActiveSong();}
  });
}

function renderActiveSong() {
  const activeSong = songs.find(song => song.isActive);
  
  if (activeSong) {
    bottomContainer.innerHTML = `
      <img src="${activeSong.img}">
      <p>${activeSong.name}</p>
    `;
    audioElement.src = activeSong.song;
    audioElement.load();
  } else {
    bottomContainer.innerHTML = '';
    audioElement.src = '';
  }
}

function displaySongs() {
  for (let i = 0; i < songs.length; i++) {
    appendCard(i);
  }
}

function displayUploadBar() {
  const uploadBar = document.querySelector('.upload');
  if (uploadBar.style.display === 'none') {
    uploadBar.style.display = 'block';
    onAdd = true;
  } else {
    uploadBar.style.display = 'none';
    onAdd = false;
  }
}
fetch('http://localhost:3000/data')
  .then(response => response.json())
  .then(data => {
    songs = data;
    displaySongs();
  })
  .catch(error => {
    console.log('Error fetching the data:', error);
  })




  addButton.addEventListener('click', () => {
    displayUploadBar();
});
  
  