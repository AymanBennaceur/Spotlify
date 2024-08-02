import { NextApiRequest, NextApiResponse } from 'next';
import { getTopTracks } from '../../lib/spotify';

// This handles the Get top tracks usecase
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { accessToken } = req.body;

      if (!accessToken) {
        throw new Error('Access token is missing');
      }

      const topTracksData = await getTopTracks(accessToken);
      if (!topTracksData.items) {
        throw new Error('Invalid response from Spotify API');
      }

      res.status(200).json(topTracksData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch top tracks from Spotify' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
