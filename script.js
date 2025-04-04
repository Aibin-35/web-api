const apiKey = 'AIzaSyBfENSWI9cPzG4HjqnE4eVsLVThZB3xRRM';
let nextPageToken = '';
let prevPageToken = '';
let currentQuery = '';

function searchVideos(pageToken = '') {
  const query = document.getElementById('searchInput').value || currentQuery;
  if (!query) return;

  currentQuery = query;

  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${apiKey}&pageToken=${pageToken}`)
    .then(res => res.json())
    .then(data => {
      nextPageToken = data.nextPageToken || '';
      prevPageToken = data.prevPageToken || '';
      displayResults(data.items);
      updatePaginationButtons();
    })
    .catch(err => {
      console.error('Failed to fetch data:', err);
      alert('Error fetching YouTube videos. Check the API key and quota.');
    });
}

function displayResults(videos) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  videos.forEach(video => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.medium.url;

    const videoEl = document.createElement('div');
    videoEl.className = 'video';
    videoEl.innerHTML = `
      <h3>${title}</h3>
      <iframe width="320" height="180" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
      <br>
      <button onclick="addToFavorites('${videoId}', '${title.replace(/'/g, "\\'")}', '${thumbnail}')">Add to Favorites</button>
    `;
    container.appendChild(videoEl);
  });
}

function updatePaginationButtons() {
  document.getElementById('nextBtn').disabled = !nextPageToken;
  document.getElementById('prevBtn').disabled = !prevPageToken;
}

function nextPage() {
  if (nextPageToken) searchVideos(nextPageToken);
}

function prevPage() {
  if (prevPageToken) searchVideos(prevPageToken);
}

function addToFavorites(id, title, thumbnail) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.some(video => video.id === id)) {
    favorites.push({ id, title, thumbnail });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
  }
}

function removeFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites = favorites.filter(video => video.id !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
}

function displayFavorites() {
  const container = document.getElementById('favorites');
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  container.innerHTML = '';

  favorites.forEach(video => {
    const videoEl = document.createElement('div');
    videoEl.className = 'video';
    videoEl.innerHTML = `
      <h3>${video.title}</h3>
      <iframe width="320" height="180" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
      <br>
      <button onclick="removeFavorite('${video.id}')">Remove from Favorites</button>
    `;
    container.appendChild(videoEl);
  });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

window.onload = displayFavorites;
