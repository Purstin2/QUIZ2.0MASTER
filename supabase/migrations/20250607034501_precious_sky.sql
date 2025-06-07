/*
  # Fix Quiz Responses RLS Policies

  1. Security Updates
    - Drop existing policies that may be conflicting
    - Create new policies for anonymous users to insert quiz responses
    - Create policy for users to read their own responses
    - Ensure RLS is properly enabled

  2. Changes
    - Allow anonymous users to insert quiz responses
    - Allow authenticated users to read their own responses based on email
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert quiz responses" ON quiz_responses;
DROP POLICY IF EXISTS "Users can read own responses" ON quiz_responses;

-- Ensure RLS is enabled
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert quiz responses
CREATE POLICY "Allow anonymous insert quiz responses"
  ON quiz_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public read access for checking email existence
CREATE POLICY "Allow public read for email check"
  ON quiz_responses
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to read their own responses
CREATE POLICY "Allow authenticated users read own responses"
  ON quiz_responses
  FOR SELECT
  TO authenticated
  USING (auth.email() = email);