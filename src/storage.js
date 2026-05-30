// Supabase storage helpers
import { supabase } from './config/supabase'

const KEYS = {
  user: 'chat_user',
}

// Get all users from Supabase
export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.error('Error fetching users:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Error in getUsers:', err)
    return []
  }
}

// Get logged-in user from session storage (browser session)
export function getLoggedInUser() {
  const raw = localStorage.getItem(KEYS.user)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// Save logged-in user to session storage after successful auth
export function saveLoggedInUser(user) {
  if (user) {
    localStorage.setItem(KEYS.user, JSON.stringify(user))
  } else {
    localStorage.removeItem(KEYS.user)
  }
}

// Get messages from Supabase for a specific room
export async function getMessages(roomId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching messages:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Error in getMessages:', err)
    return []
  }
}

// Save message to Supabase
export async function saveMessage(message) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
      .single()
    
    if (error) {
      console.error('Error saving message:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Error in saveMessage:', err)
    return null
  }
}
