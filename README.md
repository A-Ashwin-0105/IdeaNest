# IdeaNest — Collaborative Idea Management & Validation Platform

A full-stack web application that acts as a central hub for idea creation, collaboration, validation, and investor connection. Built with pure HTML, CSS, and JavaScript — no frameworks, no backend, no dependencies.

---

## About

IdeaNest solves the problem of great ideas being lost by giving innovators a single platform to submit, validate, collaborate on, and fund their ideas. The community votes and gives feedback, investors discover promising concepts, and teams form around the best ones.

All data is stored in the browser's localStorage — no server setup required.

---

## Features

- **Landing Page** — Animated hero section, feature highlights, how-it-works walkthrough
- **Authentication** — Register as Innovator, Collaborator, or Investor. Login with email and password
- **Dashboard** — Live stats, trending ideas, recent activity feed, category chart
- **Explore Ideas** — Browse, filter by category, search, sort by votes/newest/comments, upvote
- **Submit Idea** — Structured form with live card preview, progress bar, stage selection, team needs
- **Find Investors** — Browse investor profiles, filter by focus area, send pitch with idea selection
- **My Ideas** — Track ideas through lifecycle: Concept → Validated → In Progress → Funded → Launched
- **Collaborations** — Browse ideas looking for team members, apply to open roles
- **Profile** — Edit profile, view stats, manage settings

---

## Tech Stack

- HTML5
- CSS3 with custom properties, Grid, and Flexbox
- Vanilla JavaScript ES6+
- localStorage API for data persistence
- Google Fonts — Playfair Display and DM Sans
- Font Awesome 6 for icons

---

## File Structure

```
IdeaNest/
├── index.html
├── README.md
├── LICENSE
├── .gitignore
│
├── css/
│   ├── style.css       — Global variables, reset, shared components
│   ├── landing.css     — Landing page styles
│   └── app.css         — Dashboard and app page styles
│
├── js/
│   ├── data.js         — localStorage data layer and seed data
│   ├── app.js          — Shared utilities (toast, modal, voting, card builder)
│   ├── auth.js         — Login and register logic
│   ├── landing.js      — Scroll animations
│   ├── dashboard.js    — Dashboard stats and activity feed
│   ├── explore.js      — Filter, search, sort logic
│   ├── investors.js    — Investor cards and pitch modal
│   └── submit.js       — Idea form and live preview
│
└── pages/
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── explore.html
    ├── submit-idea.html
    ├── investors.html
    ├── my-ideas.html
    ├── collaborations.html
    └── profile.html
```

---

## Getting Started

**Open directly**

Download or clone the repository and double-click `index.html`. No server needed.

**VS Code Live Server**

Open the folder in VS Code, right-click `index.html`, and select Open with Live Server.

**Demo Login**

Use any email address with password `demo123`, or register a new account.

---

## Data Storage

All data is stored in localStorage under these keys:

| Key | Contents |
|-----|----------|
| `ideaNestIdeas` | All submitted ideas with votes and comments |
| `ideaNestUser` | Currently logged-in user |
| `ideaNestRegistered` | All registered accounts |
| `ideaNestInvestors` | Investor profiles |
| `ideaNestPitches` | Pitch messages sent to investors |

---

## Deploying to GitHub Pages

1. Push the repository to GitHub
2. Go to Settings → Pages
3. Set source to the main branch, root folder
4. Save — the site will be live at `https://YOUR_USERNAME.github.io/IdeaNest/`

---

## Future Enhancements

- Backend integration with Node.js and MongoDB
- Real authentication with JWT and OAuth
- Real-time updates with WebSockets or Firebase
- Email notifications for votes and comments
- AI-powered idea feedback and market analysis
- Mobile app with React Native

---
