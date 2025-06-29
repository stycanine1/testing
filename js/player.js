/**
 * ========================================
 * ZETFLIX SIMPLIFIED PLAYER
 * ========================================
 * 
 * Simplified player based on working reference implementation
 */

let currentItem = {};

// Open player modal with content
function openPlayerModal(item) {
  currentItem = item;
  
  // Set modal info
  document.getElementById('modal-title').textContent = item.title || item.name || '';
  document.getElementById('modal-description').textContent = item.overview || '';
  document.getElementById('modal-image').src = item.poster_path 
    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
    : '';
  
  // Set rating stars
  const rating = item.vote_average ? Math.round(item.vote_average / 2) : 0;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(rating);

  // Show episode/season selectors if TV
  const seasonEpisodeSelect = document.getElementById('season-episode-select');
  if (item.media_type === "tv" || (!item.title && item.name)) {
    seasonEpisodeSelect.style.display = 'block';
    populateSeasons(3); // Default 3 seasons
    populateEpisodes(10); // Default 10 episodes
  } else {
    seasonEpisodeSelect.style.display = 'none';
  }

  // Set default server and load video
  document.getElementById('server').value = 'vidsrc.cc';
  changeServer();

  // Show modal
  document.getElementById('modal').style.display = 'flex';
}

// Populate season dropdown
function populateSeasons(numSeasons) {
  const seasonDropdown = document.getElementById('season-dropdown');
  seasonDropdown.innerHTML = '';
  for (let i = 1; i <= numSeasons; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Season ${i}`;
    seasonDropdown.appendChild(opt);
  }
  seasonDropdown.onchange = () => {
    populateEpisodes(10);
    changeServer();
  };
}

// Populate episode dropdown
function populateEpisodes(numEpisodes) {
  const episodeDropdown = document.getElementById('episode-dropdown');
  episodeDropdown.innerHTML = '';
  for (let i = 1; i <= numEpisodes; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Episode ${i}`;
    episodeDropdown.appendChild(opt);
  }
  episodeDropdown.onchange = changeServer;
}

// Change video source/server
function changeServer() {
  const server = document.getElementById('server').value;
  const type = (currentItem.media_type === "movie" || currentItem.title) ? "movie" : "tv";
  let embedURL = "";
  const id = currentItem.id;
  
  if (type === "tv" && document.getElementById('season-episode-select').style.display !== 'none') {
    const season = document.getElementById('season-dropdown').value || 1;
    const episode = document.getElementById('episode-dropdown').value || 1;
    
    if (server === "vidsrc.cc") {
      embedURL = `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`;
    } else if (server === "vidsrc.me") {
      embedURL = `https://vidsrc.net/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    } else if (server === "player.videasy.net") {
      embedURL = `https://player.videasy.net/tv/${id}/${season}-${episode}`;
    }
  } else {
    if (server === "vidsrc.cc") {
      embedURL = `https://vidsrc.cc/v2/embed/movie/${id}`;
    } else if (server === "vidsrc.me") {
      embedURL = `https://vidsrc.net/embed/movie/?tmdb=${id}`;
    } else if (server === "player.videasy.net") {
      embedURL = `https://player.videasy.net/movie/${id}`;
    }
  }
  
  document.getElementById('modal-video').src = embedURL;
}

// Close modal
function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

// Modal click outside to close
window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
};

// Export functions to global scope
window.openPlayerModal = openPlayerModal;
window.changeServer = changeServer;
window.closeModal = closeModal;
window.populateSeasons = populateSeasons;
window.populateEpisodes = populateEpisodes;