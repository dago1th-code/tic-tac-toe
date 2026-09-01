# Tic Tac Toe — Feature Checklist & GitHub Workflow

**Project:** david-harris-tic-tac-toe  
**Repo:** [https://github.com/dago1th-code/tic-tac-toe](https://github.com/dago1th-code/tic-tac-toe)  
**Author:** David Harris  

---

## ✅ What You Already Completed Today

- Installed and set up Git (Git Bash)
- Connected local project to GitHub
- Created the GitHub repository
- Made your first commit (initial upload of all project files)
- Added rounded corners + shadow to the header (UI improvement)
- Updated `README.md` with project details
- Pushed 3 commits successfully to GitHub
- Wrote submission explanations (what GitHub is, and the difference between `git add`, `git commit`, `git push`)

---

## 🧩 Feature Checklist & Progress

### 🌟 Completed in Codebase
- [x] **Dark mode and light mode toggle** (`ThemeToggle.tsx` + `useTheme.ts`)
- [x] **Fully mobile responsive design** (CSS Modules with responsive layouts)
- [x] **Game history showing previous match results** (`GameHistory.tsx` with date, winner, moves)
- [x] **Let the player choose X or O before a game starts** (`PlayerChoice.tsx`)
- [x] **Improved animations and transitions** (confetti on win, smooth transitions)
- [x] **Winning line animation / highlight** (Glowing winning cells in `Board.tsx`)
- [x] **Winning streak counter & reward wallet** (`RewardWallet.tsx` + streak tracker)
- [x] **Overall statistics showing total wins, losses and draws** (`ScoreBoard.tsx`)
- [x] **Save scores and game history to localStorage** (Persists across page refresh)
- [x] **Move timer with turn countdown** (`GameTimer.tsx` + `useGameTimer.ts`)
- [x] **Two-player local mode (PvP) & AI mode** (`ModeSelector.tsx`)
- [x] **Accessibility improvements** (ARIA attributes, keyboard-navigable buttons)
- [x] **Sound effects engine & settings panel** (Sound toggle, AI difficulty easy/medium/hard)
- [x] **Rematch / New Game button** (Keeps settings intact)

---

### 🚀 Upcoming Feature Ideas To Add Next

- [ ] **Hint button** that suggests a good next move
- [ ] **Undo last move button**
- [ ] **How to Play** interactive modal / rules popup
- [ ] **Confirmation modal** before resetting scores or clearing game history
- [ ] **Match summary popup** after each game (winner, number of moves, time taken)
- [ ] **Best-of-3 or Best-of-5 match mode**
- [ ] **Custom themes** (Neon, Cyberpunk, Classic, Minimal)
- [ ] **Custom player colours & avatars**
- [ ] **Keyboard navigation controls** (play using number keys 1–9 or arrow keys)
- [ ] **Board size selector** (3x3, 4x4, 5x5) with dynamic win condition
- [ ] **Replay feature** that animates moves from the previous match step-by-step
- [ ] **Share result button** (copies formatted result to clipboard for sharing)
- [ ] **Device Leaderboard** with persistent high-scores and player names

---

## 🔁 The Workflow To Add Each Feature (Repeat This Every Time)

For every feature you add, follow these same steps:

### 1. Open your project in VS Code / IDE
Make sure you're inside the `david-harris-tic-tac-toe` folder.

### 2. Make your change
Edit the relevant file (e.g., a component in `src/components`, or a CSS file for styling).  
Save with **Ctrl + S**.

### 3. Test it
Run the app locally to make sure nothing broke:
```bash
npm run dev
```
Open the local link shown in the terminal and check that the feature works smoothly.

### 4. Save your work to Git (Git Bash / Terminal)
```bash
# 1. Stage changes
git add .

# 2. Commit with a clear, descriptive message
git commit -m "Added hint button with AI move suggestions"

# 3. Push online to GitHub
git push
```

### 5. Verify on GitHub
Go to [https://github.com/dago1th-code/tic-tac-toe](https://github.com/dago1th-code/tic-tac-toe), refresh, and confirm your new commit appears.

---

## 💡 Good Commit Message Examples

Use messages like these (specific, not vague):
- `Added hint button with AI move suggestions`
- `Added How to Play modal with game rules`
- `Added confirmation dialog before resetting scores`
- `Implemented best-of-3 and best-of-5 match series`
- `Added keyboard controls (1-9 numpad) for board moves`
- `Added Cyberpunk and Neon custom themes`

---

## 🧠 Quick Reminders

- `git add .` → prepares your changes to be saved
- `git commit -m "..."` → saves those changes with a message (locally, on your computer)
- `git push` → uploads your saved changes to GitHub (online)

