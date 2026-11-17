import { useState } from 'react'
import { getSession, clearSession } from '../lib/auth.js'

export function useAuth() {
  const [escola, setEscola] = useState(() => getSession())

  function login(escolaData) {
    setEscola(escolaData)
  }

  function logout() {
    clearSession()
    setEscola(null)
  }

  return { escola, login, logout, isAuthenticated: !!escola }
}
