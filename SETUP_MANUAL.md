# Setup Instructions

## 1. Firebase Console Setup

1. Go to https://console.firebase.google.com/
2. Select your project "ai-study-buddy"
3. Click "Authentication" → "Get Started" → Enable "Anonymous"
4. Click "Firestore Database" → "Create Database" → Test mode → Choose location → Enable
5. Go to Project Settings (⚙️ icon) → Scroll to "Your apps" → Click Web icon `</>`
6. Register app name: "ai-study-buddy-web" → Copy the config values
7. Paste config values in `.env.local`

## 2. Hugging Face API Key

1. Go to https://huggingface.co/settings/tokens
2. Create new token with READ permission
3. Copy token to `.env.local`

## 3. Run

```bash
npm run dev
```
