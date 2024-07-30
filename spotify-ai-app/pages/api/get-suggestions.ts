import { NextApiRequest, NextApiResponse } from 'next';
import { getTopTracks } from '../../lib/spotify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { accessToken } = req.body;

      if (!accessToken) {
        throw new Error('Access token is missing');
      }

      // Get top tracks from Spotify using the access token
      const topTracksData = await getTopTracks(accessToken);
      if (!topTracksData.items) {
        throw new Error('Invalid response from Spotify API');
      }

      const suggestions = topTracksData.items.map((item: any) => `${item.name} by ${item.artists.map((artist: any) => artist.name).join(', ')}`);

      res.status(200).json({ suggestions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch top tracks from Spotify' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
