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

Landing Page

<img width="1377" height="761" alt="Screenshot 2025-09-08 at 4 09 16 PM" src="https://github.com/user-attachments/assets/aea40762-c0a0-4564-9459-f0f9dcc0826a" />


Register/Login


<img width="456" height="435" alt="Screenshot 2025-09-08 at 4 12 07 PM" src="https://github.com/user-attachments/assets/a8752983-995c-4654-8ac5-59387a984854" />


Organization Dashboard

<img width="1285" height="778" alt="Screenshot 2025-09-08 at 4 13 08 PM" src="https://github.com/user-attachments/assets/34c0b8d3-f4a1-467c-9bfb-bd658efa2ac5" />


Student Dashboard

<img width="1412" height="757" alt="Screenshot 2025-09-08 at 4 12 22 PM" src="https://github.com/user-attachments/assets/7fe80a71-ace6-4fc4-95d6-92d30c095d30" />

Student Details


<img width="299" height="666" alt="Screenshot 2025-09-08 at 4 12 33 PM" src="https://github.com/user-attachments/assets/4e5b6a14-08bd-4899-940b-c467232cdda8" />

Public Portfolio URL



<img width="314" height="379" alt="Screenshot 2025-09-08 at 4 12 40 PM" src="https://github.com/user-attachments/assets/8493dcc5-faff-4f34-9f49-21916ef7eeab" />



Published Public Portfolio

<img width="1295" height="808" alt="Screenshot 2025-09-08 at 4 13 55 PM" src="https://github.com/user-attachments/assets/3ce34472-f86c-43bd-8781-fe3621028aa0" />

