import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code || null;

  if (!code) {
    res.status(400).json({ error: 'Authorization code is missing' });
    return;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code as string,
      redirect_uri: redirect_uri as string,
    }).toString(),
  });

  const data = await response.json();

  if (response.ok) {
    // Redirect to the main page with the access token as a query parameter
    res.redirect(`/?access_token=${data.access_token}`);
  } else {
    res.status(response.status).json(data);
  }
}
