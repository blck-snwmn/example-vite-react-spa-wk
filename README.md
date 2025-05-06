# Example Vite React SPA with Cloudflare Workers

This project is an implementation example for hosting a modern React SPA application on Cloudflare Workers.

## Technology Stack

### Core Technologies
- React 19
- TypeScript
- Vite 6
- TanStack Router
- Tailwind CSS 4

### Deployment
- Cloudflare Workers
- Wrangler

### Development Tools
- ESLint 9
- SWC
- pnpm

## Project Structure

```
├── src/                  # Source code
│   ├── assets/          # Static assets
│   ├── routes/          # TanStack Router route definitions
│   ├── main.tsx         # Application entry point
│   └── routeTree.gen.ts # Auto-generated route tree
├── worker/              # Cloudflare Workers code
├── public/              # Static files
└── dist/                # Build output
```

## Development

### Start Development Server

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

### Deploy to Cloudflare

```bash
pnpm deploy
```

## ESLint Configuration

This project uses the latest ESLint 9 (flat config). Edit `eslint.config.js` as needed.
