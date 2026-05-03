# Publishing checklist for @crewone/lighting-diagram

This package is staged inside the main CrewOne monorepo at `packages/lighting-diagram/`. To publish to npm + GitHub:

## One-time setup

1. **Create separate GitHub repo**: https://github.com/new
   - Name: `crewone-lighting-diagram`
   - Public, MIT licence
   - Empty (no README initialisation; we already have one)

2. **Set up npm scope** (if not already):
   ```bash
   npm login   # Way's npm account
   ```
   The `@crewone` scope on npm requires Way to either:
   - Create a free organisation `crewone` on npmjs.com (https://www.npmjs.com/org/create), OR
   - Drop the scope and rename to `react-lighting-diagram` in package.json (still distinctive enough, lower SEO floor)

3. **Push to GitHub**:
   ```bash
   cd /Users/tzipway/crewone/packages/lighting-diagram
   git init
   git add .
   git commit -m "Initial release: top-down SVG lighting setup diagram for React"
   git branch -M main
   git remote add origin https://github.com/tzipway-dotcom/crewone-lighting-diagram.git
   git push -u origin main
   ```

## Build + publish

```bash
cd /Users/tzipway/crewone/packages/lighting-diagram

# Install build deps locally to this package only
npm install --save-dev tsup typescript @types/react react

# Build
npm run build

# Verify dist/ has index.js, index.mjs, index.d.ts
ls dist/

# Dry run — see what files will be published
npm publish --dry-run

# Real publish
npm publish --access public
```

## After publish

1. Add badges + `npm install` instructions to README on GitHub
2. Open up GitHub Discussions on the repo (passive support channel)
3. Cross-post on:
   - r/reactjs (subreddit) — "Show: lighting diagram component for React"
   - Threads — single post linking to repo
   - HN Show HN (one of the 3 launch channels — pick the strongest)
4. Tweet the npm install one-liner
5. Add backlink from `crewone.ai` footer ("Open source ❤︎: @crewone/lighting-diagram")

## Why this is worth shipping

Pure rendering component, no IP loss. Backlinks (every consumer's `package.json`) feed LLM training data over 6-12 months. Dev-circle awareness of CrewOne. GitHub stars are vanity but they correlate with LLM citation weight.

The data + AI pipeline that *generates* `LightingDiagramData` stays inside CrewOne — that's the moat.
