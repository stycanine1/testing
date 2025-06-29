/**
 * ========================================
 * ZETFLIX VIDEO PLAYER
 * ========================================
 * 
 * Enhanced video player with TMDB integration and FREE streaming sources
 */

// ========================================
// 🎬 PLAYER STATE MANAGEMENT
// ========================================

let playerState = {
  currentContent: null,
  currentServer: 'vidsrc-pro',
  currentSeason: 1,
  currentEpisode: 1,
  isPlaying: false,
  autoplayTimer: null,
  autoplayCountdown: 10,
  playerSettings: {
    volume: 100,
    quality: 'HD',
    speed: 1,
    autoplay: true,
    autoplayNext: true
  }
};

// ========================================
// 🎥 MAIN PLAYER FUNCTIONS
// ========================================

function playContent(content, type, season = 1, episode = 1) {
  console.log('🎬 Playing content:', { content, type, season, episode });
  
  // Store current content
  playerState.currentContent = content;
  playerState.currentSeason = season || 1;
  playerState.currentEpisode = episode || 1;
  
  // Show video player modal
  showVideoPlayer();
  
  // Set up player header
  setupPlayerHeader(content, type);
  
  // Set up server selector
  setupServerSelector(type);
  
  // Set up episode selector for TV shows
  if (type === 'tv' || type === 'anime') {
    setupEpisodeSelector(content, type);
  } else {
    hideEpisodeSelector();
  }
  
  // Load initial video
  loadVideo();
  
  // Initialize player controls
  initializePlayerControls();
}

function showVideoPlayer() {
  const playerModal = document.getElementById('videoPlayerModal');
  if (!playerModal) {
    console.error('Video player modal not found');
    return;
  }
  
  playerModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Show loading overlay
  const loadingOverlay = document.getElementById('loadingOverlay');
  const errorOverlay = document.getElementById('errorOverlay');
  
  if (loadingOverlay) loadingOverlay.style.display = 'flex';
  if (errorOverlay) errorOverlay.style.display = 'none';
}

function hideVideoPlayer() {
  const playerModal = document.getElementById('videoPlayerModal');
  if (playerModal) {
    playerModal.style.display = 'none';
  }
  
  document.body.style.overflow = 'auto';
  
  // Clear video source
  const videoFrame = document.getElementById('videoFrame');
  if (videoFrame) {
    videoFrame.src = '';
  }
  
  // Clear autoplay timer
  clearAutoplayTimer();
  
  // Reset player state
  playerState.currentContent = null;
  playerState.isPlaying = false;
}

function setupPlayerHeader(content, type) {
  const playerTitle = document.querySelector('.player-title h1');
  const watchingLabel = document.querySelector('.watching-label');
  
  if (!playerTitle || !watchingLabel) return;
  
  const title = getContentTitle(content, type);
  
  if (type === 'tv') {
    watchingLabel.textContent = 'Now Watching';
    playerTitle.textContent = `${title} - S${playerState.currentSeason}E${playerState.currentEpisode}`;
  } else if (type === 'anime') {
    watchingLabel.textContent = 'Now Watching';
    playerTitle.textContent = `${title} - Episode ${playerState.currentEpisode}`;
  } else {
    watchingLabel.textContent = 'Now Watching';
    playerTitle.textContent = title;
  }
}

function getContentTitle(content, type) {
  if (type === 'anime') {
    return AniListService.getAnimeTitle(content);
  }
  return content.title || content.name || 'Unknown Title';
}

// ========================================
// 🖥️ SERVER MANAGEMENT
// ========================================

function setupServerSelector(type) {
  const serverSelect = document.getElementById('serverSelect');
  if (!serverSelect) return;
  
  const availableServers = StreamingService.getAvailableServers(type);
  
  serverSelect.innerHTML = availableServers.map(server => `
    <option value="${server.id}" ${server.id === playerState.currentServer ? 'selected' : ''}>
      ${server.name} ${server.tags.includes('RECOMMENDED') ? '⭐' : ''} 
      ${server.tags.includes('FREE') ? '🆓' : ''}
    </option>
  `).join('');
  
  // Set current server if not already set
  if (availableServers.length > 0 && !playerState.currentServer) {
    playerState.currentServer = availableServers[0].id;
  }
}

function changeServer() {
  const serverSelect = document.getElementById('serverSelect');
  if (!serverSelect) return;
  
  playerState.currentServer = serverSelect.value;
  console.log('🔄 Changing server to:', playerState.currentServer);
  
  loadVideo();
}

// ========================================
// 📺 EPISODE MANAGEMENT
// ========================================

function setupEpisodeSelector(content, type) {
  const episodeSelector = document.getElementById('episodeSelector');
  if (!episodeSelector) return;
  
  episodeSelector.style.display = 'flex';
  
  if (type === 'tv') {
    setupTVEpisodeSelector(content);
  } else if (type === 'anime') {
    setupAnimeEpisodeSelector(content);
  }
}

function setupTVEpisodeSelector(content) {
  const seasonSelect = document.getElementById('seasonSelect');
  const episodeSelect = document.getElementById('episodeSelect');
  
  if (!seasonSelect || !episodeSelect) return;
  
  // For now, assume basic season/episode structure
  // In a real implementation, you'd fetch this from TMDB API
  const maxSeasons = content.number_of_seasons || 5;
  const maxEpisodes = 20; // Default episodes per season
  
  // Populate seasons
  seasonSelect.innerHTML = '';
  for (let i = 1; i <= maxSeasons; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Season ${i}`;
    option.selected = i === playerState.currentSeason;
    seasonSelect.appendChild(option);
  }
  
  // Populate episodes
  populateEpisodes(maxEpisodes);
}

function setupAnimeEpisodeSelector(content) {
  const seasonSelect = document.getElementById('seasonSelect');
  const episodeSelect = document.getElementById('episodeSelect');
  
  if (!seasonSelect || !episodeSelect) return;
  
  // Hide season selector for anime (most anime don't have traditional seasons)
  seasonSelect.style.display = 'none';
  
  // Populate episodes
  const maxEpisodes = content.episodes || 24;
  populateEpisodes(maxEpisodes);
}

function populateEpisodes(maxEpisodes) {
  const episodeSelect = document.getElementById('episodeSelect');
  if (!episodeSelect) return;
  
  episodeSelect.innerHTML = '';
  for (let i = 1; i <= maxEpisodes; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Episode ${i}`;
    option.selected = i === playerState.currentEpisode;
    episodeSelect.appendChild(option);
  }
}

function hideEpisodeSelector() {
  const episodeSelector = document.getElementById('episodeSelector');
  if (episodeSelector) {
    episodeSelector.style.display = 'none';
  }
}

function changeSeason() {
  const seasonSelect = document.getElementById('seasonSelect');
  if (!seasonSelect) return;
  
  playerState.currentSeason = parseInt(seasonSelect.value);
  playerState.currentEpisode = 1; // Reset to first episode
  
  // Update episode selector
  const episodeSelect = document.getElementById('episodeSelect');
  if (episodeSelect) {
    episodeSelect.value = 1;
  }
  
  // Update player header
  const content = playerState.currentContent;
  const type = getContentType(content);
  setupPlayerHeader(content, type);
  
  // Load new video
  loadVideo();
}

function changeEpisode() {
  const episodeSelect = document.getElementById('episodeSelect');
  if (!episodeSelect) return;
  
  playerState.currentEpisode = parseInt(episodeSelect.value);
  
  // Update player header
  const content = playerState.currentContent;
  const type = getContentType(content);
  setupPlayerHeader(content, type);
  
  // Load new video
  loadVideo();
  
  // Set up autoplay for next episode
  setupAutoplayNext();
}

function getContentType(content) {
  if (content.mal_id) return 'anime';
  if (content.title) return 'movie';
  return 'tv';
}

// ========================================
// 🎬 VIDEO LOADING
// ========================================

function loadVideo() {
  const content = playerState.currentContent;
  if (!content) return;
  
  const type = getContentType(content);
  const videoFrame = document.getElementById('videoFrame');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const errorOverlay = document.getElementById('errorOverlay');
  
  if (!videoFrame) return;
  
  // Show loading
  if (loadingOverlay) loadingOverlay.style.display = 'flex';
  if (errorOverlay) errorOverlay.style.display = 'none';
  
  try {
    const streamingUrl = generateStreamingUrl(content, type);
    console.log('🎥 Loading video:', streamingUrl);
    
    videoFrame.src = streamingUrl;
    
    // Handle load events
    videoFrame.onload = () => {
      if (loadingOverlay) loadingOverlay.style.display = 'none';
      playerState.isPlaying = true;
      console.log('✅ Video loaded successfully');
    };
    
    videoFrame.onerror = () => {
      console.error('❌ Failed to load video');
      handleVideoError();
    };
    
    // Timeout fallback
    setTimeout(() => {
      if (loadingOverlay && loadingOverlay.style.display === 'flex') {
        console.warn('⚠️ Video loading timeout');
        handleVideoError();
      }
    }, 15000);
    
  } catch (error) {
    console.error('Error generating streaming URL:', error);
    handleVideoError();
  }
}

function generateStreamingUrl(content, type) {
  try {
    if (type === 'anime') {
      const title = AniListService.getAnimeTitle(content);
      return StreamingService.generateAnimeStreamingUrl(
        playerState.currentServer,
        title,
        playerState.currentEpisode
      );
    } else {
      return StreamingService.generateStreamingUrl(
        playerState.currentServer,
        content.id,
        type,
        playerState.currentSeason,
        playerState.currentEpisode
      );
    }
  } catch (error) {
    console.error('Error generating streaming URL:', error);
    throw error;
  }
}

function handleVideoError() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const errorOverlay = document.getElementById('errorOverlay');
  
  if (loadingOverlay) loadingOverlay.style.display = 'none';
  if (errorOverlay) {
    errorOverlay.style.display = 'flex';
    
    // Try next server automatically
    const availableServers = StreamingService.getAvailableServers(getContentType(playerState.currentContent));
    const currentIndex = availableServers.findIndex(s => s.id === playerState.currentServer);
    
    if (currentIndex < availableServers.length - 1) {
      const nextServer = availableServers[currentIndex + 1];
      console.log('🔄 Trying next server:', nextServer.name);
      
      playerState.currentServer = nextServer.id;
      
      // Update server selector
      const serverSelect = document.getElementById('serverSelect');
      if (serverSelect) {
        serverSelect.value = nextServer.id;
      }
      
      // Retry loading
      setTimeout(() => {
        loadVideo();
      }, 2000);
    }
  }
}

// ========================================
// ⏭️ AUTOPLAY FUNCTIONALITY
// ========================================

function setupAutoplayNext() {
  if (!playerState.playerSettings.autoplayNext) return;
  
  const content = playerState.currentContent;
  const type = getContentType(content);
  
  if (type === 'movie') return; // No autoplay for movies
  
  clearAutoplayTimer();
  
  const episodeSelect = document.getElementById('episodeSelect');
  if (!episodeSelect) return;
  
  const currentEpisodeIndex = Array.from(episodeSelect.options).findIndex(
    opt => parseInt(opt.value) === playerState.currentEpisode
  );
  
  if (currentEpisodeIndex < episodeSelect.options.length - 1) {
    startAutoplayCountdown();
  }
}

function startAutoplayCountdown() {
  let countdown = playerState.autoplayCountdown;
  
  // Show autoplay timer (you'll need to add this to your HTML)
  showAutoplayTimer(countdown);
  
  playerState.autoplayTimer = setInterval(() => {
    countdown--;
    updateAutoplayTimer(countdown);
    
    if (countdown <= 0) {
      clearAutoplayTimer();
      playNextEpisode();
    }
  }, 1000);
}

function showAutoplayTimer(countdown) {
  // This would show a countdown overlay
  console.log(`⏭️ Next episode in ${countdown} seconds...`);
}

function updateAutoplayTimer(countdown) {
  console.log(`⏭️ Next episode in ${countdown} seconds...`);
}

function clearAutoplayTimer() {
  if (playerState.autoplayTimer) {
    clearInterval(playerState.autoplayTimer);
    playerState.autoplayTimer = null;
  }
  hideAutoplayTimer();
}

function hideAutoplayTimer() {
  // Hide the autoplay timer overlay
}

function playNextEpisode() {
  const episodeSelect = document.getElementById('episodeSelect');
  if (!episodeSelect) return;
  
  const nextEpisode = playerState.currentEpisode + 1;
  const maxEpisodes = episodeSelect.options.length;
  
  if (nextEpisode <= maxEpisodes) {
    playerState.currentEpisode = nextEpisode;
    episodeSelect.value = nextEpisode;
    
    // Update player header
    const content = playerState.currentContent;
    const type = getContentType(content);
    setupPlayerHeader(content, type);
    
    // Load next episode
    loadVideo();
    
    // Set up autoplay for the episode after next
    setupAutoplayNext();
  }
}

// ========================================
// 🎛️ PLAYER CONTROLS
// ========================================

function initializePlayerControls() {
  // Close button
  const closeBtn = document.querySelector('.video-close-btn');
  if (closeBtn) {
    closeBtn.onclick = hideVideoPlayer;
  }
  
  // Server selector
  const serverSelect = document.getElementById('serverSelect');
  if (serverSelect) {
    serverSelect.onchange = changeServer;
  }
  
  // Season selector
  const seasonSelect = document.getElementById('seasonSelect');
  if (seasonSelect) {
    seasonSelect.onchange = changeSeason;
  }
  
  // Episode selector
  const episodeSelect = document.getElementById('episodeSelect');
  if (episodeSelect) {
    episodeSelect.onchange = changeEpisode;
  }
  
  // Settings button
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.onclick = toggleSettings;
  }
  
  // Fullscreen button
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  if (fullscreenBtn) {
    fullscreenBtn.onclick = toggleFullscreen;
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

function toggleSettings() {
  const settingsPanel = document.getElementById('settingsPanel');
  if (!settingsPanel) return;
  
  const isVisible = settingsPanel.style.display === 'block';
  settingsPanel.style.display = isVisible ? 'none' : 'block';
}

function toggleFullscreen() {
  const playerModal = document.getElementById('videoPlayerModal');
  if (!playerModal) return;
  
  if (!document.fullscreenElement) {
    playerModal.requestFullscreen().catch(err => {
      console.error('Error attempting to enable fullscreen:', err);
    });
  } else {
    document.exitFullscreen();
  }
}

function handleKeyboardShortcuts(event) {
  if (!playerState.currentContent) return;
  
  switch (event.key) {
    case 'Escape':
      hideVideoPlayer();
      break;
    case 'f':
    case 'F':
      toggleFullscreen();
      break;
    case ' ':
      event.preventDefault();
      // Toggle play/pause (if supported by iframe)
      break;
    case 'ArrowRight':
      if (getContentType(playerState.currentContent) !== 'movie') {
        playNextEpisode();
      }
      break;
    case 'ArrowLeft':
      if (getContentType(playerState.currentContent) !== 'movie' && playerState.currentEpisode > 1) {
        playerState.currentEpisode--;
        const episodeSelect = document.getElementById('episodeSelect');
        if (episodeSelect) {
          episodeSelect.value = playerState.currentEpisode;
          changeEpisode();
        }
      }
      break;
  }
}

// ========================================
// 🧪 TEST FUNCTIONS
// ========================================

function testYouTubePlayer() {
  console.log('🧪 Testing YouTube player...');
  
  const testContent = {
    id: 'test',
    title: 'YouTube Test Video',
    overview: 'Testing YouTube video playback'
  };
  
  // Override server for test
  playerState.currentServer = 'youtube-trailers';
  
  playContent(testContent, 'movie');
  
  // Load a specific YouTube video for testing
  setTimeout(() => {
    const videoFrame = document.getElementById('videoFrame');
    if (videoFrame) {
      videoFrame.src = 'https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&controls=1&rel=0';
    }
  }, 1000);
}

// ========================================
// 🌐 GLOBAL EXPORTS
// ========================================

// Export functions to global scope
window.playContent = playContent;
window.hideVideoPlayer = hideVideoPlayer;
window.changeServer = changeServer;
window.changeSeason = changeSeason;
window.changeEpisode = changeEpisode;
window.toggleSettings = toggleSettings;
window.toggleFullscreen = toggleFullscreen;
window.testYouTubePlayer = testYouTubePlayer;
window.clearAutoplayTimer = clearAutoplayTimer;

console.log('🎬 ZetFlix player.js loaded successfully');