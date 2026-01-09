Job Scheduler & Automation System

A full-stack background job management system that allows users to create, track, and execute tasks. The system features a simulated background worker logic and automatically triggers webhooks upon task completion.

🚀 Tech Stack

Frontend: React.js, Tailwind CSS v4 (Styling), Lucide-React (Icons), Axios.

Backend: Node.js, Express.js.

Database: SQLite (SQL-based persistent storage).

Integrations: Webhook.site (for testing automated triggers).

✨ Features

Job Management: Create jobs with specific task names, priority levels (Low, Medium, High), and JSON payloads.

Live Dashboard: View all jobs in a professional data table with real-time status updates.

Filtering: Filter jobs by status (Pending, Running, Completed) or priority.

Execution Simulation:

Jobs start as Pending.

Clicking "Run" moves the job to Running.

After a 3-second simulation, the job transitions to Completed.

Automated Webhooks: Once a job reaches the Completed state, the backend automatically sends a POST request to a configured Webhook URL with the job details.

Responsive UI: Clean, modern dashboard built with Tailwind CSS.

🛠️ How to Run Locally
1. Prerequisites

Node.js installed on your machine.

VS Code.

2. Backend Setup

Navigate to the backend folder:

cd backend

Install dependencies:

npm install

(Optional) Open server.js and update the WEBHOOK_URL with your unique URL from Webhook.site.

Start the server:

node server.js


3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

📈 Database Schema

The system uses a SQLite table named jobs:

id: Primary Key (Auto-increment)

taskName: String

payload: JSON/Text

priority: String (Low/Medium/High)

status: String (Pending/Running/Completed)

createdAt: Timestamp

📸 Screenshots
1. Dashboard & Job Creation

![alt text](https://via.placeholder.com/800x400?text=Dashboard+View+Showing+Job+List)

2. Job Execution (Running State)

![alt text](https://via.placeholder.com/800x400?text=Job+Running+State+with+Spinner)

3. Webhook Success

![alt text](https://via.placeholder.com/800x400?text=Webhook.site+Receiving+Data)

🔗 Submission Details

GitHub Repository: [Insert Your Link Here]

Deployed Application: [Insert Your Link Here (e.g., Vercel/Render)]

Screen Recording: [Insert Your Google Drive/Loom Link Here]

Project Structure

dotix-assignment/
├── backend/
│   ├── db.js          # SQLite Configuration
│   ├── server.js      # Express API & Logic
│   └── jobs.db        # SQLite Database File
├── frontend/
│   ├── src/
│   │   ├── App.jsx    # Main UI Logic
│   │   ├── index.css  # Tailwind v4 Imports
│   │   └── main.jsx   
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
