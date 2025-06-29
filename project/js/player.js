/**
 * ========================================
 * ZETFLIX VIDEO PLAYER - FREE SOURCES
 * ========================================
 * 
 * Updated with free working video sources and enhanced error handling
 */

// ========================================
// 🎮 PLAYER STATE MANAGEMENT
// ========================================

let currentPlayerState = {
  content: null,
  type: null,
  season: 1,
  episode: 1,
  currentServer: 'vidsrc-pro',
  sources: [],
  currentSourceIndex: 0,
  isPlaying: false,
  isMuted: false,
  isFullscreen: false,
  volume: 100,
  showControls: true,
  controlsTimeout: null,
  tvDetails: null,
  seasonDetails: null,
  availableSeasons: [],
  availableEpisodes: [],
  retryCount: 0
};

// Store current item globally
let currentItem = null;
let currentSeason = 1;
let currentEpisode = 1;

// ========================================
// 🔍 ENHANCED DIAGNOSTIC TEST FUNCTION
// ========================================

function testYouTubePlayer() {
  console.log('🧪 Starting comprehensive FREE video source test...');
  
  // Show player modal
  const playerModal = document.getElementById('videoPlayerModal');
  playerModal.style.display = 'block';
  
  // Set player title
  const playerTitle = document.getElementById('playerTitle');
  playerTitle.textContent = '🧪 FREE Video Sources Diagnostics';
  
  // Hide episode selector for test
  const episodeSelector = document.getElementById('episodeSelector');
  episodeSelector.style.display = 'none';
  
  // Set up test server selector with FREE sources
  const serverSelect = document.getElementById('serverSelect');
  serverSelect.innerHTML = `
    <option value="vidsrc-pro">VidSrc Pro (FREE • HD)</option>
    <option value="vidsrc-xyz">VidSrc XYZ (FREE • FAST)</option>
    <option value="vidsrc-net">VidSrc Net (FREE • STABLE)</option>
    <option value="embedsito">EmbedSito (FREE • MULTI-SOURCE)</option>
    <option value="multiembed">MultiEmbed (FREE • AGGREGATOR)</option>
    <option value="smashystream">SmashyStream (FREE • QUALITY)</option>
    <option value="autoembed">AutoEmbed (FREE • AUTO)</option>
    <option value="moviesapi">MoviesAPI (FREE • API)</option>
    <option value="youtube-test">YouTube Test (FREE • OFFICIAL)</option>
    <option value="archive-test">Internet Archive Test (FREE • LEGAL)</option>
    <option value="data-test">Basic Iframe Test</option>
  `;
  
  // Set up test content (using popular movie for testing)
  currentItem = {
    id: 550, // Fight Club TMDB ID - popular movie for testing
    title: 'Fight Club',
    media_type: 'movie'
  };
  
  currentPlayerState.content = currentItem;
  currentPlayerState.type = 'movie';
  
  // Load initial test
  changeServer();
  
  // Initialize player controls
  initializePlayerControls();
  
  // Disable body scroll
  document.body.style.overflow = 'hidden';
  
  console.log('🧪 FREE sources test setup complete. Try different servers from the dropdown.');
}

// ========================================
// 🎬 PLAYER INITIALIZATION
// ========================================

async function initializeVideoPlayer(content, type, season = null, episode = null) {
  console.log('🎬 Initializing ZetFlix Player with FREE sources:', { 
    content: content.title || content.name, 
    type, 
    season, 
    episode 
  });
  
  // Set global variables
  currentItem = content;
  currentSeason = season || 1;
  currentEpisode = episode || 1;
  
  // Update player state
  currentPlayerState.content = content;
  currentPlayerState.type = type;
  currentPlayerState.season = currentSeason;
  currentPlayerState.episode = currentEpisode;
  currentPlayerState.isPlaying = true;
  
  // Show player modal
  const playerModal = document.getElementById('videoPlayerModal');
  playerModal.style.display = 'block';
  
  // For TV shows, fetch detailed information first
  if (type === 'tv') {
    await loadTVShowDetails();
    await loadSeasonDetails(currentSeason);
  }
  
  // Set player title
  updatePlayerTitle();
  
  // Populate server selector with FREE sources
  populateServerSelector();
  
  // Populate episode selector for TV shows
  if (type === 'tv') {
    populateEpisodeSelector();
  }
  
  // Load first source
  changeServer();
  
  // Initialize player controls
  initializePlayerControls();
  
  // Disable body scroll
  document.body.style.overflow = 'hidden';
}

async function loadTVShowDetails() {
  try {
    console.log('📺 Loading TV show details for ID:', currentItem.id);
    const tvDetails = await TMDBService.getTVShowDetails(currentItem.id);
    currentPlayerState.tvDetails = tvDetails;
    currentPlayerState.availableSeasons = (tvDetails.seasons || []).filter(season => {
      return season.episode_count > 0 && season.season_number > 0;
    });
    
    console.log('✅ TV show details loaded:', {
      name: tvDetails.name,
      seasons: currentPlayerState.availableSeasons.length,
      totalEpisodes: tvDetails.number_of_episodes
    });
  } catch (error) {
    console.error('❌ Error loading TV show details:', error);
    currentPlayerState.availableSeasons = [
      { season_number: 1, episode_count: 10, name: 'Season 1' }
    ];
  }
}

async function loadSeasonDetails(seasonNumber) {
  try {
    console.log('📺 Loading season details for season:', seasonNumber);
    const seasonDetails = await TMDBService.getTVSeasonDetails(currentItem.id, seasonNumber);
    currentPlayerState.seasonDetails = seasonDetails;
    currentPlayerState.availableEpisodes = seasonDetails.episodes || [];
    
    console.log('✅ Season details loaded:', {
      season: seasonNumber,
      episodes: currentPlayerState.availableEpisodes.length
    });
  } catch (error) {
    console.error('❌ Error loading season details:', error);
    const selectedSeason = currentPlayerState.availableSeasons.find(s => s.season_number === seasonNumber);
    const episodeCount = selectedSeason ? selectedSeason.episode_count : 10;
    
    currentPlayerState.availableEpisodes = [];
    for (let i = 1; i <= episodeCount; i++) {
      currentPlayerState.availableEpisodes.push({
        episode_number: i,
        name: `Episode ${i}`,
        overview: '',
        air_date: null
      });
    }
  }
}

function updatePlayerTitle() {
  const { content, type, season, episode } = currentPlayerState;
  const playerTitle = document.getElementById('playerTitle');
  
  let title = '';
  if (type === 'anime') {
    title = AniListService.getAnimeTitle(content);
    if (episode) {
      title += ` - Episode ${episode}`;
    }
  } else if (type === 'tv') {
    title = content.name || content.title;
    if (season && episode) {
      const episodeData = currentPlayerState.availableEpisodes.find(ep => ep.episode_number === episode);
      if (episodeData && episodeData.name && episodeData.name !== `Episode ${episode}`) {
        title += ` - S${season}E${episode}: ${episodeData.name}`;
      } else {
        title += ` - S${season}E${episode}`;
      }
    }
  } else {
    title = content.title || content.name;
  }
  
  playerTitle.textContent = title;
}

function populateServerSelector() {
  const serverSelect = document.getElementById('serverSelect');
  serverSelect.innerHTML = '';
  
  // FREE working servers
  const servers = [
    { value: 'vidsrc-pro', name: 'VidSrc Pro', tags: 'FREE • HD • RECOMMENDED' },
    { value: 'vidsrc-xyz', name: 'VidSrc XYZ', tags: 'FREE • FAST • HD' },
    { value: 'vidsrc-net', name: 'VidSrc Net', tags: 'FREE • STABLE' },
    { value: 'embedsito', name: 'EmbedSito', tags: 'FREE • MULTI-SOURCE' },
    { value: 'multiembed', name: 'MultiEmbed', tags: 'FREE • AGGREGATOR' },
    { value: 'smashystream', name: 'SmashyStream', tags: 'FREE • QUALITY' },
    { value: 'autoembed', name: 'AutoEmbed', tags: 'FREE • AUTO' },
    { value: 'moviesapi', name: 'MoviesAPI', tags: 'FREE • API' },
    { value: 'youtube-trailers', name: 'YouTube Trailers', tags: 'FREE • OFFICIAL' },
    { value: 'archive-org', name: 'Internet Archive', tags: 'FREE • LEGAL' }
  ];
  
  servers.forEach(server => {
    const option = document.createElement('option');
    option.value = server.value;
    option.textContent = `${server.name} - ${server.tags}`;
    serverSelect.appendChild(option);
  });
}

function populateEpisodeSelector() {
  const episodeSelector = document.getElementById('episodeSelector');
  const seasonSelect = document.getElementById('seasonSelect');
  const episodeSelect = document.getElementById('episodeSelect');
  
  if (currentPlayerState.type !== 'tv') {
    episodeSelector.style.display = 'none';
    return;
  }
  
  episodeSelector.style.display = 'flex';
  
  // Populate seasons
  seasonSelect.innerHTML = '';
  currentPlayerState.availableSeasons.forEach(seasonData => {
    const option = document.createElement('option');
    option.value = seasonData.season_number;
    option.textContent = seasonData.name || `Season ${seasonData.season_number}`;
    if (seasonData.season_number === currentSeason) {
      option.selected = true;
    }
    seasonSelect.appendChild(option);
  });
  
  // Populate episodes
  episodeSelect.innerHTML = '';
  currentPlayerState.availableEpisodes.forEach(episodeData => {
    const option = document.createElement('option');
    option.value = episodeData.episode_number;
    
    let episodeTitle = episodeData.name || `Episode ${episodeData.episode_number}`;
    if (episodeData.air_date) {
      const airDate = new Date(episodeData.air_date);
      const formattedDate = airDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      episodeTitle += ` (${formattedDate})`;
    }
    
    option.textContent = episodeTitle;
    if (episodeData.episode_number === currentEpisode) {
      option.selected = true;
    }
    episodeSelect.appendChild(option);
  });
}

// ========================================
// 🎬 FREE VIDEO SOURCE LOGIC
// ========================================

function changeServer() {
  const server = document.getElementById('serverSelect').value;
  const type = currentItem.media_type === "movie" || currentPlayerState.type === "movie" ? "movie" : "tv";
  let embedURL = "";

  console.log('🆓 Changing to FREE server:', server, 'Type:', type, 'Season:', currentSeason, 'Episode:', currentEpisode);

  // Handle special test cases
  if (server === "youtube-test") {
    embedURL = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&rel=0";
  } else if (server === "archive-test") {
    embedURL = "https://archive.org/embed/night_of_the_living_dead_1968";
  } else if (server === "data-test") {
    embedURL = 'data:text/html,<html><body style="background:#000;color:#fff;font-family:Arial;text-align:center;padding:50px;"><h1>✅ FREE Iframe Working!</h1><p>If you can see this, iframes are supported.</p><p>Time: ' + new Date().toLocaleTimeString() + '</p><div style="margin-top:20px;"><h2>🆓 Free Video Sources Available:</h2><ul style="text-align:left;max-width:400px;margin:0 auto;"><li>VidSrc Pro - Most reliable</li><li>VidSrc XYZ - Fast streaming</li><li>EmbedSito - Multi-source</li><li>MultiEmbed - Aggregator</li><li>YouTube - Official trailers</li><li>Internet Archive - Legal content</li></ul></div></body></html>';
  } else if (type === "tv") {
    // TV show with season and episode - FREE sources
    if (server === "vidsrc-pro") {
      embedURL = `https://vidsrc.pro/embed/tv/${currentItem.id}/${currentSeason}/${currentEpisode}`;
    } else if (server === "vidsrc-xyz") {
      embedURL = `https://vidsrc.xyz/embed/tv/${currentItem.id}/${currentSeason}/${currentEpisode}`;
    } else if (server === "vidsrc-net") {
      embedURL = `https://vidsrc.net/embed/tv/${currentItem.id}/${currentSeason}/${currentEpisode}`;
    } else if (server === "embedsito") {
      embedURL = `https://www.embedsito.com/v2/tv/${currentItem.id}/${currentSeason}/${currentEpisode}`;
    } else if (server === "multiembed") {
      embedURL = `https://multiembed.mov/?video_id=${currentItem.id}&tmdb=1&s=${currentSeason}&e=${currentEpisode}`;
    } else if (server === "smashystream") {
      embedURL = `https://embed.smashystream.com/playere.php?tmdb=${currentItem.id}&season=${currentSeason}&episode=${currentEpisode}`;
    } else if (server === "autoembed") {
      embedURL = `https://player.autoembed.cc/embed/tv/${currentItem.id}/${currentSeason}/${currentEpisode}`;
    } else if (server === "moviesapi") {
      embedURL = `https://moviesapi.club/tv/${currentItem.id}-${currentSeason}-${currentEpisode}`;
    } else if (server === "youtube-trailers") {
      const title = encodeURIComponent(currentItem.name || currentItem.title);
      embedURL = `https://www.youtube.com/embed/search?q=${title}+season+${currentSeason}+trailer`;
    } else if (server === "archive-org") {
      const title = (currentItem.name || currentItem.title).toLowerCase().replace(/[^a-z0-9]/g, '_');
      embedURL = `https://archive.org/embed/${title}_s${currentSeason}e${currentEpisode}`;
    }
  } else {
    // Movie - FREE sources
    if (server === "vidsrc-pro") {
      embedURL = `https://vidsrc.pro/embed/movie/${currentItem.id}`;
    } else if (server === "vidsrc-xyz") {
      embedURL = `https://vidsrc.xyz/embed/movie/${currentItem.id}`;
    } else if (server === "vidsrc-net") {
      embedURL = `https://vidsrc.net/embed/movie/${currentItem.id}`;
    } else if (server === "embedsito") {
      embedURL = `https://www.embedsito.com/v2/movie/${currentItem.id}`;
    } else if (server === "multiembed") {
      embedURL = `https://multiembed.mov/?video_id=${currentItem.id}&tmdb=1`;
    } else if (server === "smashystream") {
      embedURL = `https://embed.smashystream.com/playere.php?tmdb=${currentItem.id}`;
    } else if (server === "autoembed") {
      embedURL = `https://player.autoembed.cc/embed/movie/${currentItem.id}`;
    } else if (server === "moviesapi") {
      embedURL = `https://moviesapi.club/movie/${currentItem.id}`;
    } else if (server === "youtube-trailers") {
      const title = encodeURIComponent(currentItem.title || currentItem.name);
      const year = currentItem.release_date ? new Date(currentItem.release_date).getFullYear() : '';
      embedURL = `https://www.youtube.com/embed/search?q=${title}+${year}+trailer`;
    } else if (server === "archive-org") {
      const title = (currentItem.title || currentItem.name).toLowerCase().replace(/[^a-z0-9]/g, '_');
      const year = currentItem.release_date ? new Date(currentItem.release_date).getFullYear() : '';
      embedURL = `https://archive.org/embed/${title}_${year}`;
    }
  }

  console.log('✅ Generated FREE embed URL:', embedURL);

  // Load the video with enhanced error handling
  const videoFrame = document.getElementById('videoFrame');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const errorOverlay = document.getElementById('errorOverlay');
  
  // Show loading
  loadingOverlay.style.display = 'flex';
  errorOverlay.style.display = 'none';
  
  // Clear previous source
  videoFrame.src = '';
  
  // Enhanced error handling with detailed logging
  const loadTimeout = setTimeout(() => {
    console.warn('⏰ FREE source load timeout for server:', server);
    handleSourceError('timeout', server, embedURL);
  }, 25000); // 25 second timeout for free sources
  
  // Enhanced load events
  videoFrame.onload = () => {
    clearTimeout(loadTimeout);
    loadingOverlay.style.display = 'none';
    console.log('✅ FREE video source loaded successfully:', server);
    
    // Show success notification
    showSuccessNotification(`✅ ${server} (FREE) loaded successfully!`);
  };
  
  videoFrame.onerror = (error) => {
    clearTimeout(loadTimeout);
    console.error('❌ Failed to load FREE video source:', server, error);
    handleSourceError('error', server, embedURL, error);
  };
  
  // Load the embed URL
  try {
    videoFrame.src = embedURL;
  } catch (exception) {
    console.error('❌ Exception setting iframe src:', exception);
    handleSourceError('exception', server, embedURL, exception);
  }
}

function handleSourceError(errorType, server, url, error = null) {
  console.log('❌ FREE source error handling:', { errorType, server, url, error });
  
  const serverSelect = document.getElementById('serverSelect');
  const currentIndex = serverSelect.selectedIndex;
  const totalServers = serverSelect.options.length;
  
  // Try next server automatically (skip test servers)
  let nextIndex = currentIndex + 1;
  while (nextIndex < totalServers) {
    const nextServer = serverSelect.options[nextIndex].value;
    if (!nextServer.includes('test')) {
      console.log('🔄 Auto-switching to next FREE server:', nextServer);
      serverSelect.selectedIndex = nextIndex;
      setTimeout(() => {
        changeServer();
      }, 1500);
      return;
    }
    nextIndex++;
  }
  
  // Show error after all servers failed
  const loadingOverlay = document.getElementById('loadingOverlay');
  const errorOverlay = document.getElementById('errorOverlay');
  
  loadingOverlay.style.display = 'none';
  errorOverlay.style.display = 'flex';
  
  const errorMessage = errorOverlay.querySelector('p');
  errorMessage.innerHTML = `
    ❌ <strong>All FREE streaming sources failed</strong><br><br>
    
    <strong>Last Error Details:</strong><br>
    • Type: ${errorType}<br>
    • Server: ${server}<br>
    • URL: ${url}<br>
    • Error: ${error ? error.toString() : 'Unknown'}<br><br>
    
    <strong>🆓 Free sources limitations:</strong><br>
    • Content may not be available on all free platforms<br>
    • Free sources often have regional restrictions<br>
    • Some content may only have trailers available<br>
    • Ad blockers may interfere with free streaming<br>
    • Free sources may have limited server capacity<br><br>
    
    <strong>💡 Try these alternatives:</strong><br>
    • <a href="https://tubitv.com" target="_blank" style="color: #60A5FA;">Tubi</a> - Free movies with ads<br>
    • <a href="https://pluto.tv" target="_blank" style="color: #60A5FA;">Pluto TV</a> - Free live TV<br>
    • <a href="https://crackle.com" target="_blank" style="color: #60A5FA;">Crackle</a> - Sony's free service<br>
    • <a href="https://www.youtube.com/channel/UClgRkhTL3_hImCAmdLfDE4g" target="_blank" style="color: #60A5FA;">YouTube Movies</a> - Free movies<br>
    • <a href="https://archive.org/details/movies" target="_blank" style="color: #60A5FA;">Internet Archive</a> - Public domain content<br><br>
    
    <strong>🔧 Troubleshooting:</strong><br>
    • Disable ad blockers temporarily<br>
    • Try using a VPN for geo-blocked content<br>
    • Use the diagnostic test to identify issues<br>
    • Check if content is available on legal free platforms
  `;
}

function showSuccessNotification(message) {
  const successDiv = document.createElement('div');
  successDiv.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(16, 185, 129, 0.9);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 1020;
    animation: fadeIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  successDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>🆓</span>
      <span>${message}</span>
    </div>
  `;
  document.getElementById('videoContainer').appendChild(successDiv);
  
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.parentNode.removeChild(successDiv);
    }
  }, 4000);
}

// ========================================
// 🎮 PLAYER CONTROLS (Same as before)
// ========================================

function initializePlayerControls() {
  const playerControls = document.getElementById('playerControls');
  const videoContainer = document.getElementById('videoContainer');
  
  // Auto-hide controls
  function showControls() {
    playerControls.style.opacity = '1';
    playerControls.style.pointerEvents = 'auto';
    
    clearTimeout(currentPlayerState.controlsTimeout);
    currentPlayerState.controlsTimeout = setTimeout(() => {
      if (currentPlayerState.isPlaying) {
        playerControls.style.opacity = '0';
        playerControls.style.pointerEvents = 'none';
      }
    }, 3000);
  }
  
  // Show controls on mouse movement
  videoContainer.addEventListener('mousemove', showControls);
  videoContainer.addEventListener('touchstart', showControls);
  videoContainer.addEventListener('click', showControls);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
  
  // Fullscreen change events
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);
  
  // Initial controls display
  showControls();
}

function handleKeyboardShortcuts(event) {
  if (document.getElementById('videoPlayerModal').style.display !== 'block') {
    return;
  }
  
  switch (event.code) {
    case 'Space':
      event.preventDefault();
      togglePlay();
      break;
    case 'KeyF':
      event.preventDefault();
      toggleFullscreen();
      break;
    case 'KeyM':
      event.preventDefault();
      toggleMute();
      break;
    case 'Escape':
      closeVideoPlayer();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      navigateEpisode('previous');
      break;
    case 'ArrowRight':
      event.preventDefault();
      navigateEpisode('next');
      break;
    case 'KeyR':
      event.preventDefault();
      retryCurrentSource();
      break;
    case 'KeyN':
      event.preventDefault();
      switchToNextServer();
      break;
    case 'KeyD':
      event.preventDefault();
      testYouTubePlayer();
      break;
  }
}

function switchToNextServer() {
  const serverSelect = document.getElementById('serverSelect');
  const currentIndex = serverSelect.selectedIndex;
  const totalServers = serverSelect.options.length;
  
  if (totalServers > 1) {
    const nextIndex = (currentIndex + 1) % totalServers;
    serverSelect.selectedIndex = nextIndex;
    changeServer();
    console.log('🔄 Manually switched to next FREE server');
  }
}

function retryCurrentSource() {
  console.log('🔄 Manually retrying current FREE source...');
  changeServer();
}

function handleFullscreenChange() {
  const isFullscreen = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
  
  currentPlayerState.isFullscreen = isFullscreen;
  updateFullscreenButton();
}

function updateFullscreenButton() {
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const isFullscreen = currentPlayerState.isFullscreen;
  
  fullscreenBtn.innerHTML = isFullscreen
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
       </svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
       </svg>`;
}

// ========================================
// 🎮 CONTROL FUNCTIONS
// ========================================

function togglePlay() {
  currentPlayerState.isPlaying = !currentPlayerState.isPlaying;
  updatePlayButton();
}

function updatePlayButton() {
  const playBtn = document.getElementById('playBtn');
  const isPlaying = currentPlayerState.isPlaying;
  
  playBtn.innerHTML = isPlaying
    ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
         <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
       </svg>`
    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
         <polygon points="5,3 19,12 5,21"/>
       </svg>`;
}

function toggleMute() {
  currentPlayerState.isMuted = !currentPlayerState.isMuted;
  updateVolumeButton();
}

function updateVolumeButton() {
  const volumeBtn = document.getElementById('volumeBtn');
  const isMuted = currentPlayerState.isMuted;
  
  volumeBtn.innerHTML = isMuted
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
         <line x1="23" y1="9" x2="17" y2="15"></line>
         <line x1="17" y1="9" x2="23" y2="15"></line>
       </svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
         <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
         <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
       </svg>`;
}

function toggleFullscreen() {
  const player = document.getElementById('videoPlayerModal');
  
  if (!currentPlayerState.isFullscreen) {
    if (player.requestFullscreen) {
      player.requestFullscreen();
    } else if (player.webkitRequestFullscreen) {
      player.webkitRequestFullscreen();
    } else if (player.mozRequestFullScreen) {
      player.mozRequestFullScreen();
    } else if (player.msRequestFullscreen) {
      player.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

function toggleSettings() {
  const settingsPanel = document.getElementById('settingsPanel');
  const isVisible = settingsPanel.style.display !== 'none';
  settingsPanel.style.display = isVisible ? 'none' : 'block';
}

async function changeSeason() {
  const seasonSelect = document.getElementById('seasonSelect');
  const newSeason = parseInt(seasonSelect.value);
  
  if (newSeason !== currentSeason) {
    console.log('📺 Changing to season:', newSeason);
    currentSeason = newSeason;
    currentEpisode = 1;
    
    await loadSeasonDetails(newSeason);
    populateEpisodeSelector();
    updatePlayerTitle();
    changeServer();
  }
}

async function changeEpisode() {
  const episodeSelect = document.getElementById('episodeSelect');
  const newEpisode = parseInt(episodeSelect.value);
  
  if (newEpisode !== currentEpisode) {
    console.log('📺 Changing to episode:', newEpisode);
    currentEpisode = newEpisode;
    updatePlayerTitle();
    changeServer();
  }
}

function navigateEpisode(direction) {
  if (currentPlayerState.type !== 'tv' && currentPlayerState.type !== 'anime') {
    return;
  }
  
  const maxEpisodes = currentPlayerState.availableEpisodes.length;
  
  let newEpisode;
  if (direction === 'next') {
    newEpisode = currentEpisode < maxEpisodes ? currentEpisode + 1 : currentEpisode;
  } else {
    newEpisode = currentEpisode > 1 ? currentEpisode - 1 : currentEpisode;
  }
  
  if (newEpisode !== currentEpisode) {
    const episodeSelect = document.getElementById('episodeSelect');
    episodeSelect.value = newEpisode;
    changeEpisode();
  }
}

function closeVideoPlayer() {
  const playerModal = document.getElementById('videoPlayerModal');
  playerModal.style.display = 'none';
  
  // Clear video source
  const videoFrame = document.getElementById('videoFrame');
  videoFrame.src = '';
  
  // Reset global variables
  currentItem = null;
  currentSeason = 1;
  currentEpisode = 1;
  
  // Reset player state
  currentPlayerState = {
    content: null,
    type: null,
    season: 1,
    episode: 1,
    currentServer: 'vidsrc-pro',
    sources: [],
    currentSourceIndex: 0,
    isPlaying: false,
    isMuted: false,
    isFullscreen: false,
    volume: 100,
    showControls: true,
    controlsTimeout: null,
    tvDetails: null,
    seasonDetails: null,
    availableSeasons: [],
    availableEpisodes: [],
    retryCount: 0
  };
  
  // Remove keyboard event listener
  document.removeEventListener('keydown', handleKeyboardShortcuts);
  
  // Enable body scroll
  document.body.style.overflow = 'auto';
  
  // Exit fullscreen if active
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
}

// ========================================
// 🎬 PLAYER LAUNCH FUNCTIONS
// ========================================

function playContent(content, type, season = null, episode = null) {
  console.log('🎬 Playing content with FREE sources:', { content, type, season, episode });
  initializeVideoPlayer(content, type, season, episode);
}

function playMovie(movie) {
  playContent(movie, 'movie');
}

function playTVShow(tvShow, season = 1, episode = 1) {
  playContent(tvShow, 'tv', season, episode);
}

function playAnime(anime, episode = 1) {
  playContent(anime, 'anime', null, episode);
}

// Export player functions to global scope
window.playContent = playContent;
window.playMovie = playMovie;
window.playTVShow = playTVShow;
window.playAnime = playAnime;
window.closeVideoPlayer = closeVideoPlayer;
window.togglePlay = togglePlay;
window.toggleMute = toggleMute;
window.toggleFullscreen = toggleFullscreen;
window.toggleSettings = toggleSettings;
window.changeServer = changeServer;
window.changeSeason = changeSeason;
window.changeEpisode = changeEpisode;
window.retryCurrentSource = retryCurrentSource;
window.switchToNextServer = switchToNextServer;
window.testYouTubePlayer = testYouTubePlayer;

console.log('🆓 ZetFlix player.js loaded with FREE working video sources!');