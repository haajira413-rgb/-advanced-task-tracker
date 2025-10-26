============================================

FILE 1: README.md

============================================

Advanced Task Tracker - Full-Stack Productivity App

Show Image

Show Image

Show Image

Show Image

A modern, full-stack task management application built with TypeScript, React, and Node.js. Features a beautiful UI powered by Tailwind CSS and efficient data management with Drizzle ORM.

✨ Features

📋 Task Management



✅ Create, edit, and delete tasks with rich details

🏷️ Organize tasks with categories and tags

📅 Set due dates and receive reminders

🎯 Priority levels (High, Medium, Low)

✔️ Mark tasks as complete/incomplete



🎨 User Experience



🌙 Dark/Light mode toggle

📱 Fully responsive design (mobile, tablet, desktop)

⚡ Fast and smooth interactions

🔍 Advanced search and filtering

📊 Progress tracking dashboard



🔧 Technical Features



🔐 User authentication

💾 Persistent data storage

🚀 Optimized performance

📡 Real-time updates

🎯 Type-safe with TypeScript



🛠️ Technology Stack

Frontend



Framework: React 18+

Build Tool: Vite

Language: TypeScript

Styling: Tailwind CSS

UI Components: shadcn/ui

State Management: React Hooks / Context API



Backend



Runtime: Node.js

Language: TypeScript

Database ORM: Drizzle ORM

API: RESTful



Development Tools



Package Manager: npm

Version Control: Git



📦 Installation \& Setup

Prerequisites

Ensure you have the following installed:



Node.js: v18.0.0 or higher

npm: v9.0.0 or higher

Git: Latest version



Step 1: Clone the Repository

bashgit clone https://github.com/haajira413-rgb/-advanced-task-tracker.git

cd AdvancedTaskTracker

Step 2: Install Dependencies

bashnpm install

Step 3: Environment Configuration

Create a .env file in the root directory:

bashcp .env.example .env

Edit .env with your configuration (see .env.example for all options)

Step 4: Database Setup

bash# Generate database migrations

npm run db:generate



\# Run migrations

npm run db:migrate



\# (Optional) Seed database

npm run db:seed

Step 5: Start Development Server

bashnpm run dev

Step 6: Access the Application



Frontend: http://localhost:5173

Backend API: http://localhost:5000



📁 Project Structure

AdvancedTaskTracker/

├── client/                    # Frontend React application

│   ├── src/

│   │   ├── components/       # Reusable UI components

│   │   ├── pages/           # Application pages

│   │   ├── hooks/           # Custom React hooks

│   │   ├── lib/             # Utility functions

│   │   ├── types/           # TypeScript type definitions

│   │   └── App.tsx          # Main App component

│   └── index.html           # Entry HTML file

│

├── server/                   # Backend Node.js application

│   ├── src/

│   │   ├── routes/          # API routes

│   │   ├── controllers/     # Request handlers

│   │   ├── models/          # Database models

│   │   ├── middleware/      # Express middleware

│   │   └── index.ts         # Server entry point

│

├── shared/                   # Shared code between client/server

│   └── types/               # Shared TypeScript types

│

├── .github/                 # GitHub templates

├── dist/                    # Build output

├── node\_modules/           # Dependencies

│

├── drizzle.config.ts       # Drizzle ORM configuration

├── vite.config.ts          # Vite configuration

├── tailwind.config.ts      # Tailwind CSS configuration

├── tsconfig.json           # TypeScript configuration

├── package.json            # Project dependencies

├── .gitignore             # Git ignore rules

├── .env.example           # Environment variables template

└── README.md              # This file

🚀 Available Scripts

bash# Development

npm run dev              # Start both client and server

npm run client           # Start frontend only

npm run server           # Start backend only



\# Building

npm run build            # Build for production

npm run preview          # Preview production build



\# Database

npm run db:generate      # Generate migrations

npm run db:migrate       # Run migrations

npm run db:studio        # Open Drizzle Studio



\# Testing

npm test                 # Run tests

npm run test:coverage    # Generate coverage report

🎯 Usage Guide

Creating a Task



Click the "+ New Task" button

Fill in task details (title, description, due date, priority)

Click "Save" to create the task



Managing Tasks



Edit: Click the edit icon on any task card

Delete: Click the delete icon

Complete: Check the checkbox to mark as done

Filter: Use dropdown menus to filter tasks

Search: Use the search bar to find specific tasks



Keyboard Shortcuts



Ctrl/Cmd + N - Create new task

Ctrl/Cmd + K - Focus search

Ctrl/Cmd + D - Toggle dark mode



🚀 Deployment

Build for Production

bashnpm run build

Deploy to Vercel

bashvercel --prod

🤝 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for details.

📝 Changelog

See CHANGELOG.md for version history.

📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

👤 Author

Haajira



GitHub: @haajira413-rgb

Project: Advanced Task Tracker



🙏 Acknowledgments



Built with Vite

Styled with Tailwind CSS

Database ORM by Drizzle





Made with ❤️ and TypeScript

===========================================

