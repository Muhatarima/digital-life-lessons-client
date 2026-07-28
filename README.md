
# Digital Life Lessons

A full-stack platform where users can create, store, and share meaningful life lessons, personal growth insights, and wisdom gathered over time. Users can organize lessons, mark favorites, track progress, and browse public lessons shared by others.

## Live URL
- **Client:** https://digital-life-lessons-client-two.vercel.app
- **Server:** https://digital-life-lessons-server-abw1.onrender.com

## Purpose
People often learn valuable life lessons but forget them over time. Digital Life Lessons helps preserve personal wisdom, encourages mindful reflection, and allows users to grow by exploring lessons shared by a community of real experiences.

## Key Features
- Email/password and Google authentication via Better Auth
- Create, edit, delete personal life lessons with category, emotional tone, visibility, and access level
- Public lesson browsing with search, category/tone filtering, sorting, and pagination
- Lesson details page with likes, favorites, comments, and reporting
- Free and Premium tiers with Stripe one-time payment (Lifetime access)
- User dashboard: overview stats, my lessons, favorites, editable profile
- Admin dashboard: platform stats, user management, lesson moderation, reported content review
- Home page with hero slider, featured lessons, animated benefits section, top contributors, and most-saved lessons
- Fully responsive design across mobile, tablet, and desktop

## Tech Stack
- **Frontend:** Next.js (Pages Router), React, Tailwind CSS v4, HeroUI, Framer Motion, Swiper
- **Backend:** Express.js, Native MongoDB Driver
- **Auth:** Better Auth (email/password + Google OAuth)
- **Payments:** Stripe Checkout (test mode)
- **Database:** MongoDB Atlas

## npm Packages Used

### Client
- next
- react, react-dom
- better-auth
- @heroui/react
- framer-motion
- axios
- react-hot-toast
- swiper
- tailwindcss

### Server
- express
- mongodb
- cors
- dotenv
- better-auth
- stripe
- nodemon (dev dependency)

## Environment Variables

### Client (`.env.local`)
```

NEXT_PUBLIC_SERVER_URL=your_server_url
```

### Server (`.env`)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=your_server_url
CLIENT_URL=your_client_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Getting Started

### Client
```bash
cd client
npm install
npm run dev
```

### Server
```bash
cd server
npm install
npm run dev
```

## Project Structure
```
client/
  src/
    components/     # Navbar, Footer, Layout
    hook/           # useProtectedRoute, useAdminRoute
    lib/            # auth-client config
    pages/
      dashboard/    # user + admin dashboard pages
      lessons/      # lesson details page
      payment/      # success/cancel pages
      public-lessons.js
      pricing.js
      login.js
      register.js
      index.js      # home page
    styles/
server/
  lib/              # better-auth config
  server.js         # all API routes
```

## Author
Muhatarima — HAAB
