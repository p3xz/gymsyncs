# 🏋️ GymSync

<div align="center">

<img src="assets/logo.svg" width="120" alt="GymSync Logo">

# GymSync

### Premium Offline Fitness Tracker

*A modern Apple-inspired fitness tracker built with HTML, CSS & Vanilla JavaScript.*

**Currently in Phase 7**

![Version](https://img.shields.io/badge/version-v0.7.0-4CAF50?style=for-the-badge)
![Phase](https://img.shields.io/badge/Phase-7-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Active%20Development-orange?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

# 📖 About

GymSync is my long-term software engineering project that I'm building throughout my Bachelor of Computer Applications (BCA).

Instead of creating dozens of disconnected tutorial projects, I chose to continuously improve one real-world application while learning modern software engineering.

Every phase introduces new features, cleaner architecture, and better coding practices.

The current version is built using only:

- HTML5
- CSS3
- Vanilla JavaScript
- Local Storage API

No frameworks. No backend. Just strong fundamentals.

---

# ✨ Features

## 👋 First Launch Experience

- Welcome onboarding screen
- User name setup
- Local Storage persistence
- Returning users skip onboarding automatically

---

## 🏠 Dashboard

- Personalized greeting
- Live digital clock
- Current day
- Current date
- Today's workout split
- Motivational quotes
- Start Workout button

---

## 📊 Dashboard Statistics

- 🔥 Workout streak
- ✅ Weekly completion
- 🕒 Last workout

---

## 🧠 Workout Logic Engine *(New in Phase 4)*

- Automatic weekday → split resolution (Push / Pull / Legs / Rest)
- Every split now carries a real exercise database — name, target sets, and
  target rep range for each movement
- One resolver function (`getTodaysWorkout()`) returns the full day's workout
  in a single call, so every future screen (Workout, History) pulls from the
  same source of truth instead of duplicating the logic
- Dashboard now reflects it live — e.g. *"5 exercises scheduled"* instead of
  a static label

---

## 🕓 History *(New in Phase 7)*

- Full workout history log, newest first
- Every past entry expands to show each exercise's logged weight and notes
- Total workouts and current streak shown at a glance
- Honest empty state until the first workout is finished

---

## 🎉 Workout Summary *(New in Phase 6)*

- Congratulations screen shown after Finish Workout
- Workout duration, exercises completed, and an estimated calories burned
- Real persistence: streak, weekly completion, and last workout now save to
  Local Storage — the dashboard stats are no longer placeholders
- Streak logic only advances once per calendar day and resets if a training
  day is missed
- Weekly completion count resets automatically each Monday

---

## 🏋️ Workout Screen *(New in Phase 5)*

- Live elapsed timer, starts the moment a training day's workout is opened
- Exercise cards rendered straight from the Phase 4 workout-logic engine
- Per-exercise weight and notes input
- Custom, accessible completed checkbox per exercise
- Live progress bar tracking exercises completed
- Finish Workout flow (full save + summary screen arrive in Phase 6)
- Dedicated Rest Day state on days with nothing scheduled

---

## 🧭 Navigation

- Responsive sidebar (Desktop)
- Bottom navigation (Mobile)
- Animated active indicator
- Smooth page transitions

---

## 🎨 User Interface

- Apple-inspired design
- Dark mode
- Glassmorphism
- Mobile-first
- Responsive layout
- Smooth animations

---

## 💾 Storage

- Local Storage
- Offline-first
- Persistent user profile

---

# 📅 Workout Split

| Day | Workout | Exercises |
|------|----------|----------|
| Monday | Push | 5 |
| Tuesday | Pull | 5 |
| Wednesday | Legs | 5 |
| Thursday | Push | 5 |
| Friday | Pull | 5 |
| Saturday | Legs | 5 |
| Sunday | Recovery | — |

---

# 📸 Screenshots

Screenshots will be added as development progresses.

```
assets/screenshots/
```

---

# 🛠 Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript (ES6)

### Storage

- Local Storage API

### Tools

- Git
- GitHub
- VS Code

### Deployment

- GitHub Pages
- Vercel

---

# 📂 Project Structure

```text
GymSync/
│
├── assets/
│   ├── logo.svg
│   ├── images/
│   └── screenshots/
│
├── docs/
│   ├── CHANGELOG.md
│   ├── LEARNING.md
│   └── WHY.md
│
├── index.html
├── style.css
├── script.js
│
├── README.md
├── LICENSE
└── .gitignore
```

---

# 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/namish-yadav/gymsyncs.git
```

Open the project

```bash
cd gymsyncs
```

Run using VS Code Live Server

or simply open

```text
index.html
```

inside your browser.

---

# 📈 Development Progress

## ✅ Phase 1

- Project setup
- Responsive layout
- Dark theme
- Navigation system

---

## ✅ Phase 2

- First-launch onboarding
- User profile setup
- Local Storage integration

---

## ✅ Phase 3

- Personalized dashboard
- Live clock
- Current day & date
- Workout split
- Dashboard statistics
- Motivational quotes
- Improved UI
- Responsive navigation

---

## ✅ Phase 4

- Automatic workout-split resolution engine
- Per-split exercise database (sets & rep targets)
- Single `getTodaysWorkout()` source of truth for later phases
- Dashboard now shows live exercise counts

---

## ✅ Phase 5

- Live workout timer
- Exercise cards with weight & notes input
- Completed checkbox per exercise
- Live progress bar
- Finish Workout flow
- Rest Day state on the Workout tab

---

## ✅ Phase 6

- Congratulations / summary screen
- Duration, exercises completed & calories burned
- Streak, weekly completion & last workout now persist for real
- Dashboard stats reflect actual saved progress

---

## ✅ Phase 7 (Current)

- Full workout history log
- Expandable entries showing per-exercise weight & notes
- Total workouts & streak summary
- Empty state for new users

---

## 🚧 Next Phase

- Animation & micro-interaction pass
- Mobile & performance optimization

---

# 🛣 Roadmap

## Phase 8 — Polish

- Animation & micro-interaction pass
- Mobile & performance optimization

## Future Releases

- React
- Backend
- Authentication
- Cloud Sync
- Mobile App
- Nutrition Tracking
- AI Workout Coach
- Smart Analytics

---

# 🎯 Project Goal

GymSync isn't just another gym tracker.

It's a long-term software engineering project that documents my journey from beginner web developer to full-stack software engineer.

Instead of abandoning projects after learning a concept, I continuously improve one application while learning new technologies.

Every commit represents another step in that journey.

---

# 🤝 Contributing

This is currently a personal learning project.

Suggestions, feature requests, and feedback are always welcome.

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

**Namish Yadav**

- GitHub: https://github.com/namish-yadav
- LinkedIn: https://www.linkedin.com/in/namish-yadav-639769408/
- Instagram: https://instagram.com/nam7sh

---

<div align="center">

## ⭐ If you like GymSync, consider giving the repository a Star!

**Built with ❤️ using HTML, CSS & Vanilla JavaScript.**

</div>