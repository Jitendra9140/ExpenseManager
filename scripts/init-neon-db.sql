-- Initialize Neon PostgreSQL database
-- This script sets up the database with proper extensions and configurations

-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
-- These will be created automatically by Prisma, but listed here for reference

-- Index on user email for faster authentication
-- CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");

-- Index on transaction user_id and date for faster dashboard queries
-- CREATE INDEX IF NOT EXISTS "Transaction_userId_date_idx" ON "Transaction"("userId", "date" DESC);

-- Index on category user_id for faster category queries
-- CREATE INDEX IF NOT EXISTS "Category_userId_idx" ON "Category"("userId");

-- Note: Prisma will handle the actual table creation and indexing
-- This file is mainly for documentation and any custom setup needed
