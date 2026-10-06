# GymSync

<div align="center">

<img src="assets/logo.svg" width="120" alt="GymSync Logo">

# GymSync

### Premium Offline Fitness Tracker

*A modern Apple-inspired fitness tracker built with HTML, CSS and vanilla JavaScript.*

**v1.0 Complete, Phases 1 to 8**

![Version](https://img.shields.io/badge/version-v1.0.0-4CAF50?style=for-the-badge)
![Phase](https://img.shields.io/badge/Phase-8%2F8-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-v1.0%20Released-brightgreen?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## What

GymSync is an offline-first fitness tracker that lives entirely in your browser. It gives you a personalized dashboard with your daily Push / Pull / Legs split, a live workout screen with an elapsed timer and per-exercise weight and notes logging, persisted stats like workout streak and weekly completion, and a full history log of every completed session. There is no account, no backend, and no network call: your data stays on your device in Local Storage.

## Why

GymSync is a long-term software engineering project built throughout a Bachelor of Computer Applications (BCA). Instead of creating dozens of disconnected tutorial projects, the idea was to continuously improve one real application while learning modern software engineering, with every phase adding features, cleaner architecture and better coding practices.

## When

September 2026.

## Tech Stack

![HTML](https://skillicons.dev/icons?i=html) ![CSS](https://skillicons.dev/icons?i=css) ![JavaScript](https://skillicons.dev/icons?i=js)

- HTML5
- CSS3
- Vanilla JavaScript (ES6)
- Local Storage API

## Why this stack

- **Vanilla JavaScript, no frameworks or build step:** the app runs by simply opening `index.html` in a browser, and ES6 modules were enough for the resolver, timer and storage logic.
- **Plain CSS3:** hand-written styles keep full control over the Apple-inspired dark theme, glassmorphism cards and mobile-first responsive layout without pulling in a framework.
- **Local Storage API:** the app is designed to be offline-first and account-free, so browser storage covers the user profile, workout log and stats with zero backend cost.
- **GitHub Pages:** static hosting fits a project with no build step and no server.

## How it works

- On first launch an onboarding screen collects your name and saves it to Local Storage; returning users skip it automatically.
- A single resolver, `getTodaysWorkout()`, maps the current weekday to a split (Push / Pull / Legs / Rest) and returns that day's exercise list from an in-app exercise database, so the dashboard, workout screen and history all share one source of truth.
- The dashboard renders the greeting, live clock, today's split and live stats (streak, weekly completion, last workout).
- Opening a training day starts a live elapsed timer; each exercise card logs weight, notes and a completed checkbox, with a progress bar tracking completion.
- Finishing saves the session to the history log and updates the streak (once per calendar day), weekly completion (resets each Monday) and last-workout stats.
- The History tab lists every past session newest first, each expandable to show logged weights and notes.

---

## Features

### First Launch Experience

- Welcome onboarding screen
- User name setup
- Local Storage persistence
- Returning users skip onboarding automatically

---

### Dashboard

- Personalized greeting
- Live digital clock
- Current day
- Current date
- Today's workout split
- Motivational quotes
- Start Workout button

---

### Dashboard Statistics

- Workout streak
- Weekly completion
- Last workout

---

### Workout Logic Engine (Phase 4)

- Automatic weekday to split resolution (Push / Pull / Legs / Rest)
- Every split carries a real exercise database: name, target sets and target rep range for each movement
- One resolver function (`getTodaysWorkout()`) returns the full day's workout in a single call, so every future screen (Workout, History) pulls from the same source of truth instead of duplicating the logic
- Dashboard reflects it live, for example "5 exercises scheduled" instead of a static label

---

### Polish (Phase 8)

- Fixed an iOS Safari bug where logging a weight mid-workout would zoom the whole page in (inputs were rendering under the 16px zoom threshold)
- Removed the old mobile tap delay and double-tap zoom on every button and link
- Page no longer rubber-bands past the top or bottom on mobile
- Checkboxes pop and dashboard stats pulse when they actually change, not on every load, only on real updates
- Subtle hover lift on cards for desktop
- Emerald Green plus Black theme, swapped in from a single token change

---

### History (Phase 7)

- Full workout history log, newest first
- Every past entry expands to show each exercise's logged weight and notes
- Total workouts and current streak shown at a glance
- Honest empty state until the first workout is finished

---

### Workout Summary (Phase 6)

- Congratulations screen shown after Finish Workout
- Workout duration, exercises completed and an estimated calories burned
- Real persistence: streak, weekly completion and last workout now save to Local Storage, so the dashboard stats are no longer placeholders
- Streak logic only advances once per calendar day and resets if a training day is missed
- Weekly completion count resets automatically each Monday

---

### Workout Screen (Phase 5)

- Live elapsed timer, starts the moment a training day's workout is opened
- Exercise cards rendered straight from the Phase 4 workout logic engine
- Per-exercise weight and notes input
- Custom, accessible completed checkbox per exercise
- Live progress bar tracking exercises completed
- Finish Workout flow (full save plus summary screen arrive in Phase 6)
- Dedicated Rest Day state on days with nothing scheduled

---

### Navigation

- Responsive sidebar (desktop)
- Bottom navigation (mobile)
- Animated active indicator
- Smooth page transitions

---

### User Interface

- Apple-inspired design
- Dark mode
- Glassmorphism
- Mobile-first
- Responsive layout
- Smooth animations

---

### Storage

- Local Storage
- Offline-first
- Persistent user profile

---

## Workout Split

| Day | Workout | Exercises |
|------|----------|----------|
| Monday | Push | 5 |
| Tuesday | Pull | 5 |
| Wednesday | Legs | 5 |
| Thursday | Push | 5 |
| Friday | Pull | 5 |
| Saturday | Legs | 5 |
| Sunday | Recovery | - |

---

## Screenshots

Screenshots will be added as development progresses.

```text
assets/screenshots/
```

---

## Project Structure

```text
GymSync/
|
|-- assets/
|   |-- logo.svg
|   |-- images/
|   `-- screenshots/
|
|-- docs/
|   |-- CHANGELOG.md
|   |-- LEARNING.md
|   `-- WHY.md
|
|-- index.html
|-- style.css
|-- script.js
|
|-- README.md
|-- LICENSE
`-- .gitignore
```

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/p3xz/gymsyncs.git
```

Open the project:

```bash
cd gymsyncs
```

Then either serve it with VS Code Live Server, or simply open `index.html` in your browser. No build step, no dependencies to install.

---

## Development Progress

### Phase 1

- Project setup
- Responsive layout
- Dark theme
- Navigation system

---

### Phase 2

- First-launch onboarding
- User profile setup
- Local Storage integration

---

### Phase 3

- Personalized dashboard
- Live clock
- Current day and date
- Workout split
- Dashboard statistics
- Motivational quotes
- Improved UI
- Responsive navigation

---

### Phase 4

- Automatic workout split resolution engine
- Per-split exercise database (sets and rep targets)
- Single `getTodaysWorkout()` source of truth for later phases
- Dashboard now shows live exercise counts

---

### Phase 5

- Live workout timer
- Exercise cards with weight and notes input
- Completed checkbox per exercise
- Live progress bar
- Finish Workout flow
- Rest Day state on the Workout tab

---

### Phase 6

- Congratulations / summary screen
- Duration, exercises completed and calories burned
- Streak, weekly completion and last workout now persist for real
- Dashboard stats reflect actual saved progress

---

### Phase 7

- Full workout history log
- Expandable entries showing per-exercise weight and notes
- Total workouts and streak summary
- Empty state for new users

---

### Phase 8 (Current)

- Fixed iOS input-zoom bug on the workout screen
- Removed tap delay / double-tap zoom app-wide
- Contained overscroll / rubber-banding on mobile
- Checkbox pop plus stat pulse micro-interactions
- Desktop card hover lift
- Emerald Green plus Black theme

---

## v1.0 Complete

All 8 planned phases are done. GymSync now covers onboarding, a live dashboard, automatic workout logic, a full workout-logging screen, persisted stats, workout history and a mobile-optimized polish pass, entirely offline, with no framework or backend.

---

## Roadmap

### Future Releases

- React
- Backend
- Authentication
- Cloud Sync
- Mobile App
- Nutrition Tracking
- AI Workout Coach
- Smart Analytics

---

## Contributing

This is currently a personal learning project.

Suggestions, feature requests and feedback are always welcome.

---

## License

This project is licensed under the MIT License.

---

## Credits

**Namish Yadav**

- GitHub: https://github.com/p3xz
- LinkedIn: https://www.linkedin.com/in/namish-yadav-639769408/
- Instagram: https://instagram.com/nam7sh

---

<div align="center">

## If you like GymSync, consider giving the repository a Star!

**Built with HTML, CSS and vanilla JavaScript.**

</div>
