# Project-1S — Smart Agriculture Dashboard

A modern **Next.js 16** web app for smart agriculture — crop advisory, weather monitoring, soil analysis, irrigation planning, pest management, government schemes, and more.

## Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | **≥ 18** (LTS recommended) |
| npm | comes with Node.js |

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Rishi4676/project-1S.git
cd project-1S

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server (with hot-reload) |
| `npm run build` | Create an optimized production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint checks |

## Project Structure

```
project-1S/
├── public/              # Static assets (video, SVGs)
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── community/
│   │   ├── crop-advisor/
│   │   ├── crop-calendar/
│   │   ├── helpline/
│   │   ├── irrigation/
│   │   ├── pests/
│   │   ├── schemes/
│   │   ├── soil-calculator/
│   │   ├── water-table/
│   │   ├── weather/
│   │   └── api/chat/    # API routes
│   ├── components/      # Reusable React components
│   ├── lib/             # Utilities & i18n
│   └── types/           # TypeScript type declarations
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **Icons:** Lucide React

## Deployment

Deploy easily on [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js) or any Node.js hosting platform:

```bash
npm run build
npm start
```

## License

This project is private.
