import fetch from 'node-fetch';
import { getClosestGenre } from './chains'; 

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

// Defining all the Spotify API endpoints
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const SEARCH_ARTIST_ENDPOINT = `https://api.spotify.com/v1/search?type=artist`;
const RECOMMENDATIONS_ENDPOINT = `https://api.spotify.com/v1/recommendations`;
const AVAILABLE_GENRE_SEEDS_ENDPOINT = `https://api.spotify.com/v1/recommendations/available-genre-seeds`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;

// Handles Spotify access token to use with API calls
export const getAccessToken = async (code: string) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri,
    }).toString(),
  });

  return response.json();
};

// Refershes access token when needed
export const refreshAccessToken = async (refresh_token: string) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    }).toString(),
  });

  return response.json();
};

// Calls the spotify get top tracks endpoint
export const getTopTracks = async (access_token: string) => {
  const response = await fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  console.log(response.json())
  return response.json();
};

// Get favorite show tracks based on prompt
export const getFavoriteShowTracks = async (show: string, accessToken: string) => {
  const query = `${show} soundtrack`;
  const response = await fetch(`${SEARCH_ARTIST_ENDPOINT}&q=${encodeURIComponent(query)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const data = await response.json();
  const artistId = data.artists.items[0]?.id;

  if (artistId) {
    const recommendationsResponse = await fetch(`${RECOMMENDATIONS_ENDPOINT}?seed_artists=${artistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return recommendationsResponse.json();
  }

  return { error: 'No results found' };
};

// Get favorite songs based on artist 
export const getArtistBasedTracks = async (artist: string, accessToken: string) => {
  const response = await fetch(`${SEARCH_ARTIST_ENDPOINT}&q=${encodeURIComponent(artist)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const data = await response.json();
  const artistId = data.artists.items[0]?.id;

  if (artistId) {
    const recommendationsResponse = await fetch(`${RECOMMENDATIONS_ENDPOINT}?seed_artists=${artistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return recommendationsResponse.json();
  }

  return { error: 'No results found' };
};

// This makes sure we fetch the available genres that the spotify recommendation api uses
// The genres fetched here will later be used with the LLM to match the user's prompt to one of the genres
export const getAvailableGenreSeeds = async (accessToken: string) => {
  const response = await fetch(AVAILABLE_GENRE_SEEDS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  return data.genres;
};

// Function that handles the moodbased chain
export const getMoodBasedTracks = async (mood: string, accessToken: string) => {
    const availableGenres = await getAvailableGenreSeeds(accessToken);
  
    // Use LLM to find the closest matching genre
    const closestGenre = await getClosestGenre(mood, availableGenres);
  
    if (closestGenre) {
      const recommendationsResponse = await fetch(`${RECOMMENDATIONS_ENDPOINT}?seed_artists=&seed_genres=${encodeURIComponent(closestGenre)}&seed_tracks=&limit=20`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log(recommendationsResponse.json())
      return recommendationsResponse.json();
    }
  
    return { error: 'No matching genre found' };
  };
  
