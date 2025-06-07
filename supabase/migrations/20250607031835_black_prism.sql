/*
  # Create quiz responses table

  1. New Tables
    - `quiz_responses`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `age` (text)
      - `pain_level` (integer)
      - `main_problem` (text)
      - `duration` (text)
      - `previous_treatment` (text)
      - `lifestyle` (text)
      - `time_available` (text)
      - `investment` (text)
      - `user_score` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `quiz_responses` table
    - Add policy for public insert (since this is a lead capture form)
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  age text,
  pain_level integer,
  main_problem text,
  duration text,
  previous_treatment text,
  lifestyle text,
  time_available text,
  investment text,
  user_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert quiz responses (lead capture)
CREATE POLICY "Anyone can insert quiz responses"
  ON quiz_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow users to read their own responses if authenticated
CREATE POLICY "Users can read own responses"
  ON quiz_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create index for better performance on email lookups
CREATE INDEX IF NOT EXISTS idx_quiz_responses_email ON quiz_responses(email);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_created_at ON quiz_responses(created_at DESC);