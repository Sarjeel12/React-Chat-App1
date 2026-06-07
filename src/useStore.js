import { useState, useEffect } from 'react'
import * as storage from './storage'
import { supabase } from './config/supabase'

// Hook that manages app state with Supabase backend
export function useStore() {
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(storage.getLoggedInUser())
  const [loading, setLoading] = useState(true)

  // Load users on mount
  useEffect(() => {
    loadUsers()
  }, [])

  // Listen for storage changes (login/logout from other tabs or pages)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'chat_user') {
        try {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null
          setUser(newUser)
        } catch {
          setUser(null)
        }
      }
    }

    // Check localStorage periodically to handle same-tab updates
    const checkStorageInterval = setInterval(() => {
      const storedUser = storage.getLoggedInUser()
      setUser(storedUser)
    }, 1000)

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(checkStorageInterval)
    }
  }, [])

  async function loadUsers() {
    setLoading(true)
    const fetchedUsers = await storage.getUsers()
    setUsers(fetchedUsers)
    setLoading(false)
  }

  function login(email, password) {
    // Note: Login is handled in Login.jsx with Supabase
    // This is kept for compatibility
    return false
  }

  function signup(name, email, password) {
    // Note: Signup is handled in Signup.jsx with Supabase
    // This is kept for compatibility
    return false
  }

  function logout() {
    storage.saveLoggedInUser(null)
    setUser(null)
    // Hard reset to avoid ghost state
    window.location.replace('/')
  }

  async function sendMessage(fromUserId, toUserId, text, roomId) {
    const newMessage = {
      room_id: roomId,
      sender_id: fromUserId,
      text,
    }
    
    const result = await storage.saveMessage(newMessage)
    return result
  }

  return {
    users,
    user,
    loading,
    login,
    signup,
    logout,
    sendMessage,
    setUser,
    loadUsers,
  }
}
