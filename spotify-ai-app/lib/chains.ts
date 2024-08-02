import OpenAI from 'openai';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// This function matches the user's prompt to one of 3 predefined categories
export const getChainForPrompt = async (prompt: string): Promise<string> => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Classify the user prompt strictly into one of these categories: ["favorite show", "artist-based", "mood-based"]. make sure to not capitalize the letters and strictly return one of these categories' },
      { role: 'user', content: `Classify this prompt: "${prompt}" into one of these categories: ["favorite show", "artist-based", "mood-based"].` }
    ],
  });

// Now based on the classification call the chain for it.
const classification = completion.choices[0].message.content.trim();
console.log(classification)
  switch (classification) {
    case 'favorite show':
      return 'showChain';
    case 'artist-based':
      return 'artistChain';
    case 'mood-based':
      return 'moodChain';
    default:
      return 'defaultChain';
  }
};

// This function uses the LLM to match user prompt to closest available genre on spotify
export const getClosestGenre = async (mood: string, availableGenres: string[]): Promise<string> => {
  const genresList = availableGenres.join(", ");
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an assistant that helps find the closest music genre based on user mood. ONLY RETURN ONE OF THE GENRES PROVIDED IN SAME FORMAT PROVIDED' },
      { role: 'user', content: `Given the mood "${mood}" and these genres "${genresList}", which genre is the closest match?` }
    ],
  });

  const closestGenre = completion.choices[0].message.content.trim();
  return closestGenre;
};
