# AI Study Buddy

AI-powered learning companion that helps students understand concepts, summarize notes, and generate quizzes/flashcards.

## Features

- **Explain Concepts**: Get simple explanations for complex topics
- **Summarize Notes**: Convert long notes into key points
- **Generate Quizzes**: Create practice quizzes on any topic
- **Flashcards**: Generate study flashcards automatically

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Firebase (Auth + Firestore)
- Hugging Face AI (Mistral-7B model)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Hugging Face API Key (FREE)

1. Go to https://huggingface.co/
2. Sign up for a free account
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permission
5. Copy the token

### 3. Setup Firebase

1. Go to https://console.firebase.google.com/
2. Select "ai-study-buddy" project
3. Enable Authentication → Anonymous
4. Create Firestore Database (test mode)
5. Get config from Project Settings → Your apps → Web
6. Copy config to `.env.local`

### 4. Create .env.local File

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

HUGGINGFACE_API_KEY=your_huggingface_token
```

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push code to GitHub
2. Go to https://vercel.com/
3. Import your repository
4. Add environment variables from .env.local
5. Deploy

## Usage

1. Click "Sign In" to authenticate (anonymous)
2. Choose a feature tab
3. Enter your input
4. Click "Generate" to get AI-powered results
5. Results are saved to your Firebase history

## Free Tier Limits

- **Hugging Face**: 30,000 requests/month (free forever)
- **Firebase**: 50K reads, 20K writes/day
- **Vercel**: Unlimited deployments

## Notes

This uses REAL AI (Hugging Face Mistral-7B model), not fake responses. All API calls are genuine and will work as long as you have valid API keys.
