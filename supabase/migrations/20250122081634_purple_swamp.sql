/*
  # Initial Schema Setup for LegalFinanceAI

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `role` (enum: admin, professional, client)
      - `created_at` (timestamp)
    
    - `documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `file_url` (text)
      - `analysis` (text, nullable)
      - `created_at` (timestamp)
    
    - `compliance`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (enum: GST, INCOME_TAX, ROC)
      - `deadline` (timestamp)
      - `status` (enum: PENDING, COMPLETED)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'professional', 'client');
CREATE TYPE compliance_type AS ENUM ('GST', 'INCOME_TAX', 'ROC');
CREATE TYPE compliance_status AS ENUM ('PENDING', 'COMPLETED');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  created_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  analysis text,
  created_at timestamptz DEFAULT now()
);

-- Create compliance table
CREATE TABLE IF NOT EXISTS compliance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type compliance_type NOT NULL,
  deadline timestamptz NOT NULL,
  status compliance_status NOT NULL DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for documents table
CREATE POLICY "Users can view their own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create policies for compliance table
CREATE POLICY "Users can view their own compliance records"
  ON compliance
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own compliance records"
  ON compliance
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own compliance records"
  ON compliance
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());