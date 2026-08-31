# David Harris Tic Tac Toe

A lightweight, modern, and accessible **React + TypeScript** web application styled with a **green-first visual identity** branded for **David Harris**.

---

## 🌟 Key Features

- **Branded Design System**: Green brand identity centered around `#16A34A` and `#15803D`, with CSS variables for design tokens.
- **Pure Game Engine**: Deterministic, testable game logic in `src/logic/gameLogic.ts`.
- **Winning Line Highlight**: Winning 3-in-a-row combinations illuminate with glowing animated styling.
- **Confetti Celebration**: Victorious games trigger an emerald confetti shower.
- **Score Tracking**: Tracks wins for Player X, Player O, and Draws across sessions.
- **Responsive Layout**: Fluid experience optimized for mobile screens (from 320px), tablets, and desktops.
- **Accessibility**: Screen reader support with ARIA live regions, descriptive cell labels, and full keyboard navigation.
- **Instant Preview**: Includes `standalone.html` for instant zero-dependency opening in any browser.

---

## 📁 Project Structure

```text
david-harris-tic-tac-toe/
├── standalone.html             # Zero-dependency browser-playable version
├── index.html                  # Vite application entry HTML
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite & Vitest configuration
├── README.md                   # Documentation
└── src/
    ├── types/
    │   └── game.ts             # Core game models & types
    ├── styles/
    │   ├── variables.css       # Green brand design tokens & CSS variables
    │   └── globals.css         # Global reset & layout typography
    ├── logic/
    │   ├── gameLogic.ts        # Pure game logic engine
    │   └── gameLogic.test.ts   # Automated unit tests
    ├── hooks/
    │   └── useTicTacToe.ts     # Custom React state management hook
    ├── components/
    │   ├── Header/             # David Harris branding header
    │   ├── GameStatus/         # Accessible turn/win/draw status banner
    │   ├── Board/              # 3x3 grid container
    │   ├── Cell/               # Interactive accessible grid cell
    │   ├── ScoreBoard/         # X, O, and Draws score counters
    │   └── Button/             # Reusable styled buttons
    ├── App.tsx                 # Main application view
    ├── App.module.css          # Card layout styles
    └── main.tsx                # React DOM mount point
```

---

## 🚀 How to Run

### Option 1: Quick Browser Play (No Node.js Required)
Simply double-click or open [standalone.html](file:///C:/Users/Mr%20Harris/.gemini/antigravity/scratch/david-harris-tic-tac-toe/standalone.html) in Chrome, Edge, Safari, or Firefox.

### Option 2: Vite Development Server
```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run unit tests
npm test

# Build for production
npm run build
```

---

## 🧪 Testing

The pure game logic engine is covered by automated unit tests (`src/logic/gameLogic.test.ts`):
- All 8 winning combinations (rows, columns, diagonals).
- Draw detection when board is full without a winner.
- Turn alternation between Player X and Player O.
- Invalid click prevention on occupied cells or completed games.
- Score increments and state resets.

---

© 2026 David Harris. Built with React & TypeScript.

