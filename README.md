# Lost & Found

This is a full-stack Lost & Found web app built with Node.js, Express, EJS, Passport, and MongoDB.

Users can:
- register/login
- post lost/found notices with optional images
- browse and search notices
- reply to notices
- manage their profile (nickname, email, password, profile image)

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB + Mongoose
- Views: EJS
- Auth: Passport Local + express-session
- File Upload: Multer
- UI: Bootstrap 5 + custom CSS

## Project Structure

```text
integrated_project/
├─ config/
│  ├─ db.js
│  └─ passport.js
├─ controllers/
│  ├─ authController.js
│  ├─ noticeController.js
│  └─ profileController.js
├─ middleware/
│  └─ authMiddleware.js
├─ models/
│  ├─ User.js
│  └─ Notice.js
├─ public/
│  ├─ css/styles.css
│  └─ js/
│     ├─ main.js
│     └─ profile.js
├─ routes/
│  ├─ authRoutes.js
│  ├─ noticeRoutes.js
│  └─ profileRoutes.js
├─ utils/
│  └─ passwordPolicy.js
├─ views/
│  ├─ layout.ejs
│  ├─ index.ejs
│  ├─ login.ejs
│  ├─ register.ejs
│  ├─ notices.ejs
│  ├─ notice_form.ejs
│  └─ profile.ejs
├─ server.js
└─ package.json
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

## Setup and Run

```bash
npm install
npm run dev
```

Or production mode:

```bash
npm start
```

Open: `http://localhost:3000`

## Core Features

### 1. Authentication
- Register with `login_id`, `nickname`, `email`, `password`, optional profile image
- Login via Passport local strategy (`login_id` + `password`)
- Session-based auth with persistent login

### 2. Notices
- Create lost/found notices (`type`, `date`, `venue`, `contact`, `description`, optional image)
- View all notices or only your notices
- Reply to notices
- Delete only your own notices
- Client-side search filter on notices page

### 3. Profile
- Update nickname/email (requires current password)
- Update password (current password, confirm check, policy check, and must differ from old password)
- Update profile image by clicking existing image/placeholder

## Centralized Password Policy

Password validation is centralized in:

- `utils/passwordPolicy.js`

Current default:
- minimum length = 8

Used by:
- registration (`controllers/authController.js`)
- password change (`controllers/profileController.js`)

UI text in register/profile pages uses `passwordMinLength` exposed from `server.js` (`res.locals.passwordMinLength`), so changing policy constants updates display hints consistently.

## Route Map

### Auth Routes (`routes/authRoutes.js`)
- `GET /` home
- `GET /register` register page
- `POST /register` register user (+ optional profile image upload)
- `GET /login` login page
- `POST /login` login
- `GET /logout` logout

### Notice Routes (`routes/noticeRoutes.js`)
- `GET /notices` all notices
- `GET /notices/my` current user's notices (auth required)
- `GET /notices/new` create form (auth required)
- `POST /notices/new` create notice (auth required, optional image upload)
- `POST /notices/:id/reply` reply to notice (auth required)
- `DELETE /notices/:id` delete own notice (auth required + ownership)

### Profile Routes (`routes/profileRoutes.js`)
- `GET /profile` profile page (auth required)
- `POST /profile/update` update nickname/email (auth required)
- `POST /profile/update-password` change password (auth required)
- `POST /profile/update-image` change profile image (auth required, image upload)

## File Upload Rules

- Max image size: `2MB`
- Only MIME types starting with `image/`
- Uploaded under `public/uploads/`

## Data Models

### User
- `login_id` (unique, required)
- `nickname` (required)
- `email` (unique, required)
- `profile_image` (optional)
- `password` (required, hashed with bcrypt pre-save hook)

### Notice
- `type` (`lost` or `found`, required)
- `date` (required)
- `venue`, `contact`, `description`, `image`
- `owner` (User ref)
- `responses[]` with `user`, `message`, `date`

## Notes

- Flash messages are auto-dismissed on frontend.
- Notice image supports modal/lightbox preview.
- Active navbar link is highlighted in `public/js/main.js`.
- Existing `README.md` may be outdated in a few details (this file reflects current implementation).
