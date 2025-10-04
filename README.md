
# Project Hub: B.Tech Project Marketplace

## 1. Project Overview

Project Hub is a full-stack web application built with Next.js and Firebase that serves as a digital marketplace for B.Tech (Bachelor of Technology) students. It allows students to browse, purchase, and download high-quality, ready-to-use academic projects, complete with source code, documentation, and presentations. The platform also provides an administrative backend for managing projects, users, and sales, making it a complete solution for both students seeking project resources and administrators managing the marketplace.

The primary motive is to bridge the gap between theoretical knowledge and practical application by providing students with real-world project examples, helping them build their portfolios and accelerate their learning.

---

## 2. Key Features

### User-Facing Features:
- **Project Marketplace**: Browse a list of available projects with filtering and search functionality.
- **Detailed Project View**: View comprehensive details for each project, including description, technologies used, image gallery, and included files.
- **User Authentication**: Secure user registration and login (email/password and Google Sign-In).
- **Shopping Cart**: Add multiple projects to a cart for a single checkout transaction.
- **Simulated Checkout**: A dummy checkout process that simulates a purchase, granting users access to project files upon "successful" payment.
- **User Profile**: A personal dashboard where users can view their purchased projects and download the associated files.
- **Contact Form**: A way for users to send inquiries to administrators.

### Admin-Facing Features:
- **Admin Dashboard**: An overview of key metrics, including total revenue, user count, project count, and a chart visualizing recent sales.
- **Project Management (CRUD)**: Admins can create, read, update, and delete projects in the marketplace.
- **User Management**: View a list of all registered users and identify administrators.
- **Inquiry Management**: View and manage messages submitted through the contact form.
- **Protected Routes**: The entire admin panel is secured and accessible only to users with an `isAdmin` flag in their Firestore document.

---

## 3. Tech Stack

- **Framework**: **Next.js 15** (App Router)
- **Styling**: **Tailwind CSS** with **ShadCN UI** for a modern, component-based design system.
- **State Management**: React Context API and Hooks (`useState`, `useEffect`, `useContext`).
- **Backend & Database**: **Firebase**
  - **Firestore**: NoSQL database for storing data about projects, users, carts, purchases, and inquiries.
  - **Firebase Authentication**: Handles user registration and login.
  - **Firebase Storage**: (Initially used, now deprecated in favor of direct URLs) For storing project files.
- **Form Management**: `react-hook-form` with `zod` for validation.
- **Animations & UI**: `framer-motion` (implied through `tailwindcss-animate`), `embla-carousel-react` for carousels.

---

## 4. Core Concepts & Architecture

### a. Authentication and Authorization
- **Authentication**: Handled via the `useAuth` hook (`src/hooks/use-auth.tsx`), which wraps Firebase's `onAuthStateChanged` listener. This makes the user's authentication state globally available.
- **Authorization**: The admin panel is protected by the `AdminLayout` component (`src/app/admin/layout.tsx`). This layout checks if the logged-in user has the `isAdmin: true` flag in their `users` collection document in Firestore. If not, they are redirected.

### b. Data Flow with Firestore
Firestore is the single source of truth for the application's data. Key collections include:
- `projects`: Stores all project details. Publicly readable.
- `users`: Stores user profile information, including the `isAdmin` flag. Readable/writable only by the specific user or an admin.
- `carts`: Stores the contents of each user's shopping cart. Accessible only by the owning user.
- `purchases`: Stores a list of projects a user has purchased. Accessible only by the owning user.
- `inquiries`: Stores messages from the contact form. Writable by anyone, readable by admins.
- `sales`: A log of all transactions for admin analytics. Writable by authenticated users during checkout.

### c. Shopping Cart & Checkout Logic
- **`useCart` Hook (`src/hooks/use-cart.tsx`)**: This is the heart of the e-commerce functionality. It manages the state of the shopping cart and purchased items.
- **State Synchronization**: The hook synchronizes the cart's state with the user's `carts` document in Firestore in real-time using `onSnapshot`.
- **Dummy Checkout**: The `handleDummyCheckout` function simulates a payment process. On success, it:
  1. Copies items from the `carts` collection to the user's `purchases` collection.
  2. Adds a record to the `sales` collection for admin tracking.
  3. Clears the cart.
  4. Redirects the user to a success page.

### d. Error Handling
- **Firebase Security Rules Errors**: The app uses a custom error handling system (`src/lib/errors.ts` and `src/components/firebase-error-listener.tsx`) to provide detailed, contextual error messages in the Next.js development overlay when a Firestore security rule is violated. This is crucial for debugging permissions.
- **UI Feedback**: `react-hot-toast` (via `useToast` hook) is used to provide non-blocking feedback to users for actions like adding items to the cart or sending a message.

---

## 5. Project Structure

```
/src
├── app
│   ├── (app)                # Main user-facing routes (e.g., /, /projects, /cart)
│   │   ├── layout.tsx       # Layout for the main app
│   │   └── page.tsx         # Homepage
│   ├── admin                # Admin-only routes
│   │   ├── layout.tsx       # Secure layout for the admin panel
│   │   └── page.tsx         # Admin dashboard
│   ├── login                # Login page
│   └── register             # Registration page
│   ├── globals.css          # Global styles & ShadCN theme variables
│   └── layout.tsx           # Root layout for the entire application
│
├── components
│   ├── admin                # Components specific to the admin panel
│   ├── layout               # Layout components (Header, Footer)
│   ├── ui                   # Reusable ShadCN UI components
│   └── *.tsx                # Other shared components (ProjectCard, ThemeToggle, etc.)
│
├── hooks
│   ├── use-auth.tsx         # Manages global authentication state
│   ├── use-cart.tsx         # Manages shopping cart and purchase logic
│   └── use-toast.ts         # Hook for showing toast notifications
│
├── lib
│   ├── firebase.ts          # Firebase initialization and configuration
│   ├── firebase-services.ts # Core functions for interacting with Firestore (getProjects, addUser, etc.)
│   ├── placeholder-data.ts  # Static data (FAQs, categories)
│   └── utils.ts             # Utility functions (e.g., `cn` for classnames)
│
└── tailwind.config.ts       # Tailwind CSS configuration
```

---

## 6. How to Run & Deploy

### Environment Variables
For the application to connect to Firebase, you must provide your Firebase project's configuration. Create a `.env.local` file in the root of the project and add your credentials, using `.env.example` as a template.

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIz...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...
```

These same variables must also be added to your hosting provider's (e.g., Vercel) environment variable settings for the deployed application to work.

### Local Development
1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Admin User
The first user to register with the email `chaitanyaponnada657@gmail.com` will be automatically granted admin privileges. This is handled in `src/lib/firebase-services.ts`.
