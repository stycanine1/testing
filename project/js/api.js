/**
 * ========================================
 * ZETFLIX API SERVICE LAYER
 * ========================================
 * 
 * This file handles all API communications for movies, TV shows, and anime.
 * It provides a unified interface for fetching content from various sources.
 */

// ========================================
// 🔧 UTILITY FUNCTIONS
// ========================================

// Fetch with timeout and error handling
async function fetchWithTimeout(url, timeout = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Rate limiting helper
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 250; // 250ms between requests

async function rateLimitedFetch(url, timeout = 8000) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
  return fetchWithTimeout(url, timeout);
}

// ========================================
// 🎬 TMDB API SERVICE
// ========================================

const TMDBService = {
  // Get image URL
  getImageUrl: (path, size = 'w500') => {
    return path ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}` : '';
  },

  getBackdropUrl: (path, size = 'w1280') => {
    return path ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}` : '';
  },

  getPosterUrl: (path, size = 'w342') => {
    return path ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}` : '';
  },

  // Get trending movies
  getTrendingMovies: async () => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/trending/movie/week?api_key=${TMDB_CONFIG.API_KEY}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Get trending TV shows
  getTrendingTVShows: async () => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/trending/tv/week?api_key=${TMDB_CONFIG.API_KEY}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching trending TV shows:', error);
      throw error;
    }
  },

  // Get popular movies
  getPopularMovies: async () => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/movie/popular?api_key=${TMDB_CONFIG.API_KEY}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  // Get popular TV shows
  getPopularTVShows: async () => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/tv/popular?api_key=${TMDB_CONFIG.API_KEY}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  },

  // Get top rated movies
  getTopRatedMovies: async () => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/movie/top_rated?api_key=${TMDB_CONFIG.API_KEY}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  // Get top rated TV shows
  getTopRatedTVShows: async () => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/tv/top_rated?api_key=${TMDB_CONFIG.API_KEY}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching top rated TV shows:', error);
      throw error;
    }
  },

  // Get upcoming movies
  getUpcomingMovies: async () => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/movie/upcoming?api_key=${TMDB_CONFIG.API_KEY}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },

  // Get now playing movies
  getNowPlayingMovies: async () => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/movie/now_playing?api_key=${TMDB_CONFIG.API_KEY}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}&append_to_response=videos,credits`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Get TV show details
  getTVShowDetails: async (tvId) => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/tv/${tvId}?api_key=${TMDB_CONFIG.API_KEY}&append_to_response=videos,credits`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching TV show details:', error);
      throw error;
    }
  },

  // Get TV season details
  getTVSeasonDetails: async (tvId, seasonNumber) => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_CONFIG.API_KEY}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching TV season details:', error);
      throw error;
    }
  },

  // Search movies and TV shows
  searchMulti: async (query) => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/search/multi?api_key=${TMDB_CONFIG.API_KEY}&query=${encodeURIComponent(query)}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  },

  // Get movie genres
  getMovieGenres: async () => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/genre/movie/list?api_key=${TMDB_CONFIG.API_KEY}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching movie genres:', error);
      throw error;
    }
  },

  // Get TV genres
  getTVGenres: async () => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/genre/tv/list?api_key=${TMDB_CONFIG.API_KEY}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching TV genres:', error);
      throw error;
    }
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId) => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/discover/movie?api_key=${TMDB_CONFIG.API_KEY}&with_genres=${genreId}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      throw error;
    }
  },

  // Get TV shows by genre
  getTVShowsByGenre: async (genreId) => {
    try {
      const url = `${TMDB_CONFIG.BASE_URL}/discover/tv?api_key=${TMDB_CONFIG.API_KEY}&with_genres=${genreId}`;
      return await rateLimitedFetch(url);
    } catch (error) {
      console.error('Error fetching TV shows by genre:', error);
      throw error;
    }
  }
};

// ========================================
// 🎌 ANILIST API SERVICE
// ========================================

const AniListService = {
  // GraphQL queries
  QUERIES: {
    TRENDING_ANIME: `
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
          }
          media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) {
            id
            title {
              romaji
              english
              native
            }
            description
            coverImage {
              large
              medium
              color
            }
            bannerImage
            averageScore
            episodes
            status
            format
            startDate {
              year
              month
              day
            }
            genres
            studios {
              nodes {
                name
              }
            }
            popularity
            favourites
            source
            duration
            season
            seasonYear
          }
        }
      }
    `,

    SEARCH_ANIME: `
      query ($search: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
          }
          media(type: ANIME, search: $search) {
            id
            title {
              romaji
              english
              native
            }
            description
            coverImage {
              large
              medium
              color
            }
            bannerImage
            averageScore
            episodes
            status
            format
            startDate {
              year
              month
              day
            }
            genres
            studios {
              nodes {
                name
              }
            }
            popularity
            favourites
            source
            duration
            season
            seasonYear
          }
        }
      }
    `,

    ANIME_BY_GENRE: `
      query ($genre: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
          }
          media(type: ANIME, genre: $genre, sort: POPULARITY_DESC) {
            id
            title {
              romaji
              english
              native
            }
            description
            coverImage {
              large
              medium
              color
            }
            bannerImage
            averageScore
            episodes
            status
            format
            startDate {
              year
              month
              day
            }
            genres
            studios {
              nodes {
                name
              }
            }
            popularity
            favourites
            source
            duration
            season
            seasonYear
          }
        }
      }
    `
  },

  // Rate limited GraphQL fetch
  rateLimitedGraphQLFetch: async (query, variables = {}) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < 1000) { // 1 second for AniList
      const delay = 1000 - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    lastRequestTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ANILIST_CONFIG.TIMEOUT);

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        }),
        signal: controller.signal
      };

      const response = await fetch(ANILIST_CONFIG.API_URL, options);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL Error: ${data.errors.map(e => e.message).join(', ')}`);
      }
      
      return data.data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('AniList request timeout');
      }
      throw error;
    }
  },

  // Transform AniList data to our format
  transformAnime: (anilistAnime) => {
    return {
      mal_id: anilistAnime.id,
      id: anilistAnime.id,
      title: anilistAnime.title.english || anilistAnime.title.romaji || anilistAnime.title.native,
      title_english: anilistAnime.title.english,
      title_japanese: anilistAnime.title.native,
      title_romaji: anilistAnime.title.romaji,
      synopsis: anilistAnime.description?.replace(/<[^>]*>/g, '') || null,
      images: {
        jpg: {
          image_url: anilistAnime.coverImage?.medium || '',
          large_image_url: anilistAnime.coverImage?.large || '',
          small_image_url: anilistAnime.coverImage?.medium || ''
        }
      },
      bannerImage: anilistAnime.bannerImage,
      score: anilistAnime.averageScore ? anilistAnime.averageScore / 10 : null,
      episodes: anilistAnime.episodes,
      status: AniListService.transformStatus(anilistAnime.status),
      type: AniListService.transformFormat(anilistAnime.format),
      year: anilistAnime.startDate?.year || null,
      season: anilistAnime.season,
      genres: anilistAnime.genres?.map((genre, index) => ({
        mal_id: index + 1,
        name: genre
      })) || [],
      studios: anilistAnime.studios?.nodes?.map((studio, index) => ({
        mal_id: index + 1,
        name: studio.name
      })) || [],
      popularity: anilistAnime.popularity,
      favorites: anilistAnime.favourites,
      source: anilistAnime.source,
      duration: anilistAnime.duration ? `${anilistAnime.duration} min` : null
    };
  },

  // Transform status
  transformStatus: (status) => {
    switch (status) {
      case 'RELEASING': return 'Currently Airing';
      case 'FINISHED': return 'Finished Airing';
      case 'NOT_YET_RELEASED': return 'Not yet aired';
      case 'CANCELLED': return 'Cancelled';
      case 'HIATUS': return 'On Hiatus';
      default: return status;
    }
  },

  // Transform format
  transformFormat: (format) => {
    switch (format) {
      case 'TV': return 'TV';
      case 'TV_SHORT': return 'TV';
      case 'MOVIE': return 'Movie';
      case 'SPECIAL': return 'Special';
      case 'OVA': return 'OVA';
      case 'ONA': return 'ONA';
      case 'MUSIC': return 'Music';
      default: return format || 'Unknown';
    }
  },

  // Get trending anime
  getTrendingAnime: async (page = 1, perPage = 20) => {
    try {
      const data = await AniListService.rateLimitedGraphQLFetch(
        AniListService.QUERIES.TRENDING_ANIME, 
        { page, perPage }
      );
      return {
        data: data.Page.media.map(AniListService.transformAnime),
        pagination: data.Page.pageInfo
      };
    } catch (error) {
      console.warn('Failed to fetch trending anime from AniList:', error);
      throw error;
    }
  },

  // Search anime
  searchAnime: async (query, page = 1, perPage = 20) => {
    try {
      const data = await AniListService.rateLimitedGraphQLFetch(
        AniListService.QUERIES.SEARCH_ANIME, 
        { search: query, page, perPage }
      );
      return {
        data: data.Page.media.map(AniListService.transformAnime),
        pagination: data.Page.pageInfo
      };
    } catch (error) {
      console.warn('Failed to search anime on AniList:', error);
      throw error;
    }
  },

  // Get anime by genre
  getAnimeByGenre: async (genre, page = 1, perPage = 20) => {
    try {
      const data = await AniListService.rateLimitedGraphQLFetch(
        AniListService.QUERIES.ANIME_BY_GENRE, 
        { genre, page, perPage }
      );
      return {
        data: data.Page.media.map(AniListService.transformAnime),
        pagination: data.Page.pageInfo
      };
    } catch (error) {
      console.warn('Failed to fetch anime by genre from AniList:', error);
      throw error;
    }
  },

  // Get anime genres
  getAnimeGenres: () => {
    return {
      data: GENRE_MAPPINGS.ANIME
    };
  },

  // Helper methods
  getAnimeTitle: (anime) => {
    return anime.title_english || anime.title || anime.title_romaji || 'Unknown Title';
  },

  getAnimeYear: (anime) => {
    return anime.year;
  },

  getAnimeStatusColor: (status) => {
    switch (status?.toLowerCase()) {
      case 'currently airing': return 'color: #10B981;';
      case 'finished airing': return 'color: #3B82F6;';
      case 'not yet aired': return 'color: #F59E0B;';
      default: return 'color: #9CA3AF;';
    }
  },

  getAnimeImageUrl: (anime, size = 'medium') => {
    if (!anime.images?.jpg) return '';
    
    switch (size) {
      case 'small': return anime.images.jpg.small_image_url || anime.images.jpg.image_url || '';
      case 'large': return anime.images.jpg.large_image_url || anime.images.jpg.image_url || '';
      case 'medium':
      default: return anime.images.jpg.image_url || '';
    }
  }
};

// ========================================
// 🎥 STREAMING SERVICE
// ========================================

const StreamingService = {
  // Generate streaming URL for movies/TV shows
  generateStreamingUrl: (serverId, tmdbId, type, season, episode) => {
    const serverConfig = MOVIE_TV_STREAMING_CONFIG.SERVERS.find(s => s.id === serverId);
    if (!serverConfig) throw new Error(`Server ${serverId} not found`);

    const pattern = serverConfig.urlPattern[type];
    if (!pattern) throw new Error(`No URL pattern for ${type} on server ${serverId}`);

    return pattern
      .replace('{tmdbId}', tmdbId.toString())
      .replace('{season}', season?.toString() || '1')
      .replace('{episode}', episode?.toString() || '1');
  },

  // Generate anime streaming URL
  generateAnimeStreamingUrl: (serverId, animeTitle, episode) => {
    const serverConfig = ANIME_STREAMING_CONFIG.SERVERS.find(s => s.id === serverId);
    if (!serverConfig) throw new Error(`Server ${serverId} not found`);

    const cleanTitle = animeTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const pattern = serverConfig.urlPattern.embed || serverConfig.urlPattern.watch;
    if (!pattern) throw new Error(`No URL pattern for server ${serverId}`);

    return pattern
      .replace('{animeTitle}', cleanTitle)
      .replace('{episode}', episode.toString());
  },

  // Get available servers for content type
  getAvailableServers: (type = 'movie') => {
    if (type === 'anime') {
      return ANIME_STREAMING_CONFIG.SERVERS
        .filter(server => server.status === 'active')
        .sort((a, b) => b.priority - a.priority);
    } else {
      return MOVIE_TV_STREAMING_CONFIG.SERVERS
        .filter(server => server.status === 'active')
        .filter(server => type === 'movie' ? server.supportsMovies : server.supportsTVShows)
        .sort((a, b) => b.priority - a.priority);
    }
  },

  // Get streaming sources
  getStreamingSources: (content, type, season, episode) => {
    const sources = [];
    const availableServers = StreamingService.getAvailableServers(type);

    for (const server of availableServers) {
      try {
        let url;
        if (type === 'anime') {
          const title = AniListService.getAnimeTitle(content);
          url = StreamingService.generateAnimeStreamingUrl(server.id, title, episode || 1);
        } else {
          url = StreamingService.generateStreamingUrl(server.id, content.id, type, season, episode);
        }

        sources.push({
          server,
          url,
          quality: server.quality,
          episode: episode || 1
        });
      } catch (error) {
        console.error(`Error generating URL for server ${server.name}:`, error);
      }
    }

    return sources;
  }
};

// Export services to global scope
window.TMDBService = TMDBService;
window.AniListService = AniListService;
window.StreamingService = StreamingService;