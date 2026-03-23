# ImageLens 🔍

[Live](https://image-desciber.netlify.app/)

![Website](/public/website.png)

A sleek, production-quality web app for AI-powered image analysis. Drop any image and get back a rich description, keyword labels, detected objects, dominant colors, and mood — all powered by **Google Gemini 2.0 Flash**.

---

## Features

- **Drag & drop** (or click-to-browse) upload — JPG, PNG, WEBP, GIF, AVIF
- **Rich per-image results**: description, labels, objects, colors, mood, confidence score
- Fully responsive 1→2 column grid
- Animated UI: scan-line overlay, staggered card reveals, hover micro-interactions

---

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Framework  | React 19 + TypeScript                               |
| Build tool | Vite 6                                              |
| Styling    | Tailwind CSS v4 (via @tailwindcss/vite plugin)      |
| AI         | Google Gemini 2.0 Flash via @google/genai SDK       |
| Icons      | Lucide React                                        |
| Fonts      | Syne (display) + DM Sans (body) + DM Mono (mono) |

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/your-username/image-lens.git
cd image-lens
npm install
```

### 2. Get a Gemini API key

1. Go to [gemini-api-key](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API key** — the free tier is generous enough for personal use

### 3. Run the dev server

```bash
npm run dev
```

Open [localhost](http://localhost:5173) and paste your API key when prompted. It's saved to localStorage so you only need to do this once.

### 4. Build for production

```bash
npm run build
npm run preview   # preview locally
```

**Deployed on Netlify.**

---

## How It Works

1. User drops images onto DropZone
2. If no API key is stored, ApiKeyModal is shown first
3. Each File is converted to `base64` via FileReader
4. The base64 data + a structured JSON prompt are sent to `gemini-2.5-flash` via `@google/genai`
5. Gemini returns JSON with description, labels, colors, mood, objects, and confidence
6. Results are rendered in ImageCard with staggered animation
7. Images are processed **sequentially** to stay within Gemini rate limits

---

## Privacy

- Images go directly from your browser to Google's Gemini API — no intermediate server
- No analytics or tracking of any kind

---

## Future Improvement

- Add both dark and light UI
- Add batch image analyzer that process multiple images is one click

## License

MIT
