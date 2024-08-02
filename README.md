# Spotify AI Music Suggestion App

## Overview
The Spotify AI Music Suggestion App leverages OpenAI's GPT-4o-mini model and Spotify's API to provide personalized music recommendations based on user prompts. The app can suggest songs based on favorite shows, specific artists, or moods using Lang Chain and AI-driven prompt classification as well as Spotify's recommendation engine.

## Architecture

### Frontend
- **Next.js**: Framework for creating a responsive and dynamic UI.

### Backend
- **Next.js API Routes**: Serve as the backend to handle API requests, process user prompts, and interact with the Spotify API.
- **OpenAI API**: Used to classify user prompts and find the closest matching genre based on mood.
- **Spotify API**: Interacts with Spotify's endpoints to fetch top tracks, artist-based tracks, and mood-based tracks.

## Flow Diagram
1. **User Prompt**: The user enters a prompt in the chat interface.
2. **Prompt Classification**: The backend uses OpenAI's GPT-4o-mini model to classify the prompt into categories such as favorite show, artist-based, or mood-based.
3. **Spotify API Interaction**: Based on the classification:
   - For favorite shows, fetches tracks related to the show's soundtrack.
   - For artist-based, fetches tracks by the specified artist.
   - For mood-based, uses OpenAI to find the closest genre and fetches recommendations from Spotify.
4. **Response Display**: The fetched tracks are displayed back to the user in the UI.

## Key Files and Their Roles

### 1. Frontend
- **`pages/page.tsx`**: Main page for user interaction, handles user login, and processes user prompts to get AI responses.

### 2. Backend
- **`pages/api/handle-prompt.ts`**: API route to handle user prompts, classify them using OpenAI, and fetch appropriate tracks from Spotify.
- **`lib/chains.ts`**: Contains functions that are called for classifying user prompts and finding the closest genre using OpenAI.
- **`lib/spotify.ts`**: Contains functions for interacting with Spotify's API to fetch top tracks, artist-based tracks, and mood-based tracks.

## Using LangChain with OpenAI

LangChain is used to create and manage chains of calls to the OpenAI API to process and classify user prompts. It helps in structuring the workflow of how prompts are handled and how the appropriate Spotify API calls are made based on the classification. Here's a brief overview of how LangChain and OpenAI are integrated:

1. **Prompt Classification**: LangChain is used to send user prompts to OpenAI's GPT-4o-mini model to classify them into predefined categories (e.g., favorite show, artist-based, mood-based).
2. **Genre Matching**: For mood-based prompts, LangChain helps in using the LLM to find the closest matching genre from the list of available genres fetched from Spotify.
3. **Chain Management**: LangChain manages the workflow of how different types of prompts are processed and ensures that the appropriate API calls are made based on the classification.

## How to Run the Project
1. **Clone the Repository**: Clone the project repository to your local machine.
2. **Install Dependencies** Navigate to the project directory and install the necessary dependencies.
```sh
cd spotify-ai-app
npm install
```
3. **Set Up Environment Variables:** Create a .env file in the root directory and add your Spotify and OpenAI API credentials.
```makefile
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=your_spotify_redirect_uri
OPENAI_API_KEY=your_openai_api_key
```
4. **Run the dev server:**
```sh
npm run dev
```
5. **Access the application:** Open your browser and navigate to http://localhost:3000 to use the application.
