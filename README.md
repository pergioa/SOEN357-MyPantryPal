# MyPantryPal

MyPantryPal is a small Angular application for tracking pantry items, surfacing recipes that match what is already available, and comparing standard recipe ranking against an expiration-aware ranking mode.

The app is designed around a simple study flow:

- Add pantry ingredients and expiration dates
- Browse recipe recommendations
- Compare normal vs expiration-aware recipe ranking
- Submit a recipe choice
- Review the captured study log

## Feature Set

### Pantry Management

- Add pantry items with name, quantity, and expiration date
- Edit and delete existing pantry items
- Clear the pantry
- Load sample pantry data for quick testing
- Sort pantry items by soonest expiration
- Show freshness badges such as `Fresh`, `Use soon`, and `Use today`

### Recipe Discovery

- Browse a recipe grid with pantry-match information
- See how many recipe ingredients are already available
- View recipe details, tags, difficulty, and estimated cooking time
- Expand missing ingredients for each recipe
- Open a dedicated recipe detail page with checklist and steps

### Expiration-Aware Mode

- Switch between:
  - `Mode A`: standard ranking by pantry match and time
  - `Mode B`: expiration-aware ranking that boosts recipes using urgent ingredients
- Highlight matched recipe ingredients based on urgency in expiration-aware mode
- Show urgency warnings on recipe cards when matched ingredients should be used soon

### Study Log

- Submit recipe choices from the recipe detail page
- Store the selected recipe, mode, timestamp, and pantry snapshot
- Review submitted entries in the study log
- See recipe ingredients alongside the pantry snapshot for each entry
- View freshness labels for pantry items in logged snapshots
- Copy or export the study log as JSON

### Storage

- Pantry data is stored locally in browser `localStorage`
- Study log entries are also stored locally in browser `localStorage`
- No backend or external database is required

## Routes

- `/` home page
- `/pantry` pantry management
- `/recipes` recipe finder
- `/recipes/:id` recipe detail
- `/study-log` submitted study entries

## Run Locally

Run all commands below from the project root, meaning the folder created when you clone the repository:

```text
~/<your-cloned-repo-dir>
```

### Requirements

- Node.js
- npm

### Install Dependencies

```bash
npm install
```

### Start The Development Server

```bash
npm start
```

This runs Angular's dev server. By default, the app is typically available at:

```text
http://localhost:4200
```

### Build For Production

```bash
npm run build
```

### Optional Development Watch Build

```bash
npm run watch
```

## Notes

- The recipe dataset is currently hardcoded in the application
- The application is frontend-only
- Existing pantry items and study logs persist across reloads until cleared from the app or browser storage
