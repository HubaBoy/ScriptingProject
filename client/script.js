
let songs = [];

const container = document.getElementById('container');
const bottomContainer = document.getElementById('bottom-container');
const audioElement = document.getElementById('audio');
const addButton = document.getElementById('add');
const middleNav = document.getElementById('middle-nav');
let onAdd = false;

const uploadButton = document.getElementById('uploadButton');
const musicFileName = document.getElementById('musicFileName');
const musicInput = document.getElementById('musicInput');
musicInput.onchange = () => {
  const selectedSong = musicInput.files[0];
  console.log(selectedSong);
  musicFileName.textContent = selectedSong.name;
}

const imageFileName = document.getElementById('imageFileName');
const imageInput = document.getElementById('imageInput');
imageInput.onchange = () => {
  const selectedImage = imageInput.files[0];
  console.log(selectedImage);
  imageFileName.textContent = selectedImage.name;
}

function appendCard(i) {
  let newdiv = document.createElement('div');
  let imgContainer = document.createElement('div'); // New container for the image
  let img = document.createElement('img');
  let p = document.createElement('p');
  
  newdiv.className = 'card';
  imgContainer.className = 'image-container'; // New class for the image container
  img.src = songs[i].img;
  p.textContent = songs[i].name;
  
  container.appendChild(newdiv);
  newdiv.appendChild(imgContainer); // Append the image container
  imgContainer.appendChild(img); // Append the image to the container
  newdiv.appendChild(p);
  middleNav.appendChild(newdiv);
  
  newdiv.addEventListener('click', function() {
    // Deactivate all songs
    if (!onAdd) {
      songs.forEach(song => song.isActive = false);
      
      // Activate the current song
      songs[i].isActive = true;
      
      renderActiveSong();
    }
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
    uploadBar.style.display = 'flex';
    middleNav.style.display = 'none';
    onAdd = true;
  } else {
    uploadBar.style.display = 'none';
    middleNav.style.display = 'flex';
    onAdd = false;
  }
}
fetch('http://localhost:3000/data')
  .then(response => response.json())
  .then(data => {
    songs = data;
    console.log(songs.length);
    displaySongs();
  })
  .catch(error => {
    console.log('Error fetching the data:', error);
  })




  addButton.addEventListener('click', () => {
    displayUploadBar();
});
  
uploadButton.addEventListener('click', () => {
  console.log('clicked');
  const formData = new FormData();
  if (!musicInput.files[0]) {
    console.log('Please select a file');
  } else {
    formData.append(musicInput.name, musicInput.files[0]);
    fetch("http://localhost:3000/upload_files", {
      method: 'POST',
      body: formData,
      mode: 'cors', // Add this line to enable CORS
    })
      .then((res) => console.log(res))
      .catch((err) => console.log("Error occurred:", err));
  }
});
