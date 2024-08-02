'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Handles login and spotify access token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    if (token) {
      setAccessToken(token);
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  // Handles the responses from the get top tracks endpoint
  const fetchSuggestions = async () => {
    if (!accessToken) return;

    setLoading(true);

    try {
      const response = await fetch('/api/get-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setSuggestions(data.items.map((item: any) => `${item.name} by ${item.artists.map((artist: any) => artist.name).join(', ')}`) || []);
    } catch (error) {
      console.error(error);
      setSuggestions(['Error fetching suggestions']);
    } finally {
      setLoading(false);
    }
  };

  // This handles the chain command response
  const handleSubmitPrompt = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!aiPrompt) return;

    setLoadingAi(true);
    setAiResponse('');

    try {
      const response = await fetch('/api/handle-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, accessToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch AI response');
      }

      const data = await response.json();
      if (data.error) {
        setAiResponse(data.error);
      } else {
        setAiResponse(JSON.stringify(data.response, null, 2)); // Better way to visualize the response
      }
    } catch (error) {
      console.error(error);
      setAiResponse(`Error fetching response: ${error.message}`);
    } finally {
      setLoadingAi(false);
    }
  };

  // Rendered UI
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Music Suggestion App</h1>
      {!accessToken ? (
        <button onClick={handleLogin} className={styles.button}>
          Login with Spotify
        </button>
      ) : (
        <>
          <button onClick={fetchSuggestions} className={styles.button}>
            Fetch Top Songs
          </button>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className={styles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <li key={index} className={styles.suggestion}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleSubmitPrompt} className={styles.form}>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Enter a prompt for AI..."
              className={styles.input}
            />
            <button type="submit" className={styles.button}>Get AI Response</button>
          </form>
          {loadingAi ? (
            <p>Loading AI response...</p>
          ) : (
            <pre>{aiResponse}</pre> 
          )}
        </>
      )}
    </div>
  );
}
