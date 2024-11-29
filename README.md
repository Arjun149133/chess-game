# Multiplayer Real-Time Chess Application

## About the Game

- **Sign In or Play as Guest**: Users can either sign in with an account or play as a guest.
- **Spectate Ongoing Games**: Users can join and spectate live chess matches.
- **Chess Rating System**: Players are assigned an Elo rating based on their performance in matches.

## Tech Stack

- **Frontend**: Next.js (React framework)
- **Backend**: Express.js (Node.js)
- **Real-Time Game Handling**: WebSocket server

---

## Setting Up Locally

To run this project locally, follow these steps:

1. **Clone the Repository**:

   - First, clone the repository to your local machine using:
     ```bash
     git clone <repository-url>
     cd <repository-name>
     ```

2. **Copy Environment Variables**:

   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```

3. **Update the `.env` File**:

   - Open the `.env` file and update the following variables:

     - **PostgreSQL Database Credentials**:
       - `DB_HOST` = your database host (e.g., `localhost`)
       - `DB_USER` = your database username
       - `DB_PASSWORD` = your database password
       - `DB_NAME` = your database name
     - **Google Auth Credentials**:
       - `GOOGLE_CLIENT_ID` = your Google OAuth client ID
       - `GOOGLE_CLIENT_SECRET` = your Google OAuth client secret

4. **Install Dependencies**:

   - In the root directory of the project, run:
     ```bash
     npm install
     ```

5. **Start the WebSocket Server**:

   - Navigate to the `apps/ws` directory and run the WebSocket server:
     ```bash
     cd apps/ws
     npm run dev
     ```

6. **Start the Backend**:

   - Navigate to the `apps/backend` directory and run the backend server:
     ```bash
     cd apps/backend
     npm run dev
     ```

7. **Start the Frontend**:
   - Finally, navigate to the `apps/frontend` directory and run the frontend app:
     ```bash
     cd apps/frontend
     npm run dev
     ```

---

## Additional Notes

- **Database**: Ensure your PostgreSQL database is running and the connection details in your `.env` file are correct.
- **Error Logs**: If you encounter issues, check the logs in each service (WebSocket server, backend, and frontend) for detailed error messages.
- **Production Setup**: In a production environment, you may need to configure additional settings, such as environment variables, hosting services, and more robust authentication mechanisms.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
