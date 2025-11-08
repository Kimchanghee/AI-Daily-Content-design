"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, type User } from "@/lib/auth"
import { Spinner } from "@/components/ui/spinner"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAuth = true, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()

      if (requireAuth && !currentUser) {
        router.push("/auth/login")
        return
      }

      if (requireAdmin && currentUser?.role !== "admin") {
        router.push("/dashboard")
        return
      }

      setUser(currentUser)
      setLoading(false)
    }

    checkAuth()
  }, [requireAuth, requireAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return <>{children}</>
}
