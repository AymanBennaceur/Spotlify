'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have an access token in the URL (after redirect from Spotify)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    if (token) {
      setAccessToken(token);
      window.history.replaceState({}, document.title, "/"); // Clean up URL
    }
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const fetchTopSongs = async () => {
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
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error(error);
      setSuggestions(['Error fetching suggestions']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Music Suggestion App</h1>
      {!accessToken ? (
        <button onClick={handleLogin} className={styles.button}>
          Login with Spotify
        </button>
      ) : (
        <div>
          <button onClick={fetchTopSongs} className={styles.button}>
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
        </div>
      )}
    </div>
  );
}
