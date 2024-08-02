import { NextApiRequest, NextApiResponse } from 'next';
import { getChainForPrompt } from '../../lib/chains';
import { getFavoriteShowTracks, getArtistBasedTracks, getMoodBasedTracks } from '../../lib/spotify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { prompt, accessToken } = req.body;

      if (!accessToken) {
        return res.status(400).json({ error: 'Access token is missing' });
      }

      // Get the chain for the prompt
      const chain = await getChainForPrompt(prompt);

      let result;
      switch (chain) {
        case 'showChain':
          result = await getFavoriteShowTracks(prompt, accessToken);
          break;
        case 'artistChain':
          result = await getArtistBasedTracks(prompt, accessToken);
          break;
        case 'moodChain':
          result = await getMoodBasedTracks(prompt, accessToken);
          break;
        default:
          return res.status(400).json({ error: 'Invalid request type' });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to handle prompt' });
    }
  } else {
    res.status(405).end(); 
  }
}
