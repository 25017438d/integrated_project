# Lost & Found

A modern, full-stack web application that helps community members find lost items and report found ones easily. Users can post notices, upload images, and connect with others to help reunite lost items.

## 🎯 Features

- **User Authentication**: Secure registration and login with password hashing using bcryptjs
- **Post Notices**: Create notices for lost or found items with descriptions, location, and contact info
- **Image Upload**: Upload photos of items for better identification
- **Image Lightbox**: Click on images to view them enlarged in a fullscreen modal
- **Reply System**: Community members can reply to notices to provide leads or information
- **Delete Notices**: Users can delete their own notices
- **User Profiles**: Each user has a unique login ID and nickname
- **Flash Messages**: Real-time feedback for user actions (success/error notifications)
- **Responsive Design**: Beautiful gradient UI that works on all devices
- **Active Page Highlighting**: Navigation highlights the current page

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating engine
- **Authentication**: Passport.js with local strategy
- **Styling**: Custom CSS with gradient themes and animations
- **File Upload**: Multer for image uploads
- **Session Management**: Express-session with connect-flash

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB account (Atlas)
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project123
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory
   ```
   PORT=3000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lost-and-found?retryWrites=true&w=majority
   SESSION_SECRET=your_secret_key_here
   ```

   - Replace `username`, `password`, and `cluster` with your MongoDB Atlas credentials
   - Generate a strong `SESSION_SECRET` for security

4. **Start the application**

   **For development** (with auto-reload):
   ```bash
   npm run dev
   ```

   **For production**:
   ```bash
   npm start
   ```

5. **Access the application**
   - Open your browser and go to `http://localhost:3000`

## 📁 Project Structure

```
project123/
├── public/
│   ├── css/
│   │   └── styles.css          # All styling and animations
│   ├── js/
│   │   └── main.js             # Client-side JavaScript
│   └── uploads/                # User uploaded images
├── views/
│   ├── index.ejs               # Home page
│   ├── layout.ejs              # Base layout template
│   ├── login.ejs               # Login page
│   ├── register.ejs            # Registration page
│   ├── notices.ejs             # All notices listing
│   └── notice_form.ejs         # Create notice form
├── models/
│   ├── User.js                 # User schema
│   └── Notice.js               # Notice schema with replies
├── controllers/
│   ├── authController.js       # Auth logic (register, login, logout)
│   └── noticeController.js     # Notice operations (CRUD, replies)
├── routes/
│   ├── authRoutes.js           # Auth routes
│   └── noticeRoutes.js         # Notice routes
├── middleware/
│   └── authMiddleware.js       # Authentication check middleware
├── config/
│   ├── db.js                   # MongoDB connection
│   └── passport.js             # Passport configuration
├── server.js                   # Main server file
├── package.json                # Dependencies
├── .env                        # Environment variables (create this)
└── README.md                   # This file
```

## 🔧 Usage

### 1. **Register a New Account**
   - Click "Register" on the home page
   - Enter your login ID (min 3 characters), nickname, email, and password (min 6 characters)
   - Submit the form

### 2. **Login**
   - Click "Login" on the home page
   - Enter your login ID and password
   - You'll be redirected to the notices page

### 3. **Create a Notice**
   - Click "Create Notice" in the navigation
   - Fill in the form:
     - **Type**: Lost or Found
     - **Description**: Item name/description (will be bolded)
     - **Venue**: Where the item was lost/found
     - **Contact**: Your contact information
     - **Image**: Upload a photo (optional)
   - Click "Submit"

### 4. **View Notices**
   - Click "Notices" to see all community notices
   - Click on any image to view it enlarged in fullscreen
   - Close the image by clicking the X button or the dark background

### 5. **Reply to Notices**
   - Scroll to a notice and enter your reply in the text field
   - Click "Reply" to submit
   - All replies are displayed under the notice

### 6. **Delete Your Notice**
   - Find a notice you created (you'll see the red delete button)
   - Click the "🗑️ Delete" button
   - Confirm the deletion

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs
- **Session Management**: Secure sessions with express-session
- **Authentication Middleware**: Protected routes require login
- **Input Validation**: All user inputs are validated on the backend
- **Email Validation**: Email format is checked during registration

## 🎨 UI/UX Features

- **Gradient Background**: Beautiful purple gradient theme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Fade-in, zoom, and hover effects
- **Alert Messages**: Color-coded success (green) and error (red) messages
- **Active Navigation**: Current page is highlighted in the navbar
- **Image Lightbox**: Full-screen image viewer with smooth animations
- **Card Design**: Modern card-based layout with shadows

## 🔄 API Endpoints

### Authentication Routes
- `GET /` - Home page
- `GET /register` - Registration page
- `POST /register` - Create new account
- `GET /login` - Login page
- `POST /login` - Login with credentials
- `GET /logout` - Logout user

### Notice Routes
- `GET /notices` - View all notices
- `GET /notices/new` - Create notice form (requires login)
- `POST /notices/new` - Submit new notice (requires login)
- `DELETE /notices/:id` - Delete notice (requires ownership)
- `POST /notices/:id/reply` - Reply to notice (requires login)

## 🚀 Future Enhancements

- [ ] Search and filter notices by type/location
- [ ] User profile pages with user history
- [ ] Email notifications for replies
- [ ] Mark notices as resolved/found
- [ ] Direct messaging between users
- [ ] Rating/review system
- [ ] Category tags for items
- [ ] Admin dashboard
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created as a community service project for Lost & Found management.

## 📞 Support

For issues or questions, please open an issue on the repository.

## 🙏 Acknowledgments

- Express.js for the backend framework
- MongoDB for the database
- Passport.js for authentication
- EJS for templating
- All contributors and testers

---

