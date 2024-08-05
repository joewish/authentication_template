# Node.js Authenticator

A robust and scalable authentication system built with Node.js, Express, MongoDB, and other modern web technologies. This project includes essential features like email and Google login/signup, password reset and more.

## Features

- **Email Signup/Login:** Register and log in with email and password.
- **Google OAuth:** Sign up and log in using Google account.
- **Password Reset:** Reset password via email.
- **Notifications:** Alerts for unmatching passwords and incorrect password attempts.
- **Scalable Folder Structure:** Organized project structure for easy maintenance and scalability.
- **Parallel Jobs:** Efficient handling of asynchronous tasks like sending emails.
- **Comprehensive Documentation:** Detailed comments and README for setup and usage.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js (for authentication)
- Nodemailer (for sending emails)
- Google reCAPTCHA (yet to be implemented)
- EJS (for templating)
- dotenv (for environment variables)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Developer Console account (for OAuth and reCAPTCHA)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/nodejs-authenticator.git
   cd nodejs-authenticator
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```bash
   PORT=3000
   MONGO_URI=your_mongo_connection_string
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
   EMAIL_HOST=smtp.your-email-provider.com
   EMAIL_PORT=3000
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

## Usage

1. **Start the server:**

   ```bash
   npm start
   ```

2. **Access the application:**

   Open your browser and go to `http://localhost:3000`.

## Folder Structure

```plaintext
nodejs-authenticator/
├── controllers/        # Route controllers
├── models/             # Mongoose models
├── routes/             # Express routes
├── views/              # EJS templates
├── utils/              # Utility functions
├── public/             # Static files (CSS, JS, images)
├── .env                # Environment variables
├── .gitignore          # Files to ignore in git
├── app.js              # Main application file
├── package.json        # NPM dependencies and scripts
├── README.md           # Project documentation
```

## API Endpoints

### Auth Routes

- **POST /signup**: Register a new user
- **POST /login**: Login a user
- **GET /logout**: Logout the current user
- **POST /forgot-password**: Send password reset email
- **POST /reset-password/:token**: Reset password with token
- **GET /auth/google**: Google OAuth login
- **GET /auth/google/callback**: Google OAuth callback

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to customize this template according to your project's specific needs. Let me know if you need any more details or additional sections!