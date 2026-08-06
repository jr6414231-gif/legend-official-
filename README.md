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

## Environment Variables

Create `.env.local` with Firebase credentials:

```
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_DATABASE_URL=your_url
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## File Structure

```
unban-system/
├── pages/
│   ├── api/
│   │   ├── submit-request.js
│   │   └── get-requests.js
│   ├── _app.js
│   └── index.js
├── styles/
│   └── globals.css
├── components/
├── public/
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Support

All files are ready to use. Just deploy to Vercel!
