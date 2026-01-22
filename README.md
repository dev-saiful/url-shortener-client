# URL Shortener Client

A modern, feature-rich URL shortening web application built with Next.js 16 and TypeScript. Create custom branded short links with detailed analytics, expiration dates, and user management.

## ✨ Features

### Core Functionality
- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Short Codes**: Create branded links with custom codes (3-10 alphanumeric characters)
- **Expiration Dates**: Set optional expiration dates for temporary links
- **Click Analytics**: Track click counts, user agents, and referrers for each link
- **Real-time Updates**: Instant link creation with toast notifications

### User Features
- **Authentication**: JWT-based secure authentication with refresh tokens
- **User Dashboard**: Personal dashboard to manage all your shortened URLs
- **Profile Management**: Update user profile information
- **My URLs**: View, edit, and delete your own URLs

### Admin Features
- **Admin Panel**: Dedicated admin dashboard for system management
- **User Management**: View all users, manage roles (USER/ADMIN)
- **URL Oversight**: Monitor and manage all URLs across the platform
- **Role-based Access Control**: Secure admin routes with role verification

### UI/UX
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark Mode Support**: System-aware theming
- **Modern Components**: Built with Radix UI and shadcn/ui
- **Smooth Animations**: Enhanced user experience with Lucide icons and transitions
- **Form Validation**: Client-side validation with Zod and React Hook Form

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 📋 Prerequisites

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- URL Shortener Backend API running (see environment variables)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dev-saiful/url-shortener-client.git
cd url-shortener-client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📁 Project Structure

```
url-shortener-client/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── profile/           # User profile
│   ├── urls/              # URL stats pages
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Navigation header
│   ├── url-form.tsx      # URL creation form
│   └── url-card.tsx      # URL display card
├── context/              # React contexts
│   └── auth-context.tsx  # Authentication context
├── lib/                  # Utility libraries
│   ├── api.ts           # API client and helpers
│   └── utils.ts         # Utility functions
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types
└── public/              # Static assets
```

## 🎯 Usage

### Creating a Short URL

1. Visit the homepage or dashboard
2. Enter your long URL in the input field
3. (Optional) Click "Show advanced options" to:
   - Set a custom short code
   - Set an expiration date
4. Click "Shorten URL"
5. Copy your new short link!

### Managing URLs

1. Sign up or log in to your account
2. Navigate to the Dashboard
3. View all your shortened URLs with statistics
4. Click "Stats" to see detailed analytics
5. Delete URLs you no longer need

### Admin Panel

1. Log in with an admin account
2. Navigate to `/admin`
3. Manage users and URLs across the platform
4. Change user roles between USER and ADMIN

## 🔐 Authentication

The application uses JWT-based authentication with:
- Access tokens for API requests
- Refresh tokens for automatic token renewal
- LocalStorage for client-side token persistence
- Automatic redirect to login for protected routes

## 🌐 Backend Integration

This client requires the URL Shortener Backend API. The API endpoints used include:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /urls` - Create short URL
- `GET /urls/my` - Get user's URLs
- `GET /urls/:code/stats` - Get URL statistics
- `DELETE /urls/:code` - Delete URL
- `GET /admin/urls` - Admin: Get all URLs
- `GET /admin/users` - Admin: Get all users

## 📄 License

This project is private and proprietary.

## 👤 Author

**Saiful Islam**

---

Built with ❤️ using Next.js and TypeScript
