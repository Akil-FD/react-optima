# React Optima

A modern React application built with TypeScript, Vite, Redux Toolkit, and React Router.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)

## Features

- **Authentication** - User registration with OTP verification
- **Dashboard** - Interactive dashboard with virtualized lists
- **State Management** - Redux Toolkit for centralized state
- **Form Handling** - React Hook Form with Zod validation
- **Type Safety** - Full TypeScript support
- **Modern UI** - Reusable UI components

## Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.3.1
- **State Management**: Redux Toolkit 2.11.2
- **Routing**: React Router DOM 7.13.0
- **Form Handling**: React Hook Form 7.71.1
- **Validation**: Zod 4.3.6
- **HTTP Client**: Axios 1.13.5
- **Virtualized Lists**: React Window 1.8.7
- **Icons**: React Icons 5.5.0
- **Linting**: ESLint 9.39.1

## Project Structure

```
src/
├── api/                    # API services and axios configuration
│   ├── axios.ts           # Axios instance setup
│   ├── types.ts           # API types
│   └── service/           # API service functions
│       ├── auth.service.ts
│       └── user.service.ts
├── app/                   # Application entry point
│   ├── App.tsx           # Main app component
│   ├── routes.tsx        # Route definitions
│   └── providers/        # React context providers
├── assets/               # Static assets (images, icons)
├── components/          # Reusable components
│   ├── layout/          # Layout components
│   │   ├── DashboardLayout.tsx
│   │   └── Header.tsx
│   └── ui/              # UI components
│       ├── Button/
│       ├── Checkbox/
│       ├── Dialog/
│       ├── Dropdown/
│       ├── Input/
│       ├── MobileNumber/
│       ├── OTPInput/
│       └── VirtualizedInfiniteList/
├── config/              # Configuration files
│   └── env.ts           # Environment variables
├── features/            # Feature-based modules
│   ├── auth/            # Authentication feature
│   │   └── pages/
│   │       └── registration.tsx
│   └── dashboard/       # Dashboard feature
│       └── pages/
│           └── dashboard-home.tsx
├── hooks/               # Custom React hooks
│   └── useApi.ts
├── store/               # Redux store configuration
│   ├── store.ts
│   ├── hooks.ts
│   ├── useAuth.tsx
│   ├── auth/            # Auth slice
│   │   ├── auth.slice.ts
│   │   ├── auth.thunk.ts
│   │   └── auth.types.ts
│   └── users/           # Users slice
│       ├── users.slice.ts
│       ├── users.thunk.ts
│       └── users.types.ts
├── styles/              # Global styles
│   ├── base.css
│   ├── global.css
│   └── variables.css
├── types/               # TypeScript type definitions
│   └── auth.ts
├── utils/               # Utility functions
│   ├── apiError.ts
│   └── constant.ts
├── validators/          # Form validation schemas
│   └── auth-schema.ts
├── main.tsx            # Application entry
└── index.css          # Root styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```
bash
git clone https://github.com/Akil-FD/react-optima.git
cd react-optima
```

2. Install dependencies:
```
bash
npm install
```

3. Start the development server:
```
bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |


## Key Dependencies

- **@reduxjs/toolkit** - Redux state management
- **react-redux** - React bindings for Redux
- **react-router-dom** - Client-side routing
- **react-hook-form** - Form handling
- **zod** - Schema validation
- **axios** - HTTP client
- **react-window** - Virtualized lists for performance
- **react-icons** - Icon library

## Development

The project uses:
- Vite for fast development and building
- TypeScript for type safety
- ESLint for code linting
- Redux Toolkit for predictable state management

## License

MIT
