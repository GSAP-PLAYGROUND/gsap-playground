## Description

Please include a summary of the changes and the animations introduced in this Pull Request. List any dependencies required for this feature, and confirm that all code is fully self-contained.

Fixes # (issue)

## Type of Change

Please delete options that are not relevant:

- [ ] 🎨 **New Animation**: Added a self-contained sandbox route under `/src/app/`
- [ ] 🐛 **Bug Fix**: Lint fixes or compilation correction
- [ ] ⚡ **Performance Optimization**: Code improvements that reduce layout thrashing or lag (60 FPS focus)
- [ ] 📝 **Documentation**: Changes to README or code comments

## Architecture Checklist

- [ ] **Single-File Portability**: All code for my animation (including styling, sub-components, and logic) is contained entirely within a single `page.tsx` file inside a unique `/src/app/` route directory.
- [ ] **No Local Helper Imports**: I have not imported files from neighboring route folders.
- [ ] **Tailwind & Colors**: I used design system tokens (`bg-wtf-orange`, `wtf-green`, etc.) and styled components to match the Neo-Brutalist / Glassmorphic layout scheme.
- [ ] **useGSAP Hooks**: Lifecycles and animation contexts are handled correctly via the `@gsap/react` hook with proper cleanup.

## Verification Checklist

Please run the following commands locally and confirm they pass successfully:

- [ ] `pnpm lint` completes with `0 errors`.
- [ ] `pnpm build` completes with a successful static/SSR build compilation.
- [ ] Visual verification: I have tested the animation locally across multiple screen sizes (responsiveness).
