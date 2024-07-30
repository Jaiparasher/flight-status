Real-Time Flight Status Monitoring Application
Overview
This project is a full-stack application designed for real-time flight status monitoring. It allows users to register, log in, view flight details, and receive notifications about flight status changes through Firebase Cloud Messaging (FCM).

Table of Contents
Technologies
Backend Overview
Technologies and Libraries
Components
Key Features
Frontend Overview
Technologies and Libraries
Components
Integration and Flow
Challenges and Solutions
Setup and Installation
Backend Setup
Frontend Setup
Conclusion
Technologies
Backend
Flask
Flask-SocketIO
PyMongo
Firebase Admin SDK
Logging
Frontend
React.js
React Router
Firebase
Axios
Tailwind CSS
Backend Overview
Technologies and Libraries
Flask: Lightweight web framework for building the RESTful API.
Flask-SocketIO: Provides WebSocket support for real-time communication.
PyMongo: MongoDB driver for Python to interact with the database.
Firebase Admin SDK: Sends notifications through Firebase Cloud Messaging (FCM).
Logging: Captures logs and aids in debugging.
Components
Database Models
User Model: Stores user information, including full name, email, hashed password, and flight reference ID.
Flight Model: Contains details about flights such as flight number, status, departure, arrival, origin, and destination.
APIs
User Routes: Handles user registration (/register) and login (/login). Issues JWT tokens upon successful authentication.
Flight Routes: Provides endpoints to fetch flight details (/flights) and real-time updates through WebSocket.
User Info: Fetches the current user’s details based on the JWT provided in the request headers (/me).
WebSocket Server
Socket Events: Manages WebSocket connections, sends initial flight data upon connection, and listens for flight status updates.
Notification Service: Uses Firebase Admin SDK to send notifications when flight statuses change. Notifications are sent only if there is a change compared to previous statuses.
Key Features
Real-Time Flight Updates: Emits flight status updates over WebSocket connections.
Authentication: Secure user authentication with JWTs, managing user sessions effectively.
Logging: Comprehensive logging for debugging and monitoring.
Frontend Overview
Technologies and Libraries
React.js: JavaScript library for building user interfaces.
React Router: Manages routing within the application.
Firebase: Handles notifications and messaging.
Axios: Makes HTTP requests to the backend API.
Tailwind CSS: Utility-first CSS framework for styling.
Components
Auth Service (authService.js)
Manages user authentication by interfacing with backend endpoints for login and registration. Stores the JWT token in local storage upon successful login.
Firebase Service (firebaseService.js)
Configures Firebase, requests notification permissions, and handles foreground and background messages. Manages the Firebase Cloud Messaging (FCM) token and integrates with the browser’s notification system.
Socket Service (SocketService.js)
Initializes and manages the WebSocket connection, listens for flight updates, and triggers notifications when there are changes. Ensures notifications are sent only when a flight status changes compared to the previous state.
React Hooks
useAuth.js: Manages user authentication state, including fetching user details and handling token-based authentication.
useFlight.js: Provides flight-related data and integrates with the WebSocket service to update flight information in real-time.
Pages
LoginPage.jsx: A login form that authenticates users and redirects to the homepage upon successful login.
SignupPage.jsx: A registration form that allows users to sign up and then redirects to the login page.
Homepage.jsx: Displays the user’s flight details and integrates with WebSocket for real-time updates. Shows notifications when flight statuses change.
App Component (App.jsx)
Sets up the routing for the application and integrates Firebase and WebSocket services. Ensures users are authenticated and manages notifications using react-toastify for displaying alerts.
Integration and Flow
User Registration and Login: Users can sign up and log in via the provided forms. Upon successful login, a JWT token is stored in local storage and used for subsequent API requests.
Fetching User Details: The useAuth hook fetches user details from the backend using the JWT token. This information is then used to personalize the user experience on the homepage.
Real-Time Flight Updates: The frontend subscribes to flight updates through a WebSocket connection. When flight status updates are received, the SocketService.js handles the update and triggers a notification if the status has changed from the previous one.
Notification Handling: The firebaseService.js manages notifications. It requests permission from users to send notifications and displays them when flight status updates are received. Notifications are shown only if there is a change in status, avoiding redundant alerts.
Challenges and Solutions
CORS Issues: Initially, there were issues with Cross-Origin Resource Sharing (CORS) blocking requests between frontend and backend. This was resolved by configuring the backend to include the necessary CORS headers.
Service Worker Registration: Problems with the service worker registration for Firebase notifications were addressed by ensuring the correct MIME type for the service worker file and resolving any import issues.
Notification Duplication: To prevent duplicate notifications, the logic was adjusted to compare the current flight status with the previous one before sending a notification.
Setup and Installation
Backend Setup
Clone the repository and navigate to the backend directory:

sh
Copy code
git clone <repository-url>
cd flight-status-backend
Create and activate a virtual environment:

sh
Copy code
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
Install the required packages:

sh
Copy code
pip install -r requirements.txt
Set up environment variables for Flask and Firebase Admin SDK.

Start the backend server:

sh
Copy code
flask run
Frontend Setup
Navigate to the frontend directory:

sh
Copy code
cd flight-status-frontend
Install the required packages:

sh
Copy code
npm install
Set up the Firebase configuration in firebaseService.js.

Start the frontend development server:

sh
Copy code
npm start
Conclusion
The Real-Time Flight Status Monitoring Application is a comprehensive solution for tracking flight statuses and receiving real-time updates. It integrates secure user authentication, real-time WebSocket communication, and notification handling through Firebase Cloud Messaging. This project demonstrates the effective use of modern web technologies to create a responsive and interactive user experience.

By following the setup instructions, you can deploy and run this application locally, providing users with a seamless way to monitor their flights and receive timely notifications about status changes.
