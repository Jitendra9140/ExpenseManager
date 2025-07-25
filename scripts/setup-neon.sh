#!/bin/bash

# Setup script for the expense manager app with Neon PostgreSQL

echo "Setting up Expense Manager with Neon PostgreSQL..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your actual Neon database URL and secrets!"
    echo "   Get your Neon connection string from: https://console.neon.tech/"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not found in environment variables."
    echo "   Please set your Neon database URL in .env.local"
    echo "   Example: DATABASE_URL=\"postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require\""
else
    echo "Database URL found, pushing schema to Neon..."
    npx prisma db push
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Neon database URL"
echo "2. Run 'npx prisma db push' to create tables"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "Neon Dashboard: https://console.neon.tech/"
echo "Prisma Studio: npm run db:studio"
