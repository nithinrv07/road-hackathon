# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Road Hackathon — React + TypeScript + Vite

  Short, polished README for competition submission.

  ## Project Overview

  Road Hackathon is a single-page web application built with React and TypeScript. It demonstrates real-time mapping and UI interactions using Leaflet, animated UI using Framer Motion, and modern development tooling powered by Vite.

  ## Key Features

  - Interactive map view using `leaflet`.
  - Smooth UI animations with `framer-motion`.
  - Accessible icons via `lucide-react`.
  - Type-safe codebase with `TypeScript`.

  ## Tech Stack

  - Framework: React
  - Bundler / Dev server: Vite (with `@vitejs/plugin-react`)
  - Language: TypeScript
  - Map library: Leaflet
  - Animation: Framer Motion
  - Icons: Lucide React
  - Linting: ESLint and related plugins

  Exact dependency versions are in `package.json`.

  ## Quick Setup (For Judges)

  Prerequisites: Node.js and a package manager (`npm`, `yarn`, or `pnpm`).

  1. Install dependencies

  ```bash
  npm install
  ```

  2. Run development server (with HMR)

  ```bash
  npm run dev
  ```

  3. Build for production

  ```bash
  npm run build
  ```

  4. Preview production build locally

  ```bash
  npm run preview
  ```

  5. Run lint checks

  ```bash
  npm run lint
  ```

  ## Project Structure (high level)

  - `src/` — application source code
  - `src/components/` — React components (UI, map, pages)
  - `src/lib/` — utility functions
  - `public/` — static assets
  - `package.json` — scripts & dependencies

  ## Submission Notes

  - This repo is ready for submission. For the competition, provide this project folder or a GitHub link.
  - To reproduce: run `npm install` then `npm run dev`.

  ## Contact

  If you need any additional information or want a short demo video, contact the author.

  ---

  Generated and polished for competition submission.
