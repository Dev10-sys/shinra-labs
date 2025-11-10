import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { getUserProfile } from '../services/supabase'

export const useAdmin = () => {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    const checkAdmin = async () => {
      try {
        const profile = await getUserProfile(user.id)
        setIsAdmin(profile.role === 'admin')
      } catch (error) {
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [user?.id])

  return { isAdmin, loading }
}
