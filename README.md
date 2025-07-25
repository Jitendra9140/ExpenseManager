# Expense Manager - Full Stack App

A modern expense management application built with Next.js, Prisma, and Neon PostgreSQL.

## 🚀 Features

- **Authentication**: Secure email/password authentication with JWT
- **Dashboard**: Financial overview with balance, income, and expense tracking
- **Transactions**: Add, view, and categorize income and expenses
- **Categories**: Custom category management
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Real-time Updates**: Instant UI updates after actions

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **Database**: Neon PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT implementation with bcrypt
- **Validation**: Zod for schema validation
- **Forms**: React Hook Form

## 📋 Prerequisites

- Node.js 18+ 
- A Neon PostgreSQL database (free tier available)

## 🔧 Setup Instructions

### 1. Clone and Install

\`\`\`bash
git clone <your-repo>
cd expense-manager
npm install
\`\`\`

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Required environment variables:

\`\`\`env
# Neon Database URL (get from https://console.neon.tech/)
DATABASE_URL="postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="another-secure-secret-for-nextauth"
NODE_ENV="development"
\`\`\`

### 3. Database Setup

\`\`\`bash
# Generate Prisma client
npx prisma generate

# Push schema to Neon database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
\`\`\`

### 4. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 🗄️ Database Schema

### User
- `id`: Unique identifier
- `name`: User's full name
- `email`: Email address (unique)
- `password`: Hashed password
- `createdAt`: Account creation timestamp

### Category
- `id`: Unique identifier
- `name`: Category name
- `userId`: Foreign key to User
- `createdAt`: Creation timestamp

### Transaction
- `id`: Unique identifier
- `type`: INCOME or EXPENSE
- `amount`: Transaction amount (Decimal)
- `note`: Optional description
- `date`: Transaction date
- `categoryId`: Foreign key to Category
- `userId`: Foreign key to User
- `createdAt`: Creation timestamp

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: HTTP-only cookies for session management
- **Route Protection**: Middleware-based authentication
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM parameterized queries

## 📱 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out

### Transactions
- `GET /api/transactions` - Get user transactions (with pagination)
- `POST /api/transactions` - Create new transaction

### Categories
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create new category
- `DELETE /api/categories/[id]` - Delete category

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `DATABASE_URL` - Your Neon production database URL
- `JWT_SECRET` - A secure random string (32+ characters)
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Another secure random string

## 🔧 Development Scripts

\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:reset     # Reset database (development only)

# Other
npm run lint         # Run ESLint
\`\`\`

## 🎨 Customization

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma`
2. **API Routes**: Add files in `app/api/`
3. **UI Components**: Create components in `components/`
4. **Pages**: Add files in `app/`

### Styling

- **Colors**: Modify `tailwind.config.ts`
- **Components**: Customize ShadCN components in `components/ui/`
- **Themes**: Update theme provider in `components/theme-provider.tsx`

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your `DATABASE_URL` is correct
   - Check Neon database is active
   - Ensure SSL mode is enabled

2. **JWT Secret Error**
   - Make sure `JWT_SECRET` is set in `.env.local`
   - Use a secure random string (32+ characters)

3. **Prisma Client Error**
   - Run `npx prisma generate`
   - Clear `.next` folder and restart dev server

### Getting Help

- Check the [Neon Documentation](https://neon.tech/docs)
- Review [Prisma Documentation](https://www.prisma.io/docs)
- Open an issue in the repository

## 📄 License

This project is licensed under the MIT License.
