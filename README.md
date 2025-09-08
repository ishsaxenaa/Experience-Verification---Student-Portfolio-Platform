# ExperienceHub

ExperienceHub is a full-stack web application designed to simplify the process of verifying student experiences and showcasing them in a professional, sharable portfolio. The platform empowers organizations to officially validate student achievements, while providing students with a centralized, secure space to build and share their verified accomplishments with the world.

## Features

ExperienceHub is built around two primary user dashboards:

-   **Organization Dashboard**:
    -   **Experience Management**: Organizations can add student experiences with details like activity name, dates, descriptions, and achievement levels (e.g., Participation, Winner).
    -   **Document Uploads**: Supporting documents can be uploaded for each experience to provide proof of participation.
    -   **Verification Workflow**: A simple workflow allows organizations to manage the status of experiences (Pending, Verified, or Rejected).

-   **Student Portfolio**:
    -   **Personalized Profile**: Students can create a custom profile with a bio, skills, and links to professional platforms like GitHub, LinkedIn, and Figma.
    -   **Experience Display**: Students can view and manage experiences pushed by organizations, with the option to accept or decline entries.
    -   **Shareable Portfolio**: Each student can generate a unique, public URL to share their verified portfolio with recruiters, universities, or peers.

## Technical Stack

-   **Frontend**: React.js with a responsive, modern interface.
-   **Backend**: Node.js REST API.
-   **Database**: MongoDB for flexible data storage and efficient querying.
-   **Authentication**: Secure, JWT-based authentication for both user types.
-   **File Management**: Multer for handling secure file uploads (e.g., PDF, images).
-   **Styling**: Tailwind CSS for a utility-first, modern design.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository**: `git clone [repository-url]`
2.  **Install dependencies**:
    -   For the backend: `cd backend && npm install`
    -   For the frontend: `cd frontend && npm install`
3.  **Set up environment variables**:
    -   Create a `.env` file in the `backend` directory.
    -   Add your MongoDB connection string, JWT secret, and other necessary variables.
4.  **Run the application**:
    -   Start the backend server: `npm start`
    -   Start the frontend application: `npm start`

The application will be accessible at `http://localhost:3000`.


<img width="1377" height="761" alt="Screenshot 2025-09-08 at 4 09 16 PM" src="https://github.com/user-attachments/assets/aea40762-c0a0-4564-9459-f0f9dcc0826a" />

