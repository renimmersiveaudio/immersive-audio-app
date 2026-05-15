const YOUTUBE_API_KEY = (import.meta.env as any).VITE_YOUTUBE_API_KEY || '';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  duration?: string;
}

export const youtubeService = {
  // Search for videos
  async search(query: string, maxResults = 12): Promise<YouTubeVideo[]> {
    if (!YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured. Set VITE_YOUTUBE_API_KEY in .env');
      return [];
    }
    
    try {
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
      );
      
      const data = await response.json();
      
      if (!data.items) return [];
      
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle,
      }));
    } catch (error) {
      console.error('YouTube search error:', error);
      return [];
    }
  },

  // Get details from a playlist URL or ID (we'll expand this later)
  async getPlaylistItems(playlistId: string) {
    // We'll implement this next
    console.log("Fetching playlist:", playlistId);
  }
};