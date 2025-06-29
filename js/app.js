/**
 * ========================================
 * ZETFLIX MAIN APPLICATION
 * ========================================
 * 
 * Simplified implementation based on working reference
 */

// ========================================
// 🔧 APPLICATION STATE
// ========================================

let appState = {
  currentSection: 'home',
  currentContent: null,
  searchQuery: '',
  selectedGenre: null,
  isLoading: true,
  
  // Content data
  trendingMovies: [],
  trendingTVShows: [],
  popularMovies: [],
  popularTVShows: [],
  topRatedMovies: [],
  topRatedTVShows: [],
  upcomingMovies: [],
  nowPlayingMovies: [],
  seasonalAnime: [],
  
  // Metadata
  genres: [],
  animeGenres: [],
  
  // Search and filter results
  searchResults: [],
  genreContent: []
};

// ========================================
// 🚀 APPLICATION INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🆓 ZetFlix application starting...');
  
  // Initialize header scroll effect
  initializeHeaderScroll();
  
  // Load initial content
  await loadInitialContent();
  
  // Hide loading screen and show main content
  hideLoadingScreen();
  
  // Initialize search functionality
  initializeSearch();
  
  console.log('🆓 ZetFlix application ready!');
});

function initializeHeaderScroll() {
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

async function loadInitialContent() {
  try {
    console.log('Loading initial content...');
    
    // Load essential content first
    const essentialPromises = [
      TMDBService.getTrendingMovies().catch(() => ({ results: [] })),
      TMDBService.getTrendingTVShows().catch(() => ({ results: [] })),
      TMDBService.getPopularMovies().catch(() => ({ results: [] })),
      TMDBService.getPopularTVShows().catch(() => ({ results: [] })),
      TMDBService.getMovieGenres().catch(() => ({ genres: [] })),
      TMDBService.getTVGenres().catch(() => ({ genres: [] }))
    ];
    
    const [
      trendingMoviesRes,
      trendingTVShowsRes,
      popularMoviesRes,
      popularTVShowsRes,
      movieGenresRes,
      tvGenresRes
    ] = await Promise.allSettled(essentialPromises.map(p => 
      Promise.race([p, new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 8000)
      )])
    ));
    
    // Process results
    if (trendingMoviesRes.status === 'fulfilled') {
      appState.trendingMovies = trendingMoviesRes.value.results || [];
    }
    if (trendingTVShowsRes.status === 'fulfilled') {
      appState.trendingTVShows = trendingTVShowsRes.value.results || [];
    }
    if (popularMoviesRes.status === 'fulfilled') {
      appState.popularMovies = popularMoviesRes.value.results || [];
    }
    if (popularTVShowsRes.status === 'fulfilled') {
      appState.popularTVShows = popularTVShowsRes.value.results || [];
    }
    
    // Process genres
    const allGenres = [];
    if (movieGenresRes.status === 'fulfilled') {
      allGenres.push(...(movieGenresRes.value.genres || []));
    }
    if (tvGenresRes.status === 'fulfilled') {
      allGenres.push(...(tvGenresRes.value.genres || []));
    }
    
    appState.genres = allGenres.filter((genre, index, self) => 
      index === self.findIndex(g => g.id === genre.id)
    );
    
    // Load anime content
    try {
      const animeRes = await AniListService.getTrendingAnime(1, 20);
      appState.seasonalAnime = animeRes.data || [];
      appState.animeGenres = AniListService.getAnimeGenres().data || [];
    } catch (error) {
      console.warn('Failed to load anime content:', error);
      appState.seasonalAnime = [];
      appState.animeGenres = GENRE_MAPPINGS.ANIME;
    }
    
    // Load additional content in background
    loadAdditionalContent();
    
    // Populate genres dropdown
    populateGenresDropdown();
    
    // Set up hero content
    setupHeroContent();
    
    // Render initial content
    renderContent();
    
    console.log('Initial content loaded successfully');
    
  } catch (error) {
    console.error('Error loading initial content:', error);
    showErrorMessage('Failed to load content. Please refresh the page.');
  }
}

async function loadAdditionalContent() {
  try {
    const additionalPromises = [
      TMDBService.getTopRatedMovies().catch(() => ({ results: [] })),
      TMDBService.getTopRatedTVShows().catch(() => ({ results: [] })),
      TMDBService.getUpcomingMovies().catch(() => ({ results: [] })),
      TMDBService.getNowPlayingMovies().catch(() => ({ results: [] }))
    ];
    
    const [
      topRatedMoviesRes,
      topRatedTVShowsRes,
      upcomingMoviesRes,
      nowPlayingMoviesRes
    ] = await Promise.allSettled(additionalPromises);
    
    if (topRatedMoviesRes.status === 'fulfilled') {
      appState.topRatedMovies = topRatedMoviesRes.value.results || [];
    }
    if (topRatedTVShowsRes.status === 'fulfilled') {
      appState.topRatedTVShows = topRatedTVShowsRes.value.results || [];
    }
    if (upcomingMoviesRes.status === 'fulfilled') {
      appState.upcomingMovies = upcomingMoviesRes.value.results || [];
    }
    if (nowPlayingMoviesRes.status === 'fulfilled') {
      appState.nowPlayingMovies = nowPlayingMoviesRes.value.results || [];
    }
    
    // Re-render content with additional data
    if (appState.currentSection === 'home') {
      renderContent();
    }
    
    console.log('Additional content loaded');
  } catch (error) {
    console.warn('Error loading additional content:', error);
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  
  loadingScreen.style.display = 'none';
  mainContent.style.display = 'block';
  appState.isLoading = false;
}

function showErrorMessage(message) {
  console.error(message);
}

// ========================================
// 🎬 HERO SECTION
// ========================================

function setupHeroContent() {
  const allContent = [
    ...appState.trendingMovies,
    ...appState.trendingTVShows,
    ...appState.popularMovies,
    ...appState.popularTVShows
  ];
  
  if (allContent.length === 0) return;
  
  const heroContent = allContent[0];
  const heroSection = document.getElementById('heroSection');
  
  if (!heroContent || appState.currentSection !== 'home') {
    heroSection.style.display = 'none';
    return;
  }
  
  heroSection.style.display = 'block';
  
  // Update hero content
  const heroImage = document.getElementById('heroImage');
  const heroTitle = document.getElementById('heroTitle');
  const heroRating = document.getElementById('heroRating');
  const heroYear = document.getElementById('heroYear');
  const heroOverview = document.getElementById('heroOverview');
  
  const title = heroContent.title || heroContent.name;
  const releaseDate = heroContent.release_date || heroContent.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  
  heroImage.src = TMDBService.getBackdropUrl(heroContent.backdrop_path, 'original');
  heroImage.alt = title;
  heroTitle.textContent = title;
  heroRating.textContent = heroContent.vote_average.toFixed(1);
  heroYear.textContent = year;
  heroOverview.textContent = heroContent.overview;
  
  // Store hero content for play button
  appState.currentContent = heroContent;
}

function playHeroContent() {
  if (!appState.currentContent) return;
  
  const content = appState.currentContent;
  content.media_type = content.title ? 'movie' : 'tv';
  
  openPlayerModal(content);
}

function showHeroInfo() {
  if (!appState.currentContent) return;
  
  showContentModal(appState.currentContent);
}

// ========================================
// 🧭 NAVIGATION
// ========================================

function showSection(sectionName) {
  console.log('Showing section:', sectionName);
  
  // Update navigation state
  appState.currentSection = sectionName;
  
  // Update navigation buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.section === sectionName) {
      btn.classList.add('active');
    }
  });
  
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const targetSection = document.getElementById(`${sectionName}Section`);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Update hero visibility
  const heroSection = document.getElementById('heroSection');
  if (sectionName === 'home') {
    heroSection.style.display = 'block';
    setupHeroContent();
  } else {
    heroSection.style.display = 'none';
  }
  
  // Render content for the section
  renderContent();
}

function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const isVisible = mobileMenu.style.display === 'block';
  mobileMenu.style.display = isVisible ? 'none' : 'block';
}

// ========================================
// 🔍 SEARCH FUNCTIONALITY
// ========================================

function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  let searchTimeout;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length >= 2) {
      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 300);
    } else {
      hideSearchSuggestions();
    }
  });
  
  searchInput.addEventListener('blur', () => {
    setTimeout(hideSearchSuggestions, 200);
  });
}

async function performSearch(query) {
  try {
    console.log('Searching for:', query);
    
    const [tmdbResults, animeResults] = await Promise.allSettled([
      TMDBService.searchMulti(query),
      AniListService.searchAnime(query, 1, 5)
    ]);
    
    const suggestions = [];
    
    // Process TMDB results
    if (tmdbResults.status === 'fulfilled' && tmdbResults.value.results) {
      const tmdbSuggestions = tmdbResults.value.results
        .slice(0, 6)
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .map(item => ({
          id: item.id,
          title: item.title || item.name,
          type: item.media_type,
          year: item.release_date ? new Date(item.release_date).getFullYear() : 
                item.first_air_date ? new Date(item.first_air_date).getFullYear() : null,
          rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
          poster: item.poster_path ? TMDBService.getPosterUrl(item.poster_path, 'w92') : null,
          data: item
        }));
      suggestions.push(...tmdbSuggestions);
    }
    
    // Process Anime results
    if (animeResults.status === 'fulfilled' && animeResults.value.data) {
      const animeSuggestions = animeResults.value.data
        .slice(0, 4)
        .map(anime => ({
          id: anime.mal_id,
          title: AniListService.getAnimeTitle(anime),
          type: 'anime',
          year: anime.year,
          rating: anime.score ? Math.round(anime.score * 10) / 10 : null,
          poster: AniListService.getAnimeImageUrl(anime, 'small'),
          data: anime
        }));
      suggestions.push(...animeSuggestions);
    }
    
    showSearchSuggestions(suggestions);
    
  } catch (error) {
    console.error('Search error:', error);
    hideSearchSuggestions();
  }
}

function showSearchSuggestions(suggestions) {
  const suggestionsContainer = document.getElementById('searchSuggestions');
  
  if (suggestions.length === 0) {
    suggestionsContainer.innerHTML = '<div class="suggestion-item">No results found</div>';
  } else {
    suggestionsContainer.innerHTML = suggestions.map(suggestion => `
      <div class="suggestion-item" onclick="selectSearchSuggestion(${JSON.stringify(suggestion).replace(/"/g, '"')})">
        <div class="suggestion-poster">
          ${suggestion.poster ? `<img src="${suggestion.poster}" alt="${suggestion.title}">` : ''}
        </div>
        <div class="suggestion-info">
          <div class="suggestion-title">${suggestion.title}</div>
          <div class="suggestion-meta">
            ${suggestion.year ? `<span>${suggestion.year}</span>` : ''}
            <span class="suggestion-badge ${suggestion.type}">${suggestion.type.toUpperCase()}</span>
            ${suggestion.rating ? `<span>★ ${suggestion.rating}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }
  
  suggestionsContainer.style.display = 'block';
}

function hideSearchSuggestions() {
  const suggestionsContainer = document.getElementById('searchSuggestions');
  suggestionsContainer.style.display = 'none';
}

function selectSearchSuggestion(suggestion) {
  console.log('Selected suggestion:', suggestion);
  hideSearchSuggestions();
  closeSearch();
  showContentModal(suggestion.data);
}

function handleSearch(event) {
  if (event.key === 'Enter') {
    const query = event.target.value.trim();
    if (query) {
      performFullSearch(query);
    }
  }
}

async function performFullSearch(query) {
  try {
    console.log('Performing full search for:', query);
    
    appState.searchQuery = query;
    
    const [tmdbResults, animeResults] = await Promise.allSettled([
      TMDBService.searchMulti(query),
      AniListService.searchAnime(query, 1, 20)
    ]);
    
    const searchResults = [];
    
    // Process TMDB results
    if (tmdbResults.status === 'fulfilled' && tmdbResults.value.results) {
      const tmdbItems = tmdbResults.value.results
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv');
      searchResults.push(...tmdbItems);
    }
    
    // Process Anime results
    if (animeResults.status === 'fulfilled' && animeResults.value.data) {
      searchResults.push(...animeResults.value.data);
    }
    
    appState.searchResults = searchResults;
    
    // Show search section
    showSection('search');
    
    // Update search results text
    const searchResultsText = document.getElementById('searchResultsText');
    searchResultsText.textContent = `Found ${searchResults.length} results for "${query}"`;
    
    // Render search results
    renderSearchResults();
    
    // Close search input
    closeSearch();
    
  } catch (error) {
    console.error('Full search error:', error);
    showErrorMessage('Search failed. Please try again.');
  }
}

function toggleSearch() {
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');
  
  if (searchContainer.style.display === 'none') {
    searchContainer.style.display = 'flex';
    searchInput.focus();
  } else {
    closeSearch();
  }
}

function closeSearch() {
  const searchContainer = document.getElementById('searchContainer');
  const searchInput = document.getElementById('searchInput');
  
  searchContainer.style.display = 'none';
  searchInput.value = '';
  hideSearchSuggestions();
}

// ========================================
// 🎭 GENRE FUNCTIONALITY
// ========================================

function populateGenresDropdown() {
  const genresDropdown = document.getElementById('genresDropdown');
  
  const currentGenres = appState.currentSection === 'anime' ? appState.animeGenres : appState.genres;
  
  genresDropdown.innerHTML = currentGenres.slice(0, 12).map(genre => `
    <button class="dropdown-item" onclick="selectGenre(${genre.id}, '${genre.name}')">
      ${genre.name}
    </button>
  `).join('');
}

async function selectGenre(genreId, genreName) {
  try {
    console.log('Selecting genre:', genreName);
    
    appState.selectedGenre = { id: genreId, name: genreName };
    
    let genreContent = [];
    
    if (appState.currentSection === 'anime') {
      const animeRes = await AniListService.getAnimeByGenre(genreName, 1, 20);
      genreContent = animeRes.data || [];
    } else {
      const [moviesRes, tvRes] = await Promise.allSettled([
        TMDBService.getMoviesByGenre(genreId),
        TMDBService.getTVShowsByGenre(genreId)
      ]);
      
      const movies = moviesRes.status === 'fulfilled' ? moviesRes.value.results || [] : [];
      const tvShows = tvRes.status === 'fulfilled' ? tvRes.value.results || [] : [];
      
      genreContent = [...movies, ...tvShows]
        .sort((a, b) => b.popularity - a.popularity);
    }
    
    appState.genreContent = genreContent;
    
    // Show genre section
    showSection('genre');
    
    // Update genre title
    const genreTitle = document.getElementById('genreTitle');
    const genreDescription = document.getElementById('genreDescription');
    genreTitle.textContent = `${genreName} ${appState.currentSection === 'anime' ? 'Anime' : 'Movies & Shows'}`;
    genreDescription.textContent = `Browse ${genreName.toLowerCase()} content`;
    
    // Render genre content
    renderGenreContent();
    
  } catch (error) {
    console.error('Genre selection error:', error);
    showErrorMessage('Failed to load genre content.');
  }
}

// ========================================
// 🎨 CONTENT RENDERING
// ========================================

function renderContent() {
  switch (appState.currentSection) {
    case 'home':
      renderHomeContent();
      break;
    case 'movies':
      renderMoviesContent();
      break;
    case 'tv':
      renderTVContent();
      break;
    case 'anime':
      renderAnimeContent();
      break;
    case 'search':
      renderSearchResults();
      break;
    case 'genre':
      renderGenreContent();
      break;
  }
}

function renderHomeContent() {
  const homeContent = document.getElementById('homeContent');
  
  const rows = [];
  
  // Trending content
  if (appState.trendingMovies.length > 0 || appState.trendingTVShows.length > 0) {
    const trendingContent = [...appState.trendingMovies, ...appState.trendingTVShows];
    rows.push(createContentRow('Trending Now', trendingContent));
  }
  
  // Popular movies
  if (appState.popularMovies.length > 0) {
    rows.push(createContentRow('Popular Movies', appState.popularMovies));
  }
  
  // Popular TV shows
  if (appState.popularTVShows.length > 0) {
    rows.push(createContentRow('Popular TV Shows', appState.popularTVShows));
  }
  
  // Trending anime
  if (appState.seasonalAnime.length > 0) {
    rows.push(createAnimeRow('Trending Anime', appState.seasonalAnime.slice(0, 10)));
  }
  
  // Top rated movies
  if (appState.topRatedMovies.length > 0) {
    rows.push(createContentRow('Top Rated Movies', appState.topRatedMovies));
  }
  
  // Top rated TV shows
  if (appState.topRatedTVShows.length > 0) {
    rows.push(createContentRow('Top Rated TV Shows', appState.topRatedTVShows));
  }
  
  // Upcoming movies
  if (appState.upcomingMovies.length > 0) {
    rows.push(createContentRow('Coming Soon', appState.upcomingMovies));
  }
  
  // Now playing movies
  if (appState.nowPlayingMovies.length > 0) {
    rows.push(createContentRow('Now Playing', appState.nowPlayingMovies));
  }
  
  homeContent.innerHTML = rows.join('');
}

function renderMoviesContent() {
  const moviesContent = document.getElementById('moviesContent');
  
  const rows = [];
  
  if (appState.trendingMovies.length > 0) {
    rows.push(createContentRow('Trending Movies', appState.trendingMovies));
  }
  
  if (appState.popularMovies.length > 0) {
    rows.push(createContentRow('Popular Movies', appState.popularMovies));
  }
  
  if (appState.topRatedMovies.length > 0) {
    rows.push(createContentRow('Top Rated Movies', appState.topRatedMovies));
  }
  
  if (appState.upcomingMovies.length > 0) {
    rows.push(createContentRow('Coming Soon', appState.upcomingMovies));
  }
  
  if (appState.nowPlayingMovies.length > 0) {
    rows.push(createContentRow('Now Playing', appState.nowPlayingMovies));
  }
  
  moviesContent.innerHTML = rows.join('');
}

function renderTVContent() {
  const tvContent = document.getElementById('tvContent');
  
  const rows = [];
  
  if (appState.trendingTVShows.length > 0) {
    rows.push(createContentRow('Trending TV Shows', appState.trendingTVShows));
  }
  
  if (appState.popularTVShows.length > 0) {
    rows.push(createContentRow('Popular TV Shows', appState.popularTVShows));
  }
  
  if (appState.topRatedTVShows.length > 0) {
    rows.push(createContentRow('Top Rated TV Shows', appState.topRatedTVShows));
  }
  
  tvContent.innerHTML = rows.join('');
}

function renderAnimeContent() {
  const animeContent = document.getElementById('animeContent');
  
  const rows = [];
  
  if (appState.seasonalAnime.length > 0) {
    rows.push(createAnimeRow('Trending Anime', appState.seasonalAnime));
  }
  
  animeContent.innerHTML = rows.join('');
}

function renderSearchResults() {
  const searchContent = document.getElementById('searchContent');
  
  if (appState.searchResults.length === 0) {
    searchContent.innerHTML = `
      <div class="text-center" style="padding: 4rem; color: var(--gray-400);">
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">No results found</h2>
        <p>Try searching for something else</p>
      </div>
    `;
    return;
  }
  
  // Separate results by type
  const movies = appState.searchResults.filter(item => item.title || item.media_type === 'movie');
  const tvShows = appState.searchResults.filter(item => (item.name && !item.mal_id) || item.media_type === 'tv');
  const anime = appState.searchResults.filter(item => item.mal_id);
  
  const rows = [];
  
  if (movies.length > 0) {
    rows.push(createContentRow('Movies', movies));
  }
  
  if (tvShows.length > 0) {
    rows.push(createContentRow('TV Shows', tvShows));
  }
  
  if (anime.length > 0) {
    rows.push(createAnimeRow('Anime', anime));
  }
  
  searchContent.innerHTML = rows.join('');
}

function renderGenreContent() {
  const genreContent = document.getElementById('genreContent');
  
  if (appState.genreContent.length === 0) {
    genreContent.innerHTML = `
      <div class="text-center" style="padding: 4rem; color: var(--gray-400);">
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">No content found</h2>
        <p>No content available for this genre</p>
      </div>
    `;
    return;
  }
  
  const genreName = appState.selectedGenre ? appState.selectedGenre.name : 'Genre';
  
  if (appState.currentSection === 'anime') {
    genreContent.innerHTML = createAnimeRow(`${genreName} Anime`, appState.genreContent);
  } else {
    genreContent.innerHTML = createContentRow(`${genreName} Content`, appState.genreContent);
  }
}

// ========================================
// 🎬 CONTENT ROW CREATION
// ========================================

function createContentRow(title, content) {
  if (!content || content.length === 0) return '';
  
  const items = content.map(item => createContentItem(item)).join('');
  
  return `
    <div class="content-row">
      <h2 class="content-row-title">${title}</h2>
      <div class="content-row-container">
        <button class="scroll-btn scroll-btn-left" onclick="scrollContentRow(this, 'left')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
        <div class="content-grid">
          ${items}
        </div>
        <button class="scroll-btn scroll-btn-right" onclick="scrollContentRow(this, 'right')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

function createAnimeRow(title, anime) {
  if (!anime || anime.length === 0) return '';
  
  const items = anime.map(item => createAnimeItem(item)).join('');
  
  return `
    <div class="content-row">
      <h2 class="content-row-title">${title}</h2>
      <div class="content-row-container">
        <button class="scroll-btn scroll-btn-left" onclick="scrollContentRow(this, 'left')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"/>
          </svg>
        </button>
        <div class="content-grid">
          ${items}
        </div>
        <button class="scroll-btn scroll-btn-right" onclick="scrollContentRow(this, 'right')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

function createContentItem(item) {
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const type = item.title ? 'movie' : 'tv';
  const posterUrl = TMDBService.getPosterUrl(item.poster_path);
  
  // Add media_type for player
  item.media_type = type;
  
  return `
    <div class="content-item" onclick="openPlayerModal(${JSON.stringify(item).replace(/"/g, '"')})">
      <div class="content-item-image">
        <img src="${posterUrl}" alt="${title}" loading="lazy">
        <div class="content-item-overlay">
          <svg class="content-item-play" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </div>
        <div class="content-item-rating">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          <span>${item.vote_average.toFixed(1)}</span>
        </div>
      </div>
      <div class="content-item-info">
        <h3 class="content-item-title">${title}</h3>
        <div class="content-item-meta">
          ${year ? `<span class="content-item-year">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${year}
          </span>` : ''}
          <span class="content-item-type">${type.toUpperCase()}</span>
        </div>
      </div>
    </div>
  `;
}

function createAnimeItem(item) {
  const title = AniListService.getAnimeTitle(item);
  const year = AniListService.getAnimeYear(item);
  const statusColor = AniListService.getAnimeStatusColor(item.status);
  const imageUrl = AniListService.getAnimeImageUrl(item, 'medium');
  
  // Add media_type for player
  item.media_type = 'tv';
  
  return `
    <div class="content-item" onclick="openPlayerModal(${JSON.stringify(item).replace(/"/g, '"')})">
      <div class="content-item-image">
        <img src="${imageUrl}" alt="${title}" loading="lazy">
        <div class="content-item-overlay">
          <svg class="content-item-play" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        </div>
        ${item.score ? `
          <div class="content-item-rating">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            <span>${item.score.toFixed(1)}</span>
          </div>
        ` : ''}
      </div>
      <div class="content-item-info">
        <h3 class="content-item-title">${title}</h3>
        <div class="content-item-meta">
          ${year ? `<span class="content-item-year">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${year}
          </span>` : ''}
          <span class="content-item-type anime">ANIME</span>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// 🎬 CONTENT MODAL
// ========================================

async function showContentModal(content) {
  console.log('Showing content modal:', content);
  
  const modal = document.getElementById('contentModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalRating = document.getElementById('modalRating');
  const modalYear = document.getElementById('modalYear');
  const modalOverview = document.getElementById('modalOverview');
  const modalGenres = document.getElementById('modalGenres');
  const modalSideInfo = document.getElementById('modalSideInfo');
  
  // Determine content type and details
  const isAnime = !!content.mal_id;
  const isMovie = !isAnime && (content.title || content.media_type === 'movie');
  const isTVShow = !isAnime && !isMovie;
  
  const title = isAnime ? AniListService.getAnimeTitle(content) : (content.title || content.name);
  const backdropUrl = isAnime ? 
    (content.bannerImage || AniListService.getAnimeImageUrl(content, 'large')) :
    TMDBService.getBackdropUrl(content.backdrop_path, 'w1280');
  const rating = isAnime ? content.score : content.vote_average;
  const year = isAnime ? 
    AniListService.getAnimeYear(content) :
    (content.release_date ? new Date(content.release_date).getFullYear() : 
     content.first_air_date ? new Date(content.first_air_date).getFullYear() : '');
  const overview = isAnime ? content.synopsis : content.overview;
  
  // Update modal content
  modalBackdrop.src = backdropUrl;
  modalTitle.textContent = title;
  modalRating.textContent = rating ? rating.toFixed(1) : 'N/A';
  modalYear.textContent = year || 'Unknown';
  modalOverview.textContent = overview || 'No description available.';
  
  // Update genres
  if (content.genres && content.genres.length > 0) {
    modalGenres.innerHTML = content.genres.map(genre => 
      `<span class="modal-genre">${genre.name}</span>`
    ).join('');
  } else {
    modalGenres.innerHTML = '';
  }
  
  // Store content for play button
  appState.currentContent = content;
  
  // Show modal
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeContentModal() {
  const modal = document.getElementById('contentModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  appState.currentContent = null;
}

function playModalContent() {
  if (!appState.currentContent) return;
  
  const content = appState.currentContent;
  const isAnime = !!content.mal_id;
  const isMovie = !isAnime && (content.title || content.media_type === 'movie');
  
  content.media_type = isAnime ? 'tv' : (isMovie ? 'movie' : 'tv');
  
  closeContentModal();
  openPlayerModal(content);
}

// ========================================
// 🎛️ UI UTILITIES
// ========================================

function scrollContentRow(button, direction) {
  const container = button.parentElement;
  const grid = container.querySelector('.content-grid');
  const scrollAmount = 320;
  
  if (direction === 'left') {
    grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

// ========================================
// 🌐 GLOBAL EXPORTS
// ========================================

// Export functions to global scope for HTML onclick handlers
window.showSection = showSection;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleSearch = toggleSearch;
window.closeSearch = closeSearch;
window.handleSearch = handleSearch;
window.selectSearchSuggestion = selectSearchSuggestion;
window.selectGenre = selectGenre;
window.showContentModal = showContentModal;
window.closeContentModal = closeContentModal;
window.playModalContent = playModalContent;
window.playHeroContent = playHeroContent;
window.showHeroInfo = showHeroInfo;
window.scrollContentRow = scrollContentRow;

console.log('🆓 ZetFlix app.js loaded successfully with simplified player');