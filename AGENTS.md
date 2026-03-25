# AGENTS.md

This file provides guidance for AI coding agents working in this repository.

## Project Overview

This is a [Remotion](https://remotion.dev) project for creating algorithmic art videos using React, TypeScript, and Tailwind CSS v4.

## Commands

```bash
# Install dependencies
pnpm i

# Start Remotion Studio (dev preview)
pnpm run dev          # or: pnpm exec remotion studio

# Lint + typecheck (run both before finishing any task)
pnpm run lint         # runs: eslint src && tsc

# Build bundle
pnpm run build        # runs: remotion bundle

# Render video
pnpm exec remotion render

# Upgrade Remotion
pnpm run upgrade
```

There is **no test framework** configured. If tests are needed, use Vitest (compatible with ESM + TypeScript).

## Project Structure

```
src/
  index.ts          # Entry point — registers RemotionRoot
  Root.tsx           # Defines <Composition> components
  Composition.tsx    # Main composition component
  index.css          # Global styles (Tailwind import)
public/              # Static assets (fonts, images, audio, video)
```

## Code Style

### TypeScript

- **Strict mode** enabled (`tsconfig.json: "strict": true`)
- `"noUnusedLocals": true` — remove unused imports/variables
- `"noEmit": true` — TypeScript is for checking only, not compilation
- Target: ES2018, module: commonjs

### Formatting (Prettier)

- **2-space indentation**, no tabs
- **Bracket spacing**: `{ foo }` not `{foo}`
- Run `prettier` if needed; no format-on-save config is enforced

### Imports

- Use double quotes for strings: `import { Composition } from "remotion";`
- CSS imports go first: `import "./index.css";`
- Group: CSS → third-party → local (`./` or `../`)
- Use named exports, not default exports
- Import from `remotion` for Remotion APIs, not from `@remotion/*` subpackages (unless needed for tooling like `@remotion/cli`, `@remotion/tailwind-v4`)

### Components

- Use `export const` for components (arrow functions)
- Type React components with `React.FC` when they have no props: `React.FC`
- Component names use **PascalCase**
- File names use **PascalCase** matching the primary export

### Tailwind CSS

- Tailwind v4 is configured via `@remotion/tailwind-v4`
- Import Tailwind in `index.css`: `@import "tailwindcss";`
- Use Tailwind classes directly on elements in JSX

### Remotion Conventions

- Compositions are registered in `Root.tsx` via the `<Composition>` component
- Each `<Composition>` needs: `id`, `component`, `durationInFrames`, `fps`, `width`, `height`
- `durationInFrames` and `fps` determine video length (60 frames / 30 fps = 2 seconds)
- Default video format is JPEG (configured in `remotion.config.ts`)

### Error Handling

- If adding API calls or async logic, use try/catch with meaningful error messages
- Remotion renders are synchronous in components; use `delayRender()` / `continueRender()` for async data fetching

### File Organization

- One component per file; file name matches the primary export
- If a component grows complex, extract sub-components into the same file (no deep nesting of dirs until a clear pattern emerges)
- Utility functions (e.g., math helpers, color generators) go in `src/utils/` or colocated in the component file
- Shared constants (e.g., colors, fonts, timing values) go in `src/constants.ts` or `src/constants/`

## Remotion-Specific Patterns

### Core Hooks

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps, durationInFrames, width, height } = useVideoConfig();
```

- `useCurrentFrame()` — returns the current frame number (0-indexed)
- `useVideoConfig()` — returns fps, duration, width, height
- Use frame numbers for animation math: `const progress = frame / durationInFrames;`

### Animation & Interpolation

```tsx
import { interpolate } from "remotion";

// Map a frame range to a value range
const x = interpolate(frame, [0, 30], [0, 100]);
const opacity = interpolate(frame, [0, 60], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

- Always clamp extrapolation for animations that shouldn't repeat
- Use `spring()` for physics-based animations; use `interpolate()` for linear/eased mapping

### Static Assets

- Place assets in `public/` and reference them via relative paths (e.g., `./fonts/MyFont.ttf`)
- Import images/audio into components: `import myImg from "../public/img.png";`
- Use `staticFile()` from `remotion` for assets that need URL-based loading

### Performance Tips

- Avoid unnecessary re-renders: memoize expensive computations with `useMemo`/`useCallback`
- Prefer CSS transforms over layout-triggering properties (top/left) for smooth animations
- Keep `<Sequence>` nesting shallow; prefer prop-drilling frame offsets over deeply nested sequences

## Lint/Typecheck Workflow

Always run `pnpm run lint` after making changes. This runs ESLint and TypeScript type checking together. Fix all errors before considering a task complete.

There are no Cursor rules (`.cursor/rules/`, `.cursorrules`) or Copilot instructions (`.github/copilot-instructions.md`) in this repo.
