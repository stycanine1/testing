/**
 * ========================================
 * ZETFLIX API CONFIGURATION CENTER
 * ========================================
 * 
 * Updated with FREE WORKING video sources that are actively maintained
 */

// ========================================
// 🎬 TMDB API CONFIGURATION (Movies & TV Shows)
// ========================================
const TMDB_CONFIG = {
  // 🔑 Your TMDB API key
  API_KEY: '39e5d4874c102b0a9b61639c81b9bda1',
  
  // 🌐 API URLs
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  
  // ⚙️ API Settings
  LANGUAGE: 'en-US',
  REGION: 'US',
  INCLUDE_ADULT: false,
  
  // 📊 Rate Limiting
  REQUESTS_PER_SECOND: 40,
  TIMEOUT: 10000,
};

// ========================================
// 🎌 ANILIST API CONFIGURATION (Anime)
// ========================================
const ANILIST_CONFIG = {
  API_URL: 'https://graphql.anilist.co',
  REQUESTS_PER_SECOND: 2,
  TIMEOUT: 8000,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 50,
  INCLUDE_ADULT: false,
  MIN_SCORE: 0,
  STATUS_FILTER: ['RELEASING', 'FINISHED'],
};

// ========================================
// 🎥 FREE WORKING VIDEO STREAMING SOURCES
// ========================================
const MOVIE_TV_STREAMING_CONFIG = {
  // 🔧 Global Settings
  DEFAULT_QUALITY: 'HD',
  TIMEOUT: 15000,
  MAX_RETRIES: 3,
  AUTO_SWITCH_ON_ERROR: true,
  
  // 🎬 FREE WORKING STREAMING SERVERS
  SERVERS: [
    {
      id: 'vidsrc-pro',
      name: 'VidSrc Pro',
      description: 'Most reliable free source - HD quality',
      baseUrl: 'https://vidsrc.pro',
      quality: 'HD',
      type: 'embed',
      supportsMovies: true,
      supportsTVShows: true,
      status: 'active',
      priority: 10,
      tags: ['RECOMMENDED', 'FREE', 'HD'],
      urlPattern: {
        movie: 'https://vidsrc.pro/embed/movie/{tmdbId}',
        tv: 'https://vidsrc.pro/embed/tv/{tmdbId}/{season}/{episode}'
      }
    },
    {
      id: 'vidsrc-xyz',
      name: 'VidSrc XYZ',
      description: 'Fast free streaming - Multiple sources',
      baseUrl: 'https://vidsrc.xyz',
      quality: 'HD',
      type: 'embed',
      supportsMovies: true,
      supportsTVShows: true,
      status: 'active',
      priority: 9,
      tags: ['FREE', 'FAST', 'HD'],
      urlPattern: {
        movie: 'https://vidsrc.xyz/embed/movie/{tmdbId}',
        tv: 'https://vidsrc.xyz/embed/tv/{tmdbId}/{season}/{episode}'
      }
    },
    {
      id: 'vidsrc-net',
      name: 'VidSrc Net',
      description: 'Free streaming with good uptime',
      baseUrl: 'https://vidsrc.net',
      quality: 'HD',
      type: 'embed',
      supportsMovies: true,
      supportsTVShows: true,
      status: 'active',
      priority: 8,
      tags: ['FREE', 'STABLE'],
      urlPattern: {
        movie: 'https://vidsrc.net/embed/movie/{tmdbId}',
        tv: 'https://vidsrc.net/embed/tv/{tmdbId}/{season}/{episode}'
      }
    },
    {
      id: 'embedsito',
      name: 'EmbedSito',
      description: 'Multi-source free streaming',
      baseUrl: 'https://www.embedsito.com',
      quality: 'HD',
      type: 'embed',
      supportsMovies: true,
      supportsTVShows: true,
      status: 'active',
      priority: 7,
      tags: ['FREE', 'MULTI-SOURCE'],
      urlPattern: {
        movie: 'https://www.embedsito.com/v2/movie/{tmdbId}',
        tv: 'https://www.embedsito.com/v2/tv/{tmdbId}/{season}/{episode}'
      }
    },
    {
      id: 'multiembed',
      name: 'MultiEmbed',
      description: 'Free aggregator with multiple sources',
      baseUrl: 'https://multiembed.mov',
      quality: 'HD',
      type: 'embed',
      supportsMovies: true,
      supportsTVShows: true,
      status: 'active',
      priority: 6,
      tags: ['FREE', 'AGGREGATOR'],
      urlPattern: {
        movie: 'https://multiembed.mov/?video_id={tmdbId}&tmdb=1',
        tv: 'https://multiembed.mov/?video_id={tmdbId}&tmdb=1&s={season}&e={episode}'
      }
    },
    {
      id: 'smashystream',
      name: 'SmashyStream',
      description: 'Free streaming with good quality',
      baseUrl: 'https://embed.smashystream.com',
      quality: 'HD',
      type: 'embed',
      supportsMovies: true,
      supportsTVShows: true,
      status: 'active',
      priority: 5,
      tags: ['FREE', 'QUALITY'],
      urlPattern: {
        movie: 'https://embed.smashystream.com/playere.php?tmdb={tmdbId}',
        tv: 'https://embed.smashystream.com/playere.php?tmdb={tmdbId}&season={season}&episode={episode}'
      }
    },
    {
      id: 'autoembed',
      name: 'AutoEmbed',
      description: 'Automatic source selection',
      baseUrl: 'https://player.autoembed.cc',
      quality: 'HD',
      type: 'embed',
      supportsMovies: true,
      supportsTVShows: true,
      status: 'active',
      priority: 4,
      tags: ['FREE', 'AUTO'],
      urlPattern: {
        movie: 'https://player.autoembed.cc/embed/movie/{tmdbId}',
        tv: 'https://player.autoembed.cc/embed/tv/{tmdbId}/{season}/{episode}'
      }
    },
    {
      id: 'moviesapi',
      name: 'MoviesAPI',
      description: 'Free API-based streaming',
      baseUrl: 'https://moviesapi.club',
      quality: 'HD',
      type: 'embed',
      supportsMovies: true,
      supportsTVShows: true,
      status: 'active',
      priority: 3,
      tags: ['FREE', 'API'],
      urlPattern: {
        movie: 'https://moviesapi.club/movie/{tmdbId}',
        tv: 'https://moviesapi.club/tv/{tmdbId}-{season}-{episode}'
      }
    },
    {
      id: 'youtube-trailers',
      name: 'YouTube Trailers',
      description: 'Official trailers and clips',
      baseUrl: 'https://www.youtube.com',
      quality: 'HD',
      type: 'embed',
      supportsMovies: true,
      supportsTVShows: true,
      status: 'active',
      priority: 2,
      tags: ['FREE', 'OFFICIAL', 'TRAILERS'],
      urlPattern: {
        movie: 'https://www.youtube.com/embed/search?q={title}+{year}+trailer',
        tv: 'https://www.youtube.com/embed/search?q={title}+season+{season}+trailer'
      }
    },
    {
      id: 'archive-org',
      name: 'Internet Archive',
      description: 'Free public domain content',
      baseUrl: 'https://archive.org',
      quality: 'Variable',
      type: 'embed',
      supportsMovies: true,
      supportsTVShows: true,
      status: 'active',
      priority: 1,
      tags: ['FREE', 'PUBLIC DOMAIN', 'LEGAL'],
      urlPattern: {
        movie: 'https://archive.org/embed/{title}-{year}',
        tv: 'https://archive.org/embed/{title}-s{season}e{episode}'
      }
    }
  ]
};

// ========================================
// 🎌 FREE ANIME STREAMING SOURCES
// ========================================
const ANIME_STREAMING_CONFIG = {
  DEFAULT_QUALITY: 'HD',
  TIMEOUT: 15000,
  MAX_RETRIES: 3,
  AUTO_SWITCH_ON_ERROR: true,
  
  SERVERS: [
    {
      id: 'animepahe',
      name: 'AnimePahe',
      description: 'Free anime streaming - Lightweight',
      baseUrl: 'https://animepahe.ru',
      quality: 'HD',
      type: 'embed',
      status: 'active',
      priority: 10,
      tags: ['FREE', 'LIGHTWEIGHT'],
      urlPattern: {
        watch: 'https://animepahe.ru/anime/{animeTitle}',
        embed: 'https://kwik.cx/e/{animeTitle}-{episode}'
      }
    },
    {
      id: 'gogoanime',
      name: 'GogoAnime',
      description: 'Popular free anime platform',
      baseUrl: 'https://gogoanime.lu',
      quality: 'HD',
      type: 'embed',
      status: 'active',
      priority: 9,
      tags: ['FREE', 'POPULAR'],
      urlPattern: {
        watch: 'https://gogoanime.lu/{animeTitle}-episode-{episode}',
        embed: 'https://gogoanime.lu/embed/{animeTitle}-episode-{episode}'
      }
    },
    {
      id: '9anime',
      name: '9Anime',
      description: 'High quality free anime',
      baseUrl: 'https://9anime.to',
      quality: 'HD',
      type: 'embed',
      status: 'active',
      priority: 8,
      tags: ['FREE', 'QUALITY'],
      urlPattern: {
        watch: 'https://9anime.to/watch/{animeTitle}.{episode}',
        embed: 'https://9anime.to/embed/{animeTitle}/{episode}'
      }
    },
    {
      id: 'crunchyroll-free',
      name: 'Crunchyroll Free',
      description: 'Official free tier with ads',
      baseUrl: 'https://www.crunchyroll.com',
      quality: 'HD',
      type: 'embed',
      status: 'active',
      priority: 7,
      tags: ['FREE', 'OFFICIAL', 'ADS'],
      urlPattern: {
        watch: 'https://www.crunchyroll.com/watch/{animeTitle}/episode-{episode}',
        embed: 'https://www.crunchyroll.com/embed/{animeTitle}/{episode}'
      }
    }
  ]
};

// ========================================
// 🆓 ADDITIONAL FREE VIDEO SOURCES
// ========================================
const FREE_VIDEO_SOURCES = {
  // Legal free streaming platforms
  LEGAL_FREE: [
    {
      name: 'Tubi',
      url: 'https://tubitv.com',
      description: 'Free movies and TV shows with ads',
      type: 'legal'
    },
    {
      name: 'Pluto TV',
      url: 'https://pluto.tv',
      description: 'Free live TV and on-demand content',
      type: 'legal'
    },
    {
      name: 'Crackle',
      url: 'https://crackle.com',
      description: 'Sony\'s free streaming service',
      type: 'legal'
    },
    {
      name: 'IMDb TV',
      url: 'https://www.imdb.com/tv/',
      description: 'Amazon\'s free streaming service',
      type: 'legal'
    },
    {
      name: 'YouTube Movies',
      url: 'https://www.youtube.com/channel/UClgRkhTL3_hImCAmdLfDE4g',
      description: 'Free movies on YouTube',
      type: 'legal'
    }
  ],
  
  // Public domain sources
  PUBLIC_DOMAIN: [
    {
      name: 'Internet Archive',
      url: 'https://archive.org/details/movies',
      description: 'Public domain movies and shows',
      type: 'public_domain'
    },
    {
      name: 'Public Domain Torrents',
      url: 'https://www.publicdomaintorrents.info',
      description: 'Classic public domain films',
      type: 'public_domain'
    }
  ],
  
  // Educational content
  EDUCATIONAL: [
    {
      name: 'Khan Academy',
      url: 'https://www.khanacademy.org',
      description: 'Free educational videos',
      type: 'educational'
    },
    {
      name: 'MIT OpenCourseWare',
      url: 'https://ocw.mit.edu',
      description: 'Free MIT course videos',
      type: 'educational'
    }
  ]
};

// ========================================
// 🔧 GENERAL STREAMING SETTINGS
// ========================================
const STREAMING_CONFIG = {
  AUTO_PLAY: true,
  AUTO_PLAY_NEXT_EPISODE: true,
  AUTO_PLAY_COUNTDOWN: 10,
  SHOW_CONTROLS_TIMEOUT: 3000,
  DEFAULT_VOLUME: 100,
  REMEMBER_VOLUME: true,
  ADAPTIVE_QUALITY: true,
  PREFERRED_QUALITY: 'HD',
  FALLBACK_QUALITY: 'SD',
  CONNECTION_TIMEOUT: 20000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  CACHE_METADATA: true,
  CACHE_DURATION: 3600000,
  ALLOW_EXTERNAL_SOURCES: true,
  VALIDATE_SOURCES: true,
};

// ========================================
// 🚨 ERROR MESSAGES
// ========================================
const ERROR_MESSAGES = {
  NO_SOURCES: 'No free streaming sources available for this content.',
  LOADING_FAILED: 'Failed to load free streaming sources.',
  CONNECTION_ERROR: 'Connection error. Please check your internet connection.',
  SERVER_ERROR: 'Free server temporarily unavailable. Trying alternative sources...',
  CONTENT_NOT_FOUND: 'Content not found on free sources. Try a different title.',
  REGION_BLOCKED: 'This content may not be available in your region on free sources.',
  RATE_LIMITED: 'Too many requests to free sources. Please wait a moment and try again.',
};

// ========================================
// 🎭 GENRE MAPPINGS
// ========================================
const GENRE_MAPPINGS = {
  MOVIE_TV: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ],
  
  ANIME: [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 3, name: "Comedy" },
    { id: 4, name: "Drama" },
    { id: 5, name: "Ecchi" },
    { id: 6, name: "Fantasy" },
    { id: 7, name: "Horror" },
    { id: 8, name: "Mahou Shoujo" },
    { id: 9, name: "Mecha" },
    { id: 10, name: "Music" },
    { id: 11, name: "Mystery" },
    { id: 12, name: "Psychological" },
    { id: 13, name: "Romance" },
    { id: 14, name: "Sci-Fi" },
    { id: 15, name: "Slice of Life" },
    { id: 16, name: "Sports" },
    { id: 17, name: "Supernatural" },
    { id: 18, name: "Thriller" }
  ]
};

// Export configurations for use in other files
window.TMDB_CONFIG = TMDB_CONFIG;
window.ANILIST_CONFIG = ANILIST_CONFIG;
window.MOVIE_TV_STREAMING_CONFIG = MOVIE_TV_STREAMING_CONFIG;
window.ANIME_STREAMING_CONFIG = ANIME_STREAMING_CONFIG;
window.STREAMING_CONFIG = STREAMING_CONFIG;
window.ERROR_MESSAGES = ERROR_MESSAGES;
window.GENRE_MAPPINGS = GENRE_MAPPINGS;
window.FREE_VIDEO_SOURCES = FREE_VIDEO_SOURCES;

console.log('🆓 ZetFlix Config loaded with FREE working video sources!');
