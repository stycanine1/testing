// ========== PLAYER & SERVER LOGIC ===========
let autoplayTimeout = null;
let currentItem = {};
// Example structure for currentItem: { id, media_type: "movie"|"tv", ... }

function openPlayerModal(item) {
  currentItem = item;
  // Set modal info (title, image, description, etc.)
  document.getElementById('modal-title').textContent = item.title || item.name || '';
  document.getElementById('modal-description').textContent = item.overview || '';
  document.getElementById('modal-image').src = item.poster_path 
    ? "https://image.tmdb.org/t/p/w300" + item.poster_path
    : '';

  // Show episode/season selectors if TV
  if (item.media_type === "tv") {
    document.getElementById('season-episode-select').style.display = '';
    // Populate season and episode (example: assume 1 season, 10 episodes)
    populateSeasons(1); // You can update season/ep logic to call TMDB if you want
    populateEpisodes(10);
  } else {
    document.getElementById('season-episode-select').style.display = 'none';
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
    populateEpisodes(10); // Update for selected season
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

// Change video source/player
function changeServer() {
  clearAutoplay();
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === "movie" ? "movie" : "tv";
  let embedURL = "";
  let id = currentItem.id;
  if (type === "tv" && document.getElementById('season-episode-select').style.display !== 'none') {
    const season = document.getElementById('season-dropdown').value;
    const episode = document.getElementById('episode-dropdown').value;
    if (server === "vidsrc.cc") {
      embedURL = `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`;
    } else if (server === "vidsrc.me") {
      embedURL = `https://vidsrc.net/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
    } else if (server === "player.videasy.net") {
      embedURL = `https://player.videasy.net/tv/${id}/${season}-${episode}`;
    }
    setupAutoplayNext(id, season, episode, episodeDropdownLength());
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

function episodeDropdownLength() {
  return document.getElementById('episode-dropdown').options.length;
}

// Autoplay Next Episode
function setupAutoplayNext(tvId, season, episode, totalEpisodes) {
  clearAutoplay();
  const episodeDropdown = document.getElementById('episode-dropdown');
  const nextIndex = Array.from(episodeDropdown.options).findIndex(opt => opt.value == episode) + 1;
  if (nextIndex < totalEpisodes) {
    let counter = 10;
    document.getElementById('autoplay-timer').style.display = 'block';
    document.getElementById('autoplay-counter').textContent = counter;
    autoplayTimeout = setInterval(() => {
      counter--;
      document.getElementById('autoplay-counter').textContent = counter;
      if (counter <= 0) {
        clearAutoplay();
        episodeDropdown.selectedIndex = nextIndex;
        changeServer();
      }
    }, 1000);
    document.getElementById('cancel-autoplay').onclick = clearAutoplay;
  } else {
    document.getElementById('autoplay-timer').style.display = 'none';
  }
}

function clearAutoplay() {
  if (autoplayTimeout) {
    clearInterval(autoplayTimeout);
    autoplayTimeout = null;
    document.getElementById('autoplay-timer').style.display = 'none';
  }
}

// Modal controls
document.getElementById('close-modal').onclick = () => {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
  clearAutoplay();
};
window.onclick = function(event) {
  if (event.target === document.getElementById('modal')) {
    document.getElementById('close-modal').onclick();
  }
};

// Example: To open modal for a movie, call openPlayerModal({ id: ..., title: ..., overview: ..., poster_path: ..., media_type: "movie" })
