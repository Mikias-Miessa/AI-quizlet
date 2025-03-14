# PDF Learning Assistant

An AI-powered learning tool that transforms PDF documents into interactive study materials. This application helps students and learners maximize their understanding and retention through three distinct learning modes, all powered by Google's Gemini Pro AI.

## Features

### Learning Modes

- **Interactive Quizzes**: AI-generated multiple-choice questions to test understanding
- **Smart Flashcards**: Spaced repetition system for efficient memorization
- **Concept Matching**: Exercises to connect related ideas and strengthen comprehension

### Key Features

- PDF document processing and analysis
- Automatic generation of study materials
- Progress tracking across learning sessions
- Responsive and animated user interface
- Personalized learning experience

## Technical Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI Provider**: Google's Gemini Pro
- **State Management**: Zustand
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 16.x or later
- Google API key for Gemini Pro

### Installation

```bash
npx create-next-app --example https://github.com/vercel-labs/ai-sdk-preview-pdf-support pdf-learning-assistant
# or
yarn create next-app --example https://github.com/vercel-labs/ai-sdk-preview-pdf-support pdf-learning-assistant
# or
pnpm create next-app --example https://github.com/vercel-labs/ai-sdk-preview-pdf-support pdf-learning-assistant
```

### Configuration

1. Sign up for a Google API key to access Gemini Pro
2. Create a `.env` file
3. Add your Google API key to the `.env` file

### Running the Application

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Upload**: Users upload their PDF study materials
2. **Processing**: The AI analyzes the document content
3. **Mode Selection**: Choose between Quiz, Flashcard, or Concept Matching modes
4. **Learning**: Engage with the generated materials
5. **Progress Tracking**: Monitor your learning journey across sessions

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-pdf-support&env=GOOGLE_API_KEY&envDescription=API%20keys%20needed%20for%20application&envLink=google.com)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Gemini Pro](https://ai.google.dev/)

## License

This project is licensed under the MIT License.
