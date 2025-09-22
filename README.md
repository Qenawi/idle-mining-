<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Idle Mining Tycoon

A captivating idle mining management game where you balance the output of mineshafts, elevators, and warehouse operations to grow your empire—even while you are away.

## 📸 Screenshot

![App screenshot placeholder](docs/images/app-screenshot-placeholder.png)

> Replace the image above with an exported screenshot of the in-app dashboard when it is available.

## 🚀 Features

- Manage individual mineshafts, elevators, and storage to keep resources flowing smoothly.
- Upgrade facilities to maximize yield and unlock new production tiers.
- Automate workflows so your mine keeps generating profits while you are offline.
- Built with modern web tooling for fast iteration and deployment.

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **AI Integration:** Google Gemini via `@google/genai`

## 🧰 Prerequisites

- Node.js 18 or later
- A Google Gemini API key

## ⚙️ Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables by creating `.env.local` in the project root and setting:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the printed localhost URL in your browser to interact with the app.

## 🧪 Testing the Production Build

Verify the production bundle locally before deploying:
```bash
npm run build
npm run preview
```

## 🚢 Deployment

This project ships with a standard Vite build output located in `dist/`. Deploy that folder to your preferred static hosting provider (e.g., Netlify, Vercel, GitHub Pages) or serve it behind your own CDN.

## 🛟 Troubleshooting

- Ensure your `GEMINI_API_KEY` is valid and has sufficient quota.
- Restart the dev server if you add new environment variables so that Vite can pick them up.
- If dependencies fail to install, remove `node_modules` and `package-lock.json`, then rerun `npm install`.

## 🔗 Additional Resources

- Manage and deploy your AI Studio app: https://ai.studio/apps/drive/1gajiHNVBCkTBnlQ6xsbwY1CIjU4PThpd
- Learn more about Vite: https://vitejs.dev/
- Google Gemini documentation: https://ai.google.dev/gemini-api

