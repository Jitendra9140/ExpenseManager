#!/bin/bash

# Setup script for the expense manager app

echo "Setting up Expense Manager..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema
echo "Setting up database..."
npx prisma db push

echo "Setup complete! Run 'npm run dev' to start the development server."
