"use client"

import { useState, useEffect } from "react"
import { authService } from "@/lib/api/auth.service"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsAuthenticated(authService.isAuthenticated())
    setIsLoading(false)
  }, [])

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  }
}
