# The Joker AI

The Joker AI is a small web app that generates jokes from user-provided keywords. It uses a React + Vite frontend to collect keywords and render Markdown, and an Express-based backend that proxies requests to the Hugging Face ChatCompletion model. The backend sends a system prompt to the model (configurable) instructing it how to format jokes; the model's Markdown output is rendered in the browser with `react-markdown`.

Features
- Provide a list of keywords and receive a joke that includes them.
- Markdown-formatted output rendered client-side.
- Backend proxies calls to Hugging Face so the API key never reaches the browser.

Prerequisites
- Node.js (v18+ recommended)
- A Hugging Face access token with inference permissions
- (Optional) Vercel account for serverless deployment

Project layout
- `/` — React frontend (Vite)
- `/server` — Express backend used as a serverless endpoint (exports `app`)
- `src/ai.js` — client API helper (calls the `/api/joke` endpoint)
- `server/index.js` — backend; sends the `SYSTEM_PROMPT` + user message to the model

Environment variables
- `HF_ACCESS_TOKEN` — required. Your Hugging Face API key.
- `SYSTEM_PROMPT` — optional. Overrides the built-in system prompt that instructs the model. Useful for changing style, tone, or format without editing code.
- `PORT` — optional for local Express listener (if you enable it).

Quickstart — install
1. Install frontend dependencies from project root:

```bash
npm install
```

2. Install server dependencies:

```bash
cd server
npm install
```

Running locally

Note: This project exports an Express `app` from `server/index.js` so it can be deployed as a serverless function (for example on Vercel). For local development you have two common options:

Option A — use Vercel's local dev (recommended when keeping serverless behavior):

```bash
# from the project root
npx vercel dev
```

Option B — run the Express app directly (quick hack for local testing):
1. Create a `.env` file in `/server` with at least:

```
HF_ACCESS_TOKEN=your_hf_token_here
SYSTEM_PROMPT=You are a friendly joke-writing assistant. Use the provided keywords and return raw Markdown.
PORT=3012
```

2. Start the server (this project has a `start` script, but `server/index.js` is exported as an app — see note below):

```bash
cd server
npm run start
```

If you prefer to run the Express app with a direct listener during local dev, uncomment or add a small `server.listen(...)` wrapper in `server/index.js` to bind to `PORT`.

Frontend dev

By default, `src/ai.js` points to the production API URL. For local testing update `src/ai.js`:

```js
// development / local testing
const API_URL = "http://localhost:3012/api/joke"
```

Then run the frontend dev server from the project root:

```bash
npm run dev
```

Production deployment (Vercel)

This repo is suitable for Vercel (serverless function for the backend and static frontend). Steps:

1. Create a Vercel project and link your repo.
2. In the Vercel dashboard set environment variables for the project:
	 - `HF_ACCESS_TOKEN` (required)
	 - `SYSTEM_PROMPT` (optional override)
3. Deploy. The frontend will be served from the project domain and the backend will be reachable at `/api/joke`.

API & client usage
- Endpoint: `POST /api/joke`
- Request body: `{ "keywords": ["cat", "pizza"] }`
- Response: `{ "joke": "<markdown string>" }`

Notes on `SYSTEM_PROMPT` and customizing behavior
- The server sends a system prompt to the model that instructs style, formatting (Markdown), length, and safety. You can iterate by setting `SYSTEM_PROMPT` in the `/server/.env` or in Vercel's environment variables.
- Suggested prompt styles: one-liner, short paragraph, pun specialist, family-friendly, or a JSON+Markdown hybrid (if you change the front-end to parse JSON).

Security & costs
- Keep `HF_ACCESS_TOKEN` secret — never commit it to the repo.
- Model usage consumes inference credits on Hugging Face. Monitor usage and model choice to control costs.

Troubleshooting
- If you see no response from `/api/joke` locally, ensure either:
	- you're running `vercel dev` which mounts serverless functions, or
	- you have enabled an Express listener in `server/index.js` and started the server.
- If the front-end shows raw JSON instead of rendered Markdown, confirm the backend returns a Markdown string and that `src/JokeSection.jsx` uses `react-markdown` (it does by default).

Want me to update `src/ai.js` to use an environment-configured API URL or make the `SYSTEM_PROMPT` configurable from `server/.env`? I can apply those changes.
