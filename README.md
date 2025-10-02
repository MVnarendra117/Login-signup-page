# Login-signup-page

# Modern Login & Signup (HTML/CSS/JS)

A clean, responsive UI with strong password validation, show/hide password toggles, and localStorage-based demo auth.

## Features
- Modern, responsive design
- Login and Signup forms
- Strong password rules:
  - At least 8 characters
  - One uppercase
  - One lowercase
  - One number
  - One special character
- Inline error messages
- “Remember me” support
- Local demo storage (no backend)
- Toast notifications for success/error

## Tech Stack
- HTML5, CSS3
- Vanilla JavaScript (no frameworks)
- Font Awesome (icons)

## Project Structure
/ (project root)
├─ index.html
├─ style.css
├─ script.js
└─ README.md


## Getting Started
1. Clone or download the repo.
2. Open `index.html` in your browser.

No build step required.

## How It Works (Demo Auth)
- Signup stores user data in `localStorage`.
- Login checks email/password against saved users.
- “Remember me” saves the session in `localStorage`; otherwise `sessionStorage`.

## Password Rules
A valid password must include:
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character

If any are missing, the form shows a single error message describing what's required.

## Common Customizations
- Change brand text/icon in `index.html`.
- Update colors and spacing in `style.css`.
- Adjust password policy in `script.js` → `validatePassword()`.

## Deploy to GitHub Pages
1. Push to a GitHub repo.
2. Repo Settings → Pages → Source: “Deploy from a branch” → main → /root.
3. Wait ~1 minute for your live URL.

## Notes
- This is a front‑end demo only; do not store real credentials.
- For production, replace localStorage with real API calls and secure session handling.

## License
MIT
