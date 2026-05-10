# AQUAFRONT - Agent Instructions

## Build Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## API Configuration

- Base URL: `http://localhost:8899/Aqua`
- Token stored in localStorage as `token`
- Auto-redirects to /login on 401

## File Structure

```
src/
├── api/           # Axios API services
├── components/    # Reusable Vue components
├── layouts/       # Layout components
├── router/        # Vue Router config
├── views/         # Page components
└── main.js        # App entry
```