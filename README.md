# Unban Request System

Professional unban request management system with admin dashboard.

## Features
- Beautiful dark theme UI
- Request form with validation
- Admin dashboard with login
- Firebase integration ready
- Mobile responsive
- 100% secure

## Quick Start

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

## Admin
- Click "Admin" tab
- Password: `admin123`

## Deploy to Vercel
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables from `.env.example`
4. Deploy!

## File Structure

```
legend-official/
├── pages/
│   ├── _app.js
│   ├── index.js
│   └── api/
│       ├── submit-request.js
│       └── get-requests.js
├── styles/
│   └── globals.css
├── components/
├── public/
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
└── README.md
```

## Environment Variables

Create `.env.local` with Firebase credentials from `.env.example`
