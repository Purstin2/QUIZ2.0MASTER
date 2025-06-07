import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our quiz response
export interface QuizResponse {
  id?: string
  email: string
  age?: string
  pain_level?: number
  main_problem?: string
  duration?: string
  previous_treatment?: string
  lifestyle?: string
  time_available?: string
  investment?: string
  user_score?: number
  created_at?: string
}

// Function to save quiz response
export async function saveQuizResponse(data: QuizResponse) {
  try {
    const { data: result, error } = await supabase
      .from('quiz_responses')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('Error saving quiz response:', error)
      throw error
    }

    return result
  } catch (error) {
    console.error('Failed to save quiz response:', error)
    throw error
  }
}

// Function to check if email already exists
export async function checkEmailExists(email: string) {
  try {
    const { data, error } = await supabase
      .from('quiz_responses')
      .select('email')
      .eq('email', email)
      .limit(1)

    if (error) {
      console.error('Error checking email:', error)
      throw error
    }

    return data && data.length > 0 // Returns true if email exists, false otherwise
  } catch (error) {
    console.error('Failed to check email:', error)
    return false
  }
}