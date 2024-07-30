const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;

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

export const getTopTracks = async (access_token: string) => {
  const response = await fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });

  return response.json();
};
